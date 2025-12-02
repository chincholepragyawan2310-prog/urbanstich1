import requests

BASE_URL = "http://localhost:4000"
CHECKOUT_ENDPOINT = "/api/checkout"
PRODUCTS_ENDPOINT = "/api/products"

def legacy_checkout_should_process_checkout_or_return_error_for_empty_cart():
    headers = {'Content-Type': 'application/json'}
    timeout = 30

    # Step 1: Test successful checkout with cart items
    try:
        # Get products to use for cart items
        resp_products = requests.get(f"{BASE_URL}{PRODUCTS_ENDPOINT}", timeout=timeout)
        assert resp_products.status_code == 200, f"Failed to get products, status: {resp_products.status_code}"
        products_data = resp_products.json()
        products = products_data.get("products", [])
        assert isinstance(products, list) and len(products) > 0, "No products available to test checkout"

        # Prepare cart with at least one item
        product_sample = products[0]
        items = [{"productId": product_sample.get("id"), "quantity": 1, "size": "M"}]

        payload = {"items": items}
        resp_checkout = requests.post(f"{BASE_URL}{CHECKOUT_ENDPOINT}", json=payload, headers=headers, timeout=timeout)
        assert resp_checkout.status_code == 200, f"Checkout failed with status code {resp_checkout.status_code} and body: {resp_checkout.text}"

        resp_json = resp_checkout.json()
        assert "orderId" in resp_json and isinstance(resp_json["orderId"], str) and resp_json["orderId"], "Missing or invalid orderId in checkout response"
        assert "total" in resp_json and (isinstance(resp_json["total"], int) or isinstance(resp_json["total"], float)), "Missing or invalid total in checkout response"

    except (requests.RequestException, AssertionError) as e:
        raise AssertionError(f"Legacy checkout success test failed: {e}")

    # Step 2: Test error on empty cart
    try:
        empty_payload = {"items": []}
        resp_empty = requests.post(f"{BASE_URL}{CHECKOUT_ENDPOINT}", json=empty_payload, headers=headers, timeout=timeout)
        assert resp_empty.status_code == 400, f"Empty cart checkout should return 400, got {resp_empty.status_code}"
    except (requests.RequestException, AssertionError) as e:
        raise AssertionError(f"Legacy checkout empty cart test failed: {e}")

legacy_checkout_should_process_checkout_or_return_error_for_empty_cart()