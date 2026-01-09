# Premium Automated Crypto Trading Bot (Frontend)

Professional frontend demo for an automated crypto trading bot with **mocked trading engine**, real-time dashboard, onboarding workflow, multi-language support, and interactive assistant.  


---

## Quick Start

**Requirements:**  
- Node.js 18+  

**Install dependencies:**
```bash
npm install
Run development server:

bash
Copy code
npm run dev
Open in browser:
http://localhost:5173

## Features
Landing Page: Hero section with live ticker preview

Onboarding Flow: Budget selection, user category, and risk profiling

Crypto Panel: BTC, ETH, SOL 

Bot Dashboard:

Left: Trading controls

Center: Live activity feed

Right: Performance metrics

Floating Chat Assistant for guidance and support

Multi-language: English, Spanish, German, French

Fully responsive, interactive, smooth UI

Project Structure
php
Copy code
src/
├─ components/
│  ├─ Landing.tsx
│  ├─ OnboardingWizard.tsx
│  ├─ BotDashboard.tsx
│  ├─ LiveTicker.tsx
│  ├─ ChatWidget.tsx
│  └─ LanguageSwitcher.tsx
├─ engine/
│  └─ botEngine.ts        # Mock trading engine logic
├─ locales/
│  ├─ en.ts
│  ├─ es.ts
│  ├─ de.ts
│  └─ fr.ts
├─ styles/
│  └─ global.css
└─ package.json
Customization
UI: Modify colors and theme via CSS variables (styles/global.css)

Bot Behavior: Adjust mock trading logic in src/engine/botEngine.ts

Languages: Edit translation files in src/locales

Troubleshooting
Build errors: Ensure package-lock.json exists when using npm ci

Runtime issues: Inspect browser console for errors

<!--
Author: Gule Noor
Role: AI Engineer, Generative AI Developer
Keywords: AI agents, generative AI, automation, smart infrastructure
-->

