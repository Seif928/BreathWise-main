import requests
import sys

BASE_URL = "http://127.0.0.1:8000/api"
EMAIL = "test_user_123@example.com"
PASSWORD = "password123"

def test_register():
    print(f"Testing Registration with email: {EMAIL}")
    url = f"{BASE_URL}/register/"
    data = {
        "email": EMAIL,
        "password": PASSWORD,
        "first_name": "Test",
        "last_name": "User"
    }
    response = requests.post(url, json=data)
    if response.status_code == 201:
        print("Registration Successful")
        return True
    elif response.status_code == 400 and "already exists" in response.text:
        print("User already exists, proceeding to login")
        return True
    else:
        print(f"Registration Failed: {response.status_code} - {response.text}")
        return False

def test_login():
    print("Testing Login")
    url = f"{BASE_URL}/login/"
    data = {
        "email": EMAIL,
        "password": PASSWORD
    }
    response = requests.post(url, json=data)
    if response.status_code == 200:
        print("Login Successful")
        return response.json()
    else:
        print(f"Login Failed: {response.status_code} - {response.text}")
        return None

def test_logout(access_token, refresh_token):
    print("Testing Logout")
    url = f"{BASE_URL}/logout/"
    headers = {"Authorization": f"Bearer {access_token}"}
    data = {"refresh": refresh_token}
    response = requests.post(url, json=data, headers=headers)
    if response.status_code == 200: # Changed from 205 to 200 based on views.py
        print("Logout Successful")
        return True
    else:
        print(f"Logout Failed: {response.status_code} - {response.text}")
        return False

if __name__ == "__main__":
    if not test_register():
        sys.exit(1)
    
    tokens = test_login()
    if not tokens:
        sys.exit(1)
    
    access = tokens.get("access")
    refresh = tokens.get("refresh")
    
    if not test_logout(access, refresh):
        sys.exit(1)
    
    print("All tests passed!")
