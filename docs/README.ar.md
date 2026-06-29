# BreathWise — توثيق المشروع

## نظرة عامة

BreathWise هو نظام تشخيص لأمراض الصدر يعتمد على الذكاء الاصطناعي. يتكون من ثلاثة مكونات رئيسية:

- **تطبيق Flutter** (`mobile/`) — واجهة مستخدم متعددة المنصات (Android/iOS/Web)
- **خادم Django** (`backend/`) — إدارة المستخدمين، المصادقة، تخزين الصور، سجل التشخيص
- **خادم FastAPI** (`ai_service/`) — نموذج DenseNet-121 لتحليل صور الأشعة + Grad-CAM

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

## بنية المشروع

```
BreathWise-main/
├── mobile/                    # Flutter App
│   └── lib/
│       ├── main.dart          # نقطة البداية
│       ├── app.dart           # MaterialApp + ProviderScope
│       ├── core/
│       │   ├── config.dart    # عناوين API
│       │   ├── theme.dart     # ثيم Material 3 Dark
│       │   ├── logger/        # نظام تسجيل (Info/Warning/Error)
│       │   ├── providers/     # Riverpod providers (dio, aiDio, logger)
│       │   └── services/      # PDF generation + share
│       ├── features/
│       │   ├── scan/          # scan_provider, scan_screen, image_preview, upload_progress
│       │   ├── report/        # report_provider, report_screen, diagnosis_card, health_tips_card, confidence_chart
│       │   └── history/       # history_provider, history_screen, report_list_item
│       ├── models/            # AiPrediction, DiagnosisModel, UserModel
│       ├── services/          # ApiClient (http), AuthService, AiService, DiagnosisService
│       ├── views/             # الشاشات القديمة (Splash, Login, Register, Upload, Reports, Profile, ...)
│       └── widgets/           # CustomButton, CustomInput, GlassCard
├── backend/                   # Django
│   ├── core/                  # settings.py, urls.py (root)
│   ├── user/                  # Custom User (email auth), JWT
│   ├── images/                # UploadedImage model, CRUD API
│   ├── stats/                 # Admin stats (daily checks, common disease)
│   ├── testsprite_tests/      # اختبارات آلية
│   └── requirements.txt
├── ai_service/                # FastAPI
│   ├── app.py                 # /predict, /heatmap, /health
│   ├── requirements.txt
│   ├── weights/densenet121.pt # أوزان النموذج (اختياري)
│   └── *.ipynb                # Jupyter notebooks للتجارب
└── start_backend.bat          # سكريبت تشغيل
```

---

## المتطلبات الأساسية

| الأداة | الإصدار الموصى |
|--------|----------------|
| Flutter | 3.29.x |
| Dart | 3.7.x |
| Python | 3.14.x |
| pip | الأحدث |

---

## تشغيل المشروع محلياً

### 1. تشغيل Django Backend

```bash
cd backend
python -m venv venv
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver 0.0.0.0:8000
```

لإنشاء مشرف:
```bash
python manage.py createsuperuser
```

### 2. تشغيل AI Service (FastAPI)

```bash
cd ai_service
pip install -r requirements.txt
python app.py
# يستمع على port 8001
```

### 3. تشغيل Flutter App

```bash
cd mobile
flutter pub get
flutter run
# أو للبناء:
flutter build apk --debug
```

### 4. سكريبت تشغيل مباشر

```bash
start_backend.bat
# يشغل Django تلقائياً على 0.0.0.0:8000
```

---

## API Reference

### المصادقة (Django — `/api/`)

| الطريقة | المسار | الوصف |
|---------|--------|-------|
| POST | `/api/register/` | تسجيل مستخدم جديد |
| POST | `/api/login/` | تسجيل دخول (JWT) |
| POST | `/api/logout/` | تسجيل خروج + حظر refresh token |
| POST | `/api/password-reset/` | طلب إعادة تعيين كلمة المرور |
| GET | `/api/profile/` | عرض الملف الشخصي |
| PATCH | `/api/profile/` | تحديث الملف الشخصي |
| POST | `/api/token/` | الحصول على JWT token |
| POST | `/api/token/refresh/` | تجديد JWT token |

### الصور والتشخيص (Django — `/api/`)

| الطريقة | المسار | الوصف |
|---------|--------|-------|
| POST | `/api/images/upload/` | رفع صورة أشعة |
| GET | `/api/diagnoses/` | قائمة التشخيصات (sort, page) |
| GET | `/api/diagnoses/{id}/` | تفاصيل تشخيص واحد |
| DELETE | `/api/images/{id}/` | حذف صورة + تشخيص |

### AI Service (FastAPI — port 8001)

