import requests

BASE_URL = "http://localhost:4000"
LOGIN_ENDPOINT = "/api/auth/login"
REGISTER_ENDPOINT = "/api/auth/register"

def user_login_should_authenticate_and_return_token():
    timeout = 30
    headers = {"Content-Type": "application/json"}

    # First, register a new user to ensure valid credentials exist
    import uuid
    unique_email = f"testuser_{uuid.uuid4().hex[:8]}@example.com"
    registration_payload = {
        "name": "Test User",
        "email": unique_email,
        "password": "TestPassword123!"
    }

    user_id = None
    try:
        # Register user
        reg_response = requests.post(
            BASE_URL + REGISTER_ENDPOINT,
            json=registration_payload,
            headers=headers,
            timeout=timeout
        )
        assert reg_response.status_code == 200, f"Registration failed with status {reg_response.status_code}"
        reg_data = reg_response.json()
        assert "token" in reg_data, "Registration response missing token"
        assert "user" in reg_data and isinstance(reg_data["user"], dict), "Registration response missing user info"
        user_id = reg_data["user"].get("id")
        assert user_id, "Registered user ID not received"

        # Test successful login with valid credentials
        login_payload = {
            "email": unique_email,
            "password": "TestPassword123!"
        }
        login_response = requests.post(
            BASE_URL + LOGIN_ENDPOINT,
            json=login_payload,
            headers=headers,
            timeout=timeout
        )
        assert login_response.status_code == 200, f"Login failed with status {login_response.status_code} for valid credentials"
        login_data = login_response.json()
        assert "token" in login_data, "Login response missing token for valid credentials"
        assert "user" in login_data and isinstance(login_data["user"], dict), "Login response missing user info for valid credentials"
        assert login_data["user"].get("email") == unique_email, "Returned user email does not match login email"

        # Test login failure with invalid password
        invalid_password_payload = {
            "email": unique_email,
            "password": "WrongPassword!"
        }
        invalid_pass_response = requests.post(
            BASE_URL + LOGIN_ENDPOINT,
            json=invalid_password_payload,
            headers=headers,
            timeout=timeout
        )
        assert invalid_pass_response.status_code == 401, f"Login with invalid password did not return 401, got {invalid_pass_response.status_code}"

        # Test login failure with unregistered email
        invalid_email_payload = {
            "email": "nonexistent_" + unique_email,
            "password": "SomePassword123!"
        }
        invalid_email_response = requests.post(
            BASE_URL + LOGIN_ENDPOINT,
            json=invalid_email_payload,
            headers=headers,
            timeout=timeout
        )
        assert invalid_email_response.status_code == 401, f"Login with invalid email did not return 401, got {invalid_email_response.status_code}"

    finally:
        # No explicit user deletion endpoint was provided in PRD; so we do nothing here.
        pass

user_login_should_authenticate_and_return_token()
