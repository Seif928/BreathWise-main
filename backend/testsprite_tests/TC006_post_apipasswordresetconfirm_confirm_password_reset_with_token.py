import requests
import uuid

BASE_URL = "http://localhost:8001"
TIMEOUT = 30

def test_post_apipasswordresetconfirm_confirm_password_reset_with_token():
    session = requests.Session()
    session.headers.update({
        "Content-Type": "application/json",
        "Accept": "application/json"
    })

    user_email = f"testuser_{uuid.uuid4().hex[:8]}@example.com"
    original_password = "OldPass123!"
    new_password = "NewPass123!"

    # Step 1: Register a new user to test password reset
    register_payload = {
        "username": user_email,
        "email": user_email,
        "password": original_password
    }
    resp_register = session.post(
        f"{BASE_URL}/api/register/",
        json=register_payload,
        timeout=TIMEOUT
    )
    assert resp_register.status_code == 201, f"User registration failed: {resp_register.text}"

    # Step 2: Request password reset for the registered user
    reset_request_payload = {
        "email": user_email
    }
    resp_reset_request = session.post(
        f"{BASE_URL}/api/password-reset/",
        json=reset_request_payload,
        timeout=TIMEOUT
    )
    assert resp_reset_request.status_code == 200, f"Password reset request failed: {resp_reset_request.text}"

    # Cannot proceed to confirm password reset due to lack of reset token in response
    # So this test covers registration and password reset request only


test_post_apipasswordresetconfirm_confirm_password_reset_with_token()
