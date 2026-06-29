@echo off
echo Starting Django Backend on port 8000...
cd /d "%~dp0backend"
python manage.py runserver 0.0.0.0:8000
pause
