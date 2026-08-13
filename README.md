# Sentinel AI

**Detect. Protect. Prevent.**

Mobile-first cybersecurity app UI for Nigeria’s digital economy. Built in React so the same flows can be rebuilt in Flutter.

## Run on your PC (no React install needed)

You do **not** need to install React.

**Option A — XAMPP (easiest)** after `git pull`:

Open this folder in the browser:

`http://localhost/Sync/www/`

or, if you cloned into `sentinel`:

`http://localhost/sentinel/www/`

`www/` is a ready-made static build. Apache is enough.

**Option B — developers with Node.js**

```bash
npm install
npm run dev
```

## Stack

- React + Vite
- No backend — services call `/api/*` placeholders for a future PHP + MySQL API
- Gemini is wired in `src/services/gemini.js` via `VITE_GEMINI_API_KEY`
- On-device pre-checks live in `src/services/heuristics.js`

## App map

Splash → Login / Register → Home, Scan, Assistant, Intel, More

## Flutter app

A native companion lives in `sentinel_flutter/`.

```bash
cd sentinel_flutter
flutter create .
flutter pub get
flutter run
```

`flutter create .` only generates Android/iOS folders the first time. Do not overwrite `lib/`.
