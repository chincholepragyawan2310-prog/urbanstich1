import requests

BASE_URL = "http://localhost:4000"
HEADERS = {"Content-Type": "application/json"}
TIMEOUT = 30

def test_newsletter_subscription_should_validate_email_and_store_subscription():
    url = f"{BASE_URL}/api/newsletter/subscribe"

    # Test case 1: Successful subscription with a valid email
    valid_payload = {"email": "testuser@example.com"}
    try:
        response = requests.post(url, json=valid_payload, headers=HEADERS, timeout=TIMEOUT)
        response.raise_for_status()
        json_resp = response.json()
        assert response.status_code == 200, f"Expected status code 200, got {response.status_code}"
        assert "ok" in json_resp, "'ok' key not in response"
        assert isinstance(json_resp["ok"], bool), "'ok' value is not boolean"
        assert json_resp["ok"] is True, "Subscription not successful when it should be"
    except requests.exceptions.RequestException as e:
        assert False, f"HTTP request failed: {e}"

    # Test case 2: Missing email field
    missing_email_payload = {}
    response = requests.post(url, json=missing_email_payload, headers=HEADERS, timeout=TIMEOUT)
    assert response.status_code == 400, f"Expected status code 400 for missing email, got {response.status_code}"

    # Test case 3: Invalid email format
    invalid_email_payload = {"email": "invalid-email-format"}
    response = requests.post(url, json=invalid_email_payload, headers=HEADERS, timeout=TIMEOUT)
    # The PRD says validation for email format, so expect 400 error
    assert response.status_code == 400, f"Expected status code 400 for invalid email format, got {response.status_code}"


test_newsletter_subscription_should_validate_email_and_store_subscription()