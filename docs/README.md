# BreathWise — Project Documentation

## Overview

BreathWise is an AI-powered chest X-ray diagnosis system with three main components:

- **Flutter App** (`mobile/`) — Cross-platform mobile UI (Android/iOS/Web)
- **Django Backend** (`backend/`) — User management, JWT auth, image storage, diagnosis records
- **FastAPI AI Service** (`ai_service/`) — DenseNet-121 model for X-ray analysis + Grad-CAM heatmap

```
Flutter App  ───HTTPS──▶  Django (8000)  ──HTTP──▶  FastAPI (8001)
   │                          │                        │
   │  ┌────────────────┐     │  Auth (JWT)            │  DenseNet-121
   │  │ Scan Upload     │────▶  Upload Image           │  Prediction
   │  │ Report View     │────▶  Get Diagnoses          │  Grad-CAM Heatmap
   │  │ History Browse  │────▶  List/Crud              │
   │  │ PDF Export      │     │                        │
   │  └────────────────┘     └────────────────────────┘
```

---

## Project Structure

```
BreathWise-main/
├── mobile/                    # Flutter App
│   └── lib/
│       ├── main.dart          # Entry point
│       ├── app.dart           # MaterialApp + ProviderScope
│       ├── core/
│       │   ├── config.dart    # API endpoints
│       │   ├── theme.dart     # Material 3 Dark theme
│       │   ├── logger/        # Logger (Info/Warning/Error)
│       │   ├── providers/     # Riverpod providers (dio, aiDio, logger)
│       │   └── services/      # PDF generation + share
│       ├── features/
│       │   ├── scan/          # scan_provider, scan_screen, image_preview, upload_progress
│       │   ├── report/        # report_provider, report_screen, diagnosis_card, health_tips_card, confidence_chart
│       │   └── history/       # history_provider, history_screen, report_list_item
│       ├── models/            # AiPrediction, DiagnosisModel, UserModel
│       ├── services/          # ApiClient (http), AuthService, AiService, DiagnosisService
│       ├── views/             # Legacy screens (Splash, Login, Register, Upload, Reports, Profile, ...)
│       └── widgets/           # CustomButton, CustomInput, GlassCard
├── backend/                   # Django
│   ├── core/                  # settings.py, root urls.py
│   ├── user/                  # Custom User (email auth), JWT
│   ├── images/                # UploadedImage model, CRUD API
│   ├── stats/                 # Admin stats (daily checks, common disease)
│   ├── testsprite_tests/      # Automated test scripts
│   └── requirements.txt
├── ai_service/                # FastAPI
│   ├── app.py                 # /predict, /heatmap, /health
│   ├── requirements.txt
│   ├── weights/densenet121.pt # Model weights (optional)
│   └── *.ipynb                # Jupyter notebooks
└── start_backend.bat          # Startup script
```

---

## Prerequisites

| Tool | Recommended Version |
|------|-------------------|
| Flutter | 3.29.x |
| Dart | 3.7.x |
| Python | 3.14.x |
| pip | latest |

---

## Local Setup

### 1. Django Backend

```bash
cd backend
python -m venv venv
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver 0.0.0.0:8000
```

Create admin:
```bash
python manage.py createsuperuser
```

### 2. AI Service (FastAPI)

```bash
cd ai_service
pip install -r requirements.txt
python app.py
# Listens on port 8001
```

### 3. Flutter App

```bash
cd mobile
flutter pub get
flutter run
# Or build:
flutter build apk --debug
```

### 4. Quick start

```bash
start_backend.bat
# Starts Django on 0.0.0.0:8000
```

---

## API Reference

### Auth (Django — `/api/`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/register/` | Register new user |
| POST | `/api/login/` | Login (JWT) |
| POST | `/api/logout/` | Logout + blacklist refresh token |
| POST | `/api/password-reset/` | Request password reset |
| GET | `/api/profile/` | Get profile |
| PATCH | `/api/profile/` | Update profile |
| POST | `/api/token/` | Get JWT tokens |
| POST | `/api/token/refresh/` | Refresh JWT access token |

### Images & Diagnosis (Django — `/api/`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/images/upload/` | Upload X-ray image |
| GET | `/api/diagnoses/` | List diagnoses (sort, page) |
| GET | `/api/diagnoses/{id}/` | Diagnosis detail |
| DELETE | `/api/images/{id}/` | Delete image + diagnosis |

### AI Service (FastAPI — port 8001)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| POST | `/predict` | Analyze image → 5 confidence scores |
| POST | `/heatmap` | Generate Grad-CAM heatmap |

### Auto Docs

- Swagger UI: `http://localhost:8000/api/schema/swagger-ui/`
- ReDoc: `http://localhost:8000/api/schema/redoc/`
- OpenAPI JSON: `http://localhost:8000/api/schema/`

---

## AI Model — DenseNet-121

### Condition Labels

1. `pneumonia` — Pneumonia
2. `effusion` — Pleural Effusion
3. `cardiomegaly` — Cardiomegaly
4. `pneumothorax` — Pneumothorax
5. `no_finding` — No Finding

### Demo Mode

If `weights/densenet121.pt` is not found, the service runs in **Demo Mode**, returning hash-seeded random results (consistent per image). Useful for development & testing.

### Grad-CAM

Uses `pytorch-grad-cam` to generate a heatmap overlay showing regions the model focused on.

---

## Data Flow

```
1. User captures/selects X-ray image
2. Image previewed (InteractiveViewer)
3. "Upload and Analyze" pressed:
   a. Upload to Django (store + record)
   b. Send to FastAPI for diagnosis (parallel)
4. FastAPI returns confidence scores + heatmap
5. Django returns full record with result_id
6. App displays:
   - DiagnosisCard: disease + confidence
   - ConfidenceChart: bar chart of all scores
   - HealthTipsCard: dynamic tips per disease
   - Toggle Original/Heatmap
7. User can:
   - Browse history
   - Delete diagnoses
   - Export PDF (via Printing plugin)
```

---

## Auth (JWT)

- Uses `djangorestframework-simplejwt`
- `access_token` lifetime: 1 day
- `refresh_token` lifetime: 7 days
- Refresh token blacklisted on logout
- App stores `access_token` in `SharedPreferences`

```
Login:
  POST /api/login/  →  returns {access, refresh}
  Store access_token in SharedPreferences
  Subsequent requests:  Authorization: Bearer <access_token>
```

---

## Completed Features

- [x] Login/Logout + JWT
- [x] X-ray upload + AI analysis
- [x] Diagnosis result display with confidence chart
- [x] Grad-CAM heatmap (Original/Heatmap toggle)
- [x] Dynamic health tips per condition
- [x] History (sort + delete)
- [x] PDF export (share)
- [x] Material 3 Dark theme + space gradient
- [x] Error handling + loading states
- [x] Auto API docs (Swagger/ReDoc)
- [x] Admin stats (daily checks, most common disease)

---

## Useful Commands

```bash
# Run tests
cd backend && python manage.py test
cd backend && python test_api_flow.py

# Flutter
flutter analyze
flutter build apk --debug

# Database migrations
python manage.py makemigrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser
```

---

## Tech Notes

- **Python 3.14.6** on Windows — Django 6.0.6 / DRF 3.17.1 fully compatible
- `AUTH_HEADER_TYPES` in settings.py: `("Bearer",)` — trailing comma required for tuple
- `ai_service` runs on port **8001** to avoid conflict with Django (8000)
- Upload limit: **10MB**
- `django_filters` enabled for query filtering
- `silk` installed for API profiling

---

## License

Educational and research use only. Not a certified medical device.
