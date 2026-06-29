import requests
import uuid

BASE_URL = "http://localhost:8001"
TIMEOUT = 30

def test_post_apilogout_logout_user_and_blacklist_refresh_token():
    unique_suffix = str(uuid.uuid4())
    email = f"testuser_{unique_suffix}@example.com"
    password = "TestPass123!"
    
    # Step 0: Register
    requests.post(f"{BASE_URL}/api/register/", json={"email": email, "password": password})
    
    login_url = f"{BASE_URL}/api/login/"
    logout_url = f"{BASE_URL}/api/logout/"
    
    # Step 1: Login
    login_response = requests.post(login_url, json={"email": email, "password": password}, timeout=TIMEOUT)
    assert login_response.status_code == 200, f"Login failed: {login_response.text}"
    tokens = login_response.json()
    access_token = tokens.get("access")
    refresh_token = tokens.get("refresh")
    
    # Step 2: Logout
    headers = {"Authorization": f"Bearer {access_token}", "Content-Type": "application/json"}
    logout_response = requests.post(logout_url, json={"refresh": refresh_token}, headers=headers, timeout=TIMEOUT)
    assert logout_response.status_code == 200, f"Logout failed: {logout_response.text}"

    # Step 3: Attempt to logout again (should fail)
    logout_response_2 = requests.post(logout_url, json={"refresh": refresh_token}, headers=headers, timeout=TIMEOUT)
    assert logout_response_2.status_code != 200, "Blacklisted refresh token was accepted unexpectedly"

test_post_apilogout_logout_user_and_blacklist_refresh_token()
