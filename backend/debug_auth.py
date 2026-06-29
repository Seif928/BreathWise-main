import os
import django

# Set up Django environment
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")
django.setup()

from django.contrib.auth import authenticate, get_user_model

def debug_auth():
    email = 'admin@example.com'
    password = 'admin'
    
    print(f"Attempting authenticate(email='{email}', password='{password}')")
    user = authenticate(email=email, password=password)
    
    if user:
        print(f"Authentication SUCCESS: {user}")
    else:
        print("Authentication FAILED (returned None)")
        
    print("-" * 20)
    print(f"Attempting authenticate(username='{email}', password='{password}')")
    user2 = authenticate(username=email, password=password)
    
    if user2:
        print(f"Authentication with 'username' kwarg SUCCESS: {user2}")
    else:
        print("Authentication with 'username' kwarg FAILED")

if __name__ == '__main__':
    debug_auth()
