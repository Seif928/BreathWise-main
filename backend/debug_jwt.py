import os
import django
from django.conf import settings

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

print("INSTALLED_APPS:", settings.INSTALLED_APPS)
print("Is token_blacklist installed?", 'rest_framework_simplejwt.token_blacklist' in settings.INSTALLED_APPS)

from rest_framework_simplejwt.tokens import RefreshToken
print("RefreshToken attributes:", dir(RefreshToken))

try:
    t = RefreshToken()
    print("Does token have blacklist method?", hasattr(t, 'blacklist'))
except Exception as e:
    print("Error instantiation token:", e)
