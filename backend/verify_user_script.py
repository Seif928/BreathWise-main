import os
import django

# Set up Django environment
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")
django.setup()

from django.contrib.auth import get_user_model

def check_user():
    User = get_user_model()
    email = 'admin@example.com'
    
    try:
        user = User.objects.get(email=email)
        print(f"User found: {user.email}")
        print(f"Is active: {user.is_active}")
        print(f"Is superuser: {user.is_superuser}")
        print(f"Password hash exists: {bool(user.password)}")
        # Check password
        if user.check_password('admin'):
             print("Password 'admin' is CORRECT.")
        else:
             print("Password 'admin' is INCORRECT.")
             
    except User.DoesNotExist:
        print(f"User {email} does NOT exist.")

if __name__ == '__main__':
    check_user()
