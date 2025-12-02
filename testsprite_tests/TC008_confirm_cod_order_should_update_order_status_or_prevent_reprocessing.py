import requests
import uuid
import time

BASE_URL = "http://localhost:4000"
TIMEOUT = 30

def test_confirm_cod_order_should_update_order_status_or_prevent_reprocessing():
    headers = {"Content-Type": "application/json"}
    created_order_id = None

    # Helper function to create a sample product if none exist
    def get_any_product_id():
        try:
            resp = requests.get(f"{BASE_URL}/api/products", timeout=TIMEOUT)
            resp.raise_for_status()
            products = resp.json().get("products", [])
            if products:
                return products[0]["id"]
            else:
                return None
        except Exception:
            return None

    # Helper function to create a new order with COD payment (simulate by just creating order)
    def create_order():
        product_id = get_any_product_id()
        if not product_id:
            raise RuntimeError("No product found to create order")
        order_payload = {
            "items": [
                {
                    "productId": product_id,
                    "quantity": 1,
                    "size": "M"
                }
            ]
        }
        resp = requests.post(f"{BASE_URL}/api/orders", json=order_payload, headers=headers, timeout=TIMEOUT)
        resp.raise_for_status()
        order_data = resp.json()
        if "orderId" not in order_data:
            raise RuntimeError("Order creation failed, no orderId returned")
        return order_data["orderId"]

    try:
        # Create a new order to confirm COD status
        created_order_id = create_order()

        # 1) Confirm COD order first time - should succeed and update order status
        cod_confirm_resp = requests.post(f"{BASE_URL}/api/orders/{created_order_id}/cod-confirm",
                                         headers=headers, timeout=TIMEOUT)
        assert cod_confirm_resp.status_code == 200, f"Expected 200 on first COD confirm, got {cod_confirm_resp.status_code}"
        cod_confirm_json = cod_confirm_resp.json()
        assert cod_confirm_json.get("success") is True, "Expected success true on first COD confirm"
        assert cod_confirm_json.get("orderId") == created_order_id, "Returned orderId mismatch on first COD confirm"
        assert "message" in cod_confirm_json and isinstance(cod_confirm_json["message"], str), "Missing message on first COD confirm"

        # 2) Try to confirm same COD order again - should fail with 400 Bad Request (order already processed)
        cod_confirm_resp_2 = requests.post(f"{BASE_URL}/api/orders/{created_order_id}/cod-confirm",
                                           headers=headers, timeout=TIMEOUT)
        # Expected 400 response for re-processing prevention
        assert cod_confirm_resp_2.status_code == 400 or cod_confirm_resp_2.status_code == 409, \
            f"Expected 400 or 409 on re-processing COD confirm, got {cod_confirm_resp_2.status_code}"
        cod_confirm_json_2 = cod_confirm_resp_2.json()
        # The error message about already processed order should be present
        expected_error_msg = "already processed"
        assert ("message" in cod_confirm_json_2 and expected_error_msg in cod_confirm_json_2["message"].lower()) or \
               ('error' in cod_confirm_json_2 and expected_error_msg in str(cod_confirm_json_2.get('error', '')).lower()), \
               "Expected error message about already processed order on second COD confirm"

        # 3) Confirm COD with a non-existing order id - should return 404 Not Found
        fake_order_id = str(uuid.uuid4())
        cod_confirm_resp_3 = requests.post(f"{BASE_URL}/api/orders/{fake_order_id}/cod-confirm",
                                           headers=headers, timeout=TIMEOUT)
        assert cod_confirm_resp_3.status_code == 404, f"Expected 404 for non-existent order, got {cod_confirm_resp_3.status_code}"

    finally:
        # Clean up - delete the created order if API supports deletion (not described in PRD)
        # If such endpoint doesn't exist, this block will simply pass
        if created_order_id:
            try:
                requests.delete(f"{BASE_URL}/api/orders/{created_order_id}", headers=headers, timeout=TIMEOUT)
            except Exception:
                pass

test_confirm_cod_order_should_update_order_status_or_prevent_reprocessing()
