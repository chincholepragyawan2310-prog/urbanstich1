import requests
import uuid

BASE_URL = "http://localhost:4000"
REGISTER_ENDPOINT = "/api/auth/register"
TIMEOUT = 30
HEADERS = {"Content-Type": "application/json"}


def user_registration_should_validate_and_register_new_user():
    # 1. Test missing required fields (name, email, password)
    for missing_field_payload in [
        {"email": "test@example.com", "password": "Pass1234!"},
        {"name": "Test User", "password": "Pass1234!"},
        {"name": "Test User", "email": "test@example.com"},
    ]:
        try:
            resp = requests.post(
                f"{BASE_URL}{REGISTER_ENDPOINT}",
                json=missing_field_payload,
                headers=HEADERS,
                timeout=TIMEOUT,
            )
            # Expecting HTTP 400 Bad Request for missing fields
            assert resp.status_code == 400, f"Expected 400 for missing field, got {resp.status_code}"
        except requests.RequestException as e:
            assert False, f"Request failed unexpectedly: {e}"

    # 2. Register a new user successfully and validate returned token and user info
    unique_email = f"testuser_{uuid.uuid4().hex}@example.com"
    valid_payload = {
        "name": "Test User",
        "email": unique_email,
        "password": "StrongPass123!"
    }
    user_id = None
    try:
        resp = requests.post(
            f"{BASE_URL}{REGISTER_ENDPOINT}",
            json=valid_payload,
            headers=HEADERS,
            timeout=TIMEOUT,
        )
        assert resp.status_code == 200, f"Expected 200 OK, got {resp.status_code}"
        json_resp = resp.json()
        assert "token" in json_resp and isinstance(json_resp["token"], str) and json_resp["token"], "Token missing or empty"
        assert "user" in json_resp and isinstance(json_resp["user"], dict), "User object missing"
        user = json_resp["user"]
        assert "id" in user and isinstance(user["id"], str) and user["id"], "User id missing or empty"
        assert user.get("name") == valid_payload["name"], "User name mismatch"
        assert user.get("email") == valid_payload["email"], "User email mismatch"
        user_id = user["id"]
    except requests.RequestException as e:
        assert False, f"Request failed unexpectedly: {e}"

    # 3. Attempt to register another user with the same email (should fail)
    try:
        resp = requests.post(
            f"{BASE_URL}{REGISTER_ENDPOINT}",
            json=valid_payload,
            headers=HEADERS,
            timeout=TIMEOUT,
        )
        # Expecting 400 Bad Request for duplicate email
        assert resp.status_code == 400, f"Expected 400 for duplicate email, got {resp.status_code}"
    except requests.RequestException as e:
        assert False, f"Request failed unexpectedly: {e}"


user_registration_should_validate_and_register_new_user()