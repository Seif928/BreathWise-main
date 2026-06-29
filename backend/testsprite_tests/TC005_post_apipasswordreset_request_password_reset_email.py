import requests
import uuid

def test_post_apipasswordreset_request_password_reset_email():
    base_url = "http://localhost:8001"
    
    unique_suffix = str(uuid.uuid4())
    email = f"testuser_{unique_suffix}@example.com"
    password = "TestPass123!"
    
    # Register
    requests.post(f"{base_url}/api/register/", json={"email": email, "password": password})
    
    endpoint = "/api/password-reset/"
    url = base_url + endpoint
    headers = {"Content-Type": "application/json"}
    
    payload = {"email": email}
    response = requests.post(url, json=payload, headers=headers, timeout=30)
    assert response.status_code == 200, f"Expected status code 200 but got {response.status_code}"

test_post_apipasswordreset_request_password_reset_email()
