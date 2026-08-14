# 🛡️ Sentinel AI — Mobile App (Flutter)

**Detect. Protect. Prevent.**

Autonomous mobile cybersecurity application designed for Nigeria’s digital economy. Defends individuals and enterprise teams against phishing, SIM-swap attacks, banking malware, WhatsApp account takeovers, and fraudulent credential harvest campaigns.

---

## 📱 Features

1. **Autonomous Threat Desk (Home)**:
   - Live Security Score ring (86% health), Intercepted Threats sparkline, and Autonomous Block volume carousel.
   - Interactive 7-Day multi-vector threat line chart (`fl_chart`).
   - Quick one-tap access to live scanners.
   - Localized Nigerian Threat News & Incident Activity stream.

2. **Live Multi-Vector Scanners (`lib/screens/scan.dart`)**:
   - 🔗 **Link Scanner**: Live domain heuristic & phishing feed check.
   - ✉️ **Email Scanner**: Sender domain spoofing check & embedded lure parser.
   - 📩 **SMS Scanner**: Heuristics for Nigerian scam families (e.g. MTN Promo lures, CBN BVN suspension notices, fake bank credits).
   - 📷 **QR Scanner**: Visual payload evaluation & target safety audit.
   - 📁 **File Scanner**: Magic-byte signature inspection & cryptographic SHA-256 hash.
   - 🔑 **Password Checker**: Entropy calculation, crack time estimation, and breach risk analysis.
   - ⚠️ **Breach & Mailbox Monitor**: Domain MX hygiene & disposable mailbox detector.

3. **AI Security Advisor (`lib/screens/assistant.dart`)**:
   - Interactive cybersecurity assistant for instant threat analysis and remediation advice.

4. **Threat Intel Desk (`lib/screens/intel.dart`)**:
   - 24-Hour national monitor, active campaigns, IOC categories, and regional alerts (Lagos, Abuja, West Africa).

5. **Cyber Academy (`lib/screens/training.dart`)**:
   - Practical interactive defense tracks: *Everyday Self-Defence*, *Account Takeover Lab*, *Team & Enterprise Response*.

6. **Executive Briefings (`lib/screens/reports.dart`)**:
   - Exportable compliance and executive security summaries.

7. **Auth & Settings (`lib/screens/auth.dart`, `lib/screens/more.dart`)**:
   - Splash, Login, Registration, Forgot Password & Verification flows.
   - Dark Command Mode & Light Theme support.
   - Multilingual support for English, Hausa, Yoruba, and Igbo.

---

## 🚀 How to Run

### Prerequisites
- Flutter SDK (>= 3.3.0)
- Android Studio / VS Code with Flutter extension
- An Android device / iOS simulator / Web browser

### Commands
```bash
# 1. Clone repository
git clone https://github.com/useeman32-design/sentinel.git
cd sentinel

# 2. Generate platform bindings (first time setup)
flutter create .

# 3. Get dependencies
flutter pub get

# 4. Run the app
flutter run
```

---

## 📂 Project Architecture

```
lib/
├── main.dart                   # Application entry point & root state
├── theme.dart                  # Cyber dark & light theme tokens
├── models/
│   └── threat.dart             # Data models for scans, threats, notifications, academy
├── services/
│   ├── heuristics.dart         # Dart heuristics engine (SMS, URLs, password entropy, files)
│   └── gemini_service.dart     # AI Assistant integration
└── screens/
    ├── shell.dart              # Main shell with animated navigation bar
    ├── home.dart               # Home dashboard with charts & carousel
    ├── scan.dart               # Threat scanner suite (All 7 modules)
    ├── assistant.dart          # AI Cybersecurity Advisor
    ├── intel.dart              # Threat intelligence desk
    ├── training.dart           # Cyber Academy learning tracks
    ├── reports.dart            # Executive threat briefs
    ├── more.dart               # Profile & settings
    ├── auth.dart               # Authentication screens (Splash, Login, Register, Recovery)
    └── notifications.dart      # Real-time alert notifications
```
