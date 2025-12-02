import requests
import uuid

BASE_URL = r"http://localhost:4000"
TIMEOUT = 30

def create_user_and_get_token():
    register_url = f"{BASE_URL}/api/auth/register"
    login_url = f"{BASE_URL}/api/auth/login"
    # Generate unique user info
    unique_email = f"testuser_{uuid.uuid4().hex[:8]}@example.com"
    password = "TestPass123"
    name = "Test User"

    # Register user
    resp = requests.post(register_url, json={"name": name, "email": unique_email, "password": password}, timeout=TIMEOUT)
    if resp.status_code not in (200, 400):
        resp.raise_for_status()
    # If already registered, proceed to login
    if resp.status_code == 400:
        pass  # just try login

    # Login user to get token
    resp = requests.post(login_url, json={"email": unique_email, "password": password}, timeout=TIMEOUT)
    resp.raise_for_status()
    data = resp.json()
    token = data.get("token")
    assert token is not None, "Login did not return a token"
    user_id = data.get("user", {}).get("id")
    assert user_id is not None, "Login did not return user id"
    return token, user_id


def create_product():
    # No API to create product documented, skip product creation; assume product exists.
    # Instead we will try to get products and pick one for order creation.
    products_url = f"{BASE_URL}/api/products"
    resp = requests.get(products_url, timeout=TIMEOUT)
    resp.raise_for_status()
    data = resp.json()
    products = data.get("products", [])
    if not products:
        raise Exception("No products available to create order")
    return products[0]["id"]


def create_order(token, product_id):
    order_url = f"{BASE_URL}/api/orders"
    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
    payload = {
        "items": [
            {
                "productId": product_id,
                "quantity": 1,
                "size": "M"
            }
        ]
    }
    resp = requests.post(order_url, json=payload, headers=headers, timeout=TIMEOUT)
    resp.raise_for_status()
    return resp.json()


def delete_order(token, order_id):
    # No documented API to delete order, skip deletion; if implemented can add here.
    pass


def test_create_razorpay_order_should_create_payment_order_or_fail_gracefully():
    token, user_id = None, None
    order_id = None
    try:
        # Authenticate user and get token
        token, user_id = create_user_and_get_token()

        # Get a valid product id
        product_id = create_product()

        # Create a new order to use in payment order creation
        order_resp = create_order(token, product_id)
        order_id = order_resp.get("orderId")
        assert order_id, "Order ID was not returned in create order response"

        # Attempt to create Razorpay order for valid order id
        url = f"{BASE_URL}/api/payment/create-razorpay-order"
        headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json"
        }
        payload = {"orderId": order_id}
        resp = requests.post(url, json=payload, headers=headers, timeout=TIMEOUT)
        assert resp.status_code == 200, f"Expected 200 status but got {resp.status_code}"
        razorpay_data = resp.json()
        # Check expected fields in response
        for field in ["key", "amount", "currency", "razorpayOrderId", "orderId"]:
            assert field in razorpay_data, f"Missing field '{field}' in razorpay order response"
        assert razorpay_data["orderId"] == order_id, "Returned orderId does not match requested orderId"

        # Test missing orderId in payload -> expect 400
        resp_missing = requests.post(url, json={}, headers=headers, timeout=TIMEOUT)
        assert resp_missing.status_code == 400, f"Expected 400 for missing orderId but got {resp_missing.status_code}"

        # Test invalid/non-existent orderId -> expect 404
        invalid_order_id = "nonexistentorderid123"
        resp_invalid = requests.post(url, json={"orderId": invalid_order_id}, headers=headers, timeout=TIMEOUT)
        assert resp_invalid.status_code == 404, f"Expected 404 for invalid orderId but got {resp_invalid.status_code}"

        # (Optional) Test already processed order scenario:
        # Without API doc about marking order processed, this is difficult to create accurately.
        # But we can attempt to create a razorpay order again for same order and expect graceful handling (most likely 400)
        resp_repeated = requests.post(url, json={"orderId": order_id}, headers=headers, timeout=TIMEOUT)
        # It can be 200 or 400 or 500 depending on backend logic, so check if 200 or 400:
        assert resp_repeated.status_code in (200,400), f"Unexpected status code {resp_repeated.status_code} on repeated razorpay order creation"

    finally:
        if token and order_id:
            delete_order(token, order_id)


test_create_razorpay_order_should_create_payment_order_or_fail_gracefully()
