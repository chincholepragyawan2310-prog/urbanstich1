import requests
import uuid

BASE_URL = "http://localhost:4000"
TIMEOUT = 30

def create_test_user():
    url = f"{BASE_URL}/api/auth/register"
    unique_email = f"testuser_{uuid.uuid4().hex}@example.com"
    payload = {
        "name": "Test User",
        "email": unique_email,
        "password": "TestPass123!"
    }
    resp = requests.post(url, json=payload, timeout=TIMEOUT)
    resp.raise_for_status()
    return resp.json()

def login_test_user(email, password):
    url = f"{BASE_URL}/api/auth/login"
    payload = {
        "email": email,
        "password": password
    }
    resp = requests.post(url, json=payload, timeout=TIMEOUT)
    resp.raise_for_status()
    return resp.json()

def get_products(token):
    url = f"{BASE_URL}/api/products"
    headers = {"Authorization": f"Bearer {token}"}
    resp = requests.get(url, headers=headers, timeout=TIMEOUT)
    resp.raise_for_status()
    return resp.json()

def delete_order(order_id, token):
    # If delete endpoint exists, otherwise ignore
    url = f"{BASE_URL}/api/orders/{order_id}"
    headers = {"Authorization": f"Bearer {token}"}
    try:
        resp = requests.delete(url, headers=headers, timeout=TIMEOUT)
        # If not found or no delete method, just ignore
    except:
        pass

def test_create_order_should_validate_and_create_order_from_cart_items():
    # Step 1: Register and login a new user
    user_data = create_test_user()
    token = user_data.get("token")
    assert token, "Registration did not return a token"
    email = user_data["user"]["email"]
    password = "TestPass123!"

    login_data = login_test_user(email, password)
    token = login_data.get("token")
    assert token, "Login did not return a token"

    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}

    # Step 2: Get list of products - to use valid productIds
    products_resp = get_products(token)
    products = products_resp.get("products", [])
    assert isinstance(products, list) and len(products) > 0, "No products available to create order"

    # Select 2 valid cart items with different products and sizes
    cart_items = []
    count = 0
    for prod in products:
        if count >= 2:
            break
        # Build item with qty and size fallback
        cart_items.append({"productId": prod["id"], "quantity": 1, "size": "M"})
        count += 1

    # Validate empty cart should return 400
    url_order = f"{BASE_URL}/api/orders"
    resp_empty = requests.post(url_order, headers=headers, json={"items": []}, timeout=TIMEOUT)
    assert resp_empty.status_code == 400, "Empty cart should return 400 Bad Request"

    # Validate invalid product ID should return 400
    invalid_items = [{"productId": "invalid_id_xyz", "quantity": 1, "size": "M"}]
    resp_invalid = requests.post(url_order, headers=headers, json={"items": invalid_items}, timeout=TIMEOUT)
    assert resp_invalid.status_code == 400, "Invalid product id should return 400 Bad Request"

    # Step 3: Create order with valid cart items
    order_payload = {"items": cart_items}
    try:
        resp = requests.post(url_order, headers=headers, json=order_payload, timeout=TIMEOUT)
        assert resp.status_code == 200, f"Order creation failed with status {resp.status_code}"
        order_data = resp.json()
        order_id = order_data.get("orderId")
        total = order_data.get("total")
        assert order_id and isinstance(order_id, str), "Response missing orderId"
        assert total is not None and isinstance(total, (int,float)) and total > 0, "Response missing or invalid total"

        # Optionally, validate total is sum of product prices * quantities
        # Fetch product prices to validate total
        product_map = {p["id"]: p for p in products}
        expected_total = 0
        for item in cart_items:
            pid = item["productId"]
            qty = item["quantity"]
            if pid in product_map:
                expected_total += product_map[pid]["price"] * qty
        # Allow small floating difference tolerance
        assert abs(total - expected_total) < 0.01, f"Total {total} does not match expected {expected_total}"

    finally:
        # Cleanup: Delete created order (if endpoint supported)
        if 'order_id' in locals():
            delete_order(order_id, token)

test_create_order_should_validate_and_create_order_from_cart_items()