| الطريقة | المسار | الوصف |
|---------|--------|-------|
| GET | `/health` | فحص الاتصال |
| POST | `/predict` | تحليل صورة ← 5 scores |
| POST | `/heatmap` | توليد Grad-CAM heatmap |

### التوثيق التلقائي

- Swagger UI: `http://localhost:8000/api/schema/swagger-ui/`
- ReDoc: `http://localhost:8000/api/schema/redoc/`
- OpenAPI JSON: `http://localhost:8000/api/schema/`

---

## AI Model — DenseNet-121

### Condition Labels

1. `pneumonia` — التهاب رئوي
2. `effusion` — انصباب جنبي
3. `cardiomegaly` — تضخم القلب
4. `pneumothorax` — استرواح الصدر
5. `no_finding` — لا يوجد اكتشاف

### Demo Mode

إذا لم يتم العثور على ملف الأوزان (`weights/densenet121.pt`), يعمل النموذج في **Demo Mode** ويُرجِع نتائج عشوائية (محددة بـ hash لتكون ثابتة لكل صورة). هذا مفيد للتطوير والاختبار.

### Grad-CAM

يستخدم `pytorch-grad-cam` لتوليد خريطة حرارية (heatmap) تُظهر المناطق التي ركز عليها النموذج في الصورة الأصلية.

---

## تدفق البيانات

```
1. المستخدم يلتقط/يختار صورة أشعة
2. الصورة تُعرض للمعاينة (InteractiveViewer)
3. ضغط "Upload and Analyze" يبدأ:
   a. رفع الصورة لـ Django (خزن + تسجيل)
   b. إرسال الصورة لـ FastAPI للتشخيص (بالتوازي)
4. FastAPI يُرجِع confidence scores + heatmap
5. Django يُرجِع record كامل مع result_id
6. التطبيق يعرض:
   - DiagnosisCard: المرض + الثقة
   - ConfidenceChart: رسم بياني لجميع النتائج
   - HealthTipsCard: نصائح صحية حسب المرض
   - Toggle Original/Heatmap
7. المستخدم يستطيع:
   - تصفح السجل (History)
   - حذف التشخيصات
   - تصدير PDF (عبر Printing plugin)
```

---

## نظام المصادقة (JWT)

- يستخدم `djangorestframework-simplejwt`
- `access_token` صلاحيته يوم واحد
- `refresh_token` صلاحيته 7 أيام
- `refresh_token` يُلغى عند تسجيل الخروج (blacklist)
- التطبيق يخزن `access_token` في `SharedPreferences`

```
تسجيل الدخول:
  POST /api/login/  ←  يرجِع {access, refresh}
  تخزين access_token في SharedPreferences
  كل طلب لاحق:  Authorization: Bearer <access_token>
```

---

## الميزات المنجزة

- [x] تسجيل دخول/خروج + JWT
- [x] رفع صور الأشعة + تحليل AI
- [x] عرض نتائج التشخيص مع رسم بياني
- [x] خريطة حرارية Grad-CAM (تبديل Original/Heatmap)
- [x] نصائح صحية ديناميكية حسب المرض
- [x] سجل التشخيصات (فرز + حذف)
- [x] تصدير PDF (مشاركة)
- [x] ثيم Material 3 Dark + تدرج لوني
- [x] التعامل مع الأخطاء وحالات التحميل
- [x] API docs تلقائي (Swagger/ReDoc)
- [x] إحصائيات المشرف (فحوصات يومية، أكثر مرض شيوعاً)

---

## أوامر مفيدة

```bash
# تشغيل الاختبارات
cd backend && python manage.py test
cd backend && python test_api_flow.py

# فحص المشروع
flutter analyze
flutter build apk --debug

# ترحيل قاعدة البيانات
python manage.py makemigrations
python manage.py migrate

# إنشاء مستخدم مشرف
python manage.py createsuperuser

# تصدير شها SSL (للاتصال من جهاز فعلي)
# غيّر IP في config.dart إلى IP جهازك
```

---

## ملاحظات تقنية

- **Python 3.14.6** على Windows — Django 6.0.6 / DRF 3.17.1 متوافقة
- `AUTH_HEADER_TYPES` في settings.py: `("Bearer",)` — الفاصلة ضرورية لتكون tuple
- `ai_service` يعمل على port **8001** لتجنب تعارض مع Django (8000)
- رفع الصور محدود بـ **10MB**
- الفلتر التلقائي `django_filters` مفعل
- `silk` مثبت لتصحيح أداء الـ API

---

## لقطات الشاشة

(يمكن إضافة لقطات شاشة في future update)

---

## الترخيص

هذا المشروع للاستخدام التعليمي والبحثي. ليس جهازاً طبياً معتمداً.
