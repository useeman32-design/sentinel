# Sentinel AI

**Detect. Protect. Prevent.**

Mobile-first cybersecurity app UI for Nigeria’s digital economy. Built in React so the same flows can be rebuilt in Flutter.

## Run

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
