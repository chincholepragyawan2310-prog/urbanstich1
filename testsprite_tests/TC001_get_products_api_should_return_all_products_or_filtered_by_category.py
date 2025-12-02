import requests

BASE_URL = "http://localhost:4000"
PRODUCTS_ENDPOINT = f"{BASE_URL}/api/products"
TIMEOUT = 30

def test_get_products_api_should_return_all_products_or_filtered_by_category():
    categories = ["t-shirts", "shirts", "jeans", "jackets"]

    # Test without any category filter: should return all products
    try:
        response = requests.get(PRODUCTS_ENDPOINT, timeout=TIMEOUT)
        response.raise_for_status()
    except requests.RequestException as e:
        assert False, f"GET /api/products without filter failed: {e}"
    data = response.json()
    assert isinstance(data, dict), "Response is not a JSON object"
    assert "products" in data, "Response JSON missing 'products' key"
    assert isinstance(data["products"], list), "'products' is not a list"
    total_products_count = len(data["products"])

    # Each product should have required properties with correct types
    for product in data["products"]:
        assert isinstance(product, dict), "Product item is not an object"
        for prop_name, prop_type in [("id", str), ("title", str), ("price", (int, float)),
                                     ("image", str), ("category", str)]:
            assert prop_name in product, f"Product missing '{prop_name}'"
            assert isinstance(product[prop_name], prop_type), f"Product '{prop_name}' has wrong type"

    # Test with each valid category filter
    for category in categories:
        try:
            resp = requests.get(PRODUCTS_ENDPOINT, params={"category": category}, timeout=TIMEOUT)
            resp.raise_for_status()
        except requests.RequestException as e:
            assert False, f"GET /api/products with category={category} failed: {e}"
        resp_data = resp.json()
        assert isinstance(resp_data, dict), "Filtered response is not a JSON object"
        assert "products" in resp_data, "Filtered response missing 'products' key"
        assert isinstance(resp_data["products"], list), "'products' in filtered response is not a list"

        # Each returned product must have the matching category
        for product in resp_data["products"]:
            assert isinstance(product, dict), "Product in filtered response is not an object"
            assert "category" in product, "Product missing 'category'"
            assert product["category"] == category, (
                f"Product category '{product['category']}' does not match filter '{category}'")

    # Additional check: filtered results count should be <= total products count
    category_counts = []
    for category in categories:
        resp = requests.get(PRODUCTS_ENDPOINT, params={"category": category}, timeout=TIMEOUT)
        resp.raise_for_status()
        cat_products = resp.json().get("products", [])
        category_counts.append(len(cat_products))
    assert all(c <= total_products_count for c in category_counts), "Filtered list size exceeds total products size"


test_get_products_api_should_return_all_products_or_filtered_by_category()