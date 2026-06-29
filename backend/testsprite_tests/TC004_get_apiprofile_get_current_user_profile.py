import requests
import uuid

BASE_URL = "http://localhost:8001"
TIMEOUT = 30

def test_get_current_user_profile():
    unique_suffix = str(uuid.uuid4())
    email = f"testuser_{unique_suffix}@example.com"
    password = "TestPass123!"
    
    # Register
    requests.post(f"{BASE_URL}/api/register/", json={"email": email, "password": password})
    
    # Login
    login_url = f"{BASE_URL}/api/login/"
    login_response = requests.post(login_url, json={"email": email, "password": password}, timeout=TIMEOUT)
    assert login_response.status_code == 200, f"Login failed with status {login_response.status_code}"
    access_token = login_response.json()["access"]

    # Profile
    profile_url = f"{BASE_URL}/api/profile/"
    headers = {"Authorization": f"Bearer {access_token}"}
    profile_response = requests.get(profile_url, headers=headers, timeout=TIMEOUT)
    assert profile_response.status_code == 200, f"Profile retrieval failed: {profile_response.status_code}"
    profile_data = profile_response.json()
    assert "email" in profile_data
    assert profile_data["email"] == email

test_get_current_user_profile()