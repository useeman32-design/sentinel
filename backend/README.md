# 🛡️ Sentinel AI — Laravel 11 Backend API

**REST API backend for the Sentinel AI Cybersecurity Platform.**

---

## ⚡ Features

- **Authentication & User Management**: Laravel Sanctum API token authentication, registration, password recovery, profile management.
- **Multi-Vector Threat Scanning Endpoints**:
  - `POST /api/scan/link`: Live URL domain spoofing and phishing detection.
  - `POST /api/scan/sms`: Nigerian smishing heuristic engine (BVN alerts, lottery lures, airtime fees).
  - `POST /api/scan/email`: Mailbox spoofing and panic lure detector.
  - `POST /api/scan/qr`: QR destination safety analysis.
  - `POST /api/scan/file`: File signature, magic-byte header & SHA-256 analysis.
  - `POST /api/scan/password`: Entropy and crack-time calculator.
  - `POST /api/scan/breach`: Domain MX record resolver & disposable mailbox detector.
  - `GET /api/scan/history`: User scan history logs.
- **AI Advisor (`POST /api/chat/ask`)**: Cybersecurity intelligence chat endpoint with Gemini AI hooks.
- **Threat Intel (`GET /api/intel/campaigns`, `GET /api/intel/stats`)**: National threat desk stream & active IOCs.
- **Executive Reports (`GET /api/reports`, `POST /api/reports`)**: Incident briefing compilation & PDF exports.

---

## 🚀 Setup & Installation (XAMPP / Local PHP)

### 1. Requirements
- PHP >= 8.2 with `pdo_mysql`, `curl`, `mbstring`, `openssl` extensions
- Composer >= 2.x
- MySQL / MariaDB (XAMPP default)

### 2. Installation Steps
```bash
cd backend

# Install dependencies
composer install

# Environment configuration
cp .env.example .env
php artisan key:generate

# Configure MySQL database in .env (DB_DATABASE=sentinel_db)
# Then run migrations:
php artisan migrate

# Start Laravel development server
php artisan serve --port=8000
```

---

## 📡 API Endpoints Overview

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Health Check | No |
| `POST` | `/api/auth/register` | User Registration | No |
| `POST` | `/api/auth/login` | User Login & Token Issue | No |
| `POST` | `/api/scan/link` | Analyze Website URL | No / Optional |
| `POST` | `/api/scan/sms` | Scan SMS Message | No / Optional |
| `POST` | `/api/scan/email` | Scan Email Body & Headers | No / Optional |
| `POST` | `/api/scan/qr` | Decode & Analyze QR | No / Optional |
| `POST` | `/api/scan/file` | Analyze File Payload | No / Optional |
| `POST` | `/api/scan/password` | Check Passphrase Entropy | No / Optional |
| `POST` | `/api/scan/breach` | Check Mailbox Domain | No / Optional |
| `POST` | `/api/chat/ask` | Query AI Security Advisor | No / Optional |
| `GET` | `/api/intel/campaigns`| Active Threat Campaigns | No |
| `GET` | `/api/intel/stats` | National Threat Metrics | No |
| `GET` | `/api/reports` | Executive Threat Reports | No / Optional |
