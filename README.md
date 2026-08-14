# 🛡️ Sentinel AI — Monorepo (Flutter & Laravel)

**Detect. Protect. Prevent.**

Autonomous mobile cybersecurity defense platform tailored for Nigeria's digital economy.

---

## 📁 Repository Structure

```
sentinel/
├── frontend/                  # Flutter Mobile & Multi-Platform Application
│   ├── lib/                   # Dart source code (Clean Architecture)
│   │   ├── main.dart          # Entry point & theme switcher
│   │   ├── theme.dart         # Cyber Dark & Light design tokens
│   │   ├── models/            # ScanResult, ThreatCampaign, Course models
│   │   ├── services/          # Local heuristics & Gemini AI client
│   │   └── screens/           # Home, Scan, Assistant, Intel, Academy, Reports, Auth
│   ├── pubspec.yaml           # Flutter dependencies (fl_chart, google_fonts)
│   └── README.md              # Frontend setup & execution guide
│
├── backend/                   # Laravel 11 REST API Backend
│   ├── app/
│   │   ├── Http/Controllers/  # Auth, Scan, ThreatIntel, Report, Chat controllers
│   │   ├── Models/            # User, ScanHistory, ThreatCampaign, Report models
│   │   └── Services/          # Server heuristics & HIBP range protocol
│   ├── routes/api.php         # RESTful API endpoints
│   ├── database/migrations/   # Database schema definitions
│   ├── composer.json          # PHP / Laravel dependencies
│   └── README.md              # Backend setup & XAMPP guide
│
└── README.md                  # Workspace overview
```

---

## 🚀 Quick Start

### 1. Flutter Frontend (`frontend/`)
```bash
cd frontend
flutter create .
flutter pub get
flutter run
```

### 2. Laravel Backend (`backend/`)
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve --port=8000
```
