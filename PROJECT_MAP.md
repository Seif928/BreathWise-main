# PROJECT_MAP — BreathWise

## TECH_STACK

| Layer | Technology | Version | Status |
|-------|-----------|---------|--------|
| Framework | Flutter | 3.29.3 | ✅ Local SDK |
| Language | Dart | 3.7.2 | ✅ Bundled |
| State Management | Riverpod | 3.3.2 | ✅ Resolved |
| HTTP Client | Dio | 5.9.2 | ✅ Resolved |
| HTTP (legacy) | http | 1.3.0 | ✅ Existing code |
| Image Picker | image_picker | 1.2.1 | ✅ Resolved |
| PDF Generation | pdf | 3.11.3 | ✅ Resolved |
| PDF Print/Share | printing | 5.14.3 | ✅ Resolved |
| Charts | fl_chart | 1.1.0 | ✅ Resolved |
| Image Zoom | InteractiveViewer | Built-in | ✅ No dependency |
| Logging | Custom Async Logger | — | ✅ Non-blocking |
| Theme | Material Design 3 | — | ✅ Built-in |
| Local Storage | SharedPreferences | 2.5.3 | ✅ Existing |
| Django Backend | Django | 6.0.6 | ✅ Running (port 8000) |
| AI Service | FastAPI | — | ✅ Configured (port 8001) |

## SYSTEM_FLOW

```
┌──────────────────────────────────────────────────┐
│                 Flutter App                       │
│  ┌────────────────────────────────────────────┐  │
│  │             UI Layer (Screens)             │  │
│  │  HomeScreen → ScanScreen → ReportScreen   │  │
│  │                HistoryScreen               │  │
│  └────────────────────┬───────────────────────┘  │
│                       │                          │
│  ┌────────────────────▼───────────────────────┐  │
│  │         State Layer (Riverpod Providers)   │  │
│  │  scanProvider / reportProvider /           │  │
│  │  historyProvider                           │  │
│  └────────────────────┬───────────────────────┘  │
│                       │                          │
│  ┌────────────────────▼───────────────────────┐  │
│  │          Service Layer                     │  │
│  │  ┌──────────┐   ┌──────────────────┐      │  │
│  │  │ApiService│   │DiagnosisService  │      │  │
│  │  │(Dio)    │   │(Upload + Analyze) │      │  │
│  │  └──────────┘   └──────────────────┘      │  │
│  └────────────────────────────────────────────┘  │
└──────────────────────┬───────────────────────────┘
                       │ HTTPS (Multipart Upload)
                       ▼
              ┌──────────────────┐     ┌──────────────────┐
              │  Django (8000)   │     │  FastAPI (8001)  │
              │  User/Auth       │◄────│  DenseNet-121    │
              │  Images/Uploads  │     │  Grad-CAM        │
              │  Diagnosis API   │     │  Heatmap API     │
              └──────────────────┘     └──────────────────┘
```

**Data Flow:**
1. User captures/selects X-ray via `image_picker`
2. `scanProvider` handles preview → confirmation
3. `DiagnosisService.uploadAndAnalyze()` uploads to Django + AI service in parallel
4. AI service returns `{pneumonia, effusion, cardiomegaly, pneumothorax, no_finding}` scores + heatmap
5. Django stores image + metadata, returns diagnosis record
6. `reportProvider` fetches detail → `ReportScreen` renders diagnosis + charts + tips
7. User can export as PDF via `pdf_service.dart`

## ARCHITECTURE

```
lib/
├── core/
│   ├── config.dart                    # API endpoints, timeouts
│   ├── theme.dart                     # Material 3 Dark theme
│   ├── logger/
│   │   └── logger.dart                # Async Logger (Info/Warning/Error)
│   ├── services/
│   │   └── pdf_service.dart           # PDF generation + share
│   └── providers/
│       └── core_providers.dart        # Riverpod: dio, aiDio, logger
├── features/
│   ├── scan/
│   │   ├── providers/scan_provider.dart
│   │   ├── screens/scan_screen.dart
│   │   └── widgets/
│   │       ├── image_preview.dart
│   │       └── upload_progress.dart
│   ├── report/
│   │   ├── providers/report_provider.dart
│   │   ├── screens/report_screen.dart
│   │   └── widgets/
│   │       ├── diagnosis_card.dart
│   │       ├── health_tips_card.dart
│   │       └── confidence_chart.dart
│   └── history/
│       ├── providers/history_provider.dart
│       ├── screens/
│       │   ├── home_screen.dart
│       │   └── history_screen.dart
│       └── widgets/
│           └── report_list_item.dart
├── models/                            # AiPrediction, DiagnosisModel, UserModel
├── services/                          # ApiClient, AuthService, AiService, DiagnosisService
├── views/                             # SplashScreen, LoginScreen, UploadTab, ReportsTab, ...
├── widgets/                           # CustomButton, CustomInput, GlassCard
├── app.dart
└── main.dart

backend/
├── core/                              # Django project settings, root URL conf
│   ├── settings.py                    # Updated: DEBUG=True, upload=10MB
│   └── urls.py                        # Updated: clean static/media serving
├── user/                              # Custom User model (email auth), JWT
├── images/                            # NEW: UploadedImage model, CRUD API
│   ├── models.py                      # UploadedImage with scores, heatmap, disease_type
│   ├── serializers.py                 # ImageUploadSerializer, DiagnosisSerializer
│   ├── views.py                       # Upload, List, Detail, Delete
│   └── urls.py                        # /api/images/upload/, /api/diagnoses/, etc.
├── stats/                             # Admin stats (daily checks, common disease)
└── requirements.txt                   # Core deps for Django backend

ai_service/
└── app.py                             # Fixed: port 8001
```

## ORPHANS & PENDING

| Item | Status | Priority | Notes |
|------|--------|----------|-------|
| DICOM format support | ⏳ Pending | Low | نبدأ بـ JPEG/PNG، DICOM لاحقاً |
| HIPAA/GDPR compliance | ⏳ Pending | Medium | يتطلب استشارة قانونية |
| Arabic/English i18n | ⏳ Pending | Low | المرحلة القادمة |
| CI/CD pipeline | ⏳ Pending | Medium | بعد اكتمال باقي الميزات |
| Flutter build APK | ✅ Done | — | `flutter build apk --debug` → BUILD SUCCESSFUL |
| Django backend API | ✅ Done | — | All endpoints working, migrations applied |
| AI service port fix | ✅ Done | — | Changed 8000 → 8001 |

## COMPLETED FIXES

| Fix | File | Description |
|-----|------|-------------|
| Created images app | `backend/images/` | Models, views, serializers, urls, admin |
| DEBUG=True | `backend/core/settings.py:27` | Enables media serving in development |
| Upload limit 10MB | `backend/core/settings.py:158-159` | Matches Flutter 10MB limit |
| Clean static/media | `backend/core/urls.py:42-49` | Removed duplicate static/media URLs |
| AI port 8001 | `ai_service/app.py:232` | Avoids port conflict with Django |
