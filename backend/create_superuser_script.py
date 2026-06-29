import os
import django

# Set up Django environment
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")
django.setup()

from django.contrib.auth import get_user_model

def create_superuser():
    User = get_user_model()
    email = 'admin@example.com'
    password = 'admin'

    if not User.objects.filter(email=email).exists():
        print(f"Creating superuser: {email}")
        try:
            User.objects.create_superuser(email=email, password=password)
            print("Superuser created successfully.")
        except Exception as e:
            print(f"Error creating superuser: {e}")
    else:
        print("Superuser already exists.")

if __name__ == '__main__':
    create_superuser()
