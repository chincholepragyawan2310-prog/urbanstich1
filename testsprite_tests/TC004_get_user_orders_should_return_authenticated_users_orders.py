import requests
import uuid

BASE_URL = "http://localhost:4000"
TIMEOUT = 30

def test_get_user_orders_should_return_authenticated_users_orders():
    # Register a test user
    register_url = f"{BASE_URL}/api/auth/register"
    login_url = f"{BASE_URL}/api/auth/login"
    orders_url = f"{BASE_URL}/api/orders"

    test_email = f"testuser+{uuid.uuid4().hex[:8]}@example.com"
    test_password = "Password123!"
    test_name = "Test User"

    register_payload = {
        "name": test_name,
        "email": test_email,
        "password": test_password
    }

    # Create product first for order items
    # But we do not have product creation endpoint for user, so we must get a product to create an order
    # So we fetch products to get a productId for the order creation
    products_url = f"{BASE_URL}/api/products"
    try:
        # Register user
        reg_resp = requests.post(register_url, json=register_payload, timeout=TIMEOUT)
        assert reg_resp.status_code == 200, f"Registration failed: {reg_resp.text}"
        
        # Login user to get token
        login_payload = {
            "email": test_email,
            "password": test_password
        }
        login_resp = requests.post(login_url, json=login_payload, timeout=TIMEOUT)
        assert login_resp.status_code == 200, f"Login failed: {login_resp.text}"
        login_data = login_resp.json()
        token = login_data.get("token")
        assert token, "Token not received after login"

        headers = {"Authorization": f"Bearer {token}"}

        # Get products to pick one for order creation
        products_resp = requests.get(products_url, timeout=TIMEOUT)
        assert products_resp.status_code == 200, f"Get products failed: {products_resp.text}"
        products_data = products_resp.json()
        products_list = products_data.get("products", [])
        assert products_list, "No products available to create order"

        product = products_list[0]
        product_id = product.get("id")
        assert product_id, "Product id missing"

        # Create a new order for the authenticated user to have at least one order
        order_payload = {
            "items": [{
                "productId": product_id,
                "quantity": 1,
                "size": "M"
            }]
        }
        order_resp = requests.post(orders_url, json=order_payload, headers=headers, timeout=TIMEOUT)
        assert order_resp.status_code == 200, f"Order creation failed: {order_resp.text}"
        order_data = order_resp.json()
        order_id = order_data.get("orderId")
        assert order_id, "Order ID missing in order creation response"

        # Now test the GET /api/orders for the authenticated user
        get_orders_resp = requests.get(orders_url, headers=headers, timeout=TIMEOUT)
        assert get_orders_resp.status_code == 200, f"Get user orders failed: {get_orders_resp.text}"
        orders_resp_data = get_orders_resp.json()
        orders = orders_resp_data.get("orders")
        assert isinstance(orders, list), "Orders data is not a list"

        # Verify the created order is in the orders list
        order_ids = [order.get("orderId") for order in orders]
        assert order_id in order_ids, "Created order not found in user's orders"

        # Verify authentication is enforced: Access without token should fail with 401
        unauthorized_resp = requests.get(orders_url, timeout=TIMEOUT)
        assert unauthorized_resp.status_code == 401, "Unauthorized access to orders did not fail as expected"

    finally:
        # Try to cleanup: delete the created order and user if applicable
        # No delete order or user endpoint documented, so skipping deletion
        # Usually cleanup would be done here if API supports it
        pass

test_get_user_orders_should_return_authenticated_users_orders()
