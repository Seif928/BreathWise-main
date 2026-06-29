import requests
import uuid

BASE_URL = "http://localhost:8001"

def test_post_apiregister_register_new_user():
    url = f"{BASE_URL}/api/register/"
    unique_suffix = str(uuid.uuid4())
    payload = {
        "email": f"testuser_{unique_suffix}@example.com",
        "password": "TestPass123!",
        "first_name": "Test",
        "last_name": "User"
    }
    headers = {"Content-Type": "application/json"}
    
    response = requests.post(url, json=payload, headers=headers, timeout=30)
    assert response.status_code == 201, f"Expected 201, got {response.status_code}"
    data = response.json()
    assert isinstance(data, dict), "Response JSON is not a dictionary"
    assert "email" in data, "Response JSON missing 'email'"
    assert data.get("email") == payload["email"]
    assert "password" not in data

test_post_apiregister_register_new_user()
