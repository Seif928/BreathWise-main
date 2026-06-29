import requests
import uuid

def test_post_apilogin_authenticate_user_and_get_tokens():
    base_url = "http://localhost:8001"
    
    # 1. Register a user
    unique_suffix = str(uuid.uuid4())
    email = f"testuser_{unique_suffix}@example.com"
    password = "TestPass123!"
    reg_response = requests.post(
        f"{base_url}/api/register/",
        json={"email": email, "password": password, "first_name": "T", "last_name": "U"}
    )
    assert reg_response.status_code == 201, "Setup failed: Could not register user"

    # 2. Login
    login_url = f"{base_url}/api/login/"
    payload = {"email": email, "password": password}
    headers = {"Accept": "application/json", "Content-Type": "application/json"}
    
    response = requests.post(login_url, json=payload, headers=headers, timeout=30)
    assert response.status_code == 200, f"Expected status 200, got {response.status_code}"
    json_response = response.json()
    assert "access" in json_response, "Access token not found in response"
    assert "refresh" in json_response, "Refresh token not found in response"

test_post_apilogin_authenticate_user_and_get_tokens()