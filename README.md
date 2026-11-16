# Setora

**Your training. Your rhythm.**

[![Version](https://img.shields.io/badge/version-1.0.0-8ED1B2?style=flat-square&labelColor=111413)](https://github.com)
[![PWA](https://img.shields.io/badge/PWA-Installable-2B7A5B?style=flat-square&labelColor=111413)](https://ais-pre-tgxv3z53qm2tftyiblmvl3-120302759529.asia-east1.run.app)
[![React](https://img.shields.io/badge/React-19.0.1-61DAFB?style=flat-square&labelColor=111413)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-7.0.2-3178C6?style=flat-square&labelColor=111413)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-8.3.0-646CFF?style=flat-square&labelColor=111413)](https://vite.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.3.3-06B6D4?style=flat-square&labelColor=111413)](https://tailwindcss.com)

Setora is a calm, minimal, offline-capable Progressive Web App (PWA) that turns a trainer-prescribed weekly gym programme into an effortless digital checklist.

> Open → Check today's session → View exercise form → Tick completed → Done.

---

## Live PWA

**App URL:** [https://ais-pre-tgxv3z53qm2tftyiblmvl3-120302759529.asia-east1.run.app](https://ais-pre-tgxv3z53qm2tftyiblmvl3-120302759529.asia-east1.run.app)

### Install as an App
- **iOS (Safari):** Open the PWA URL → tap **Share** → **Add to Home Screen**.
- **Android (Chrome / Edge):** Open the PWA URL → tap the **Install** banner or menu → **Install app**.
- **Desktop (Chrome / Edge):** Click the install icon in the address bar, or use **Install Setora** inside **Settings**.

Once installed, Workbox precaches the app shell, icons, fonts, and programme JSON so Setora works offline in the gym.

---

## Features

- **Today-First Daily Checklist:** Opens directly to the current calendar date (`Today`) with a compact 7-day weekday switcher strip (`Mon–Sun` or `Sun–Sat`) and programme block selector.
- **Prescribed Programme Integrity:** Displays all 6 sequential trainer-prescribed blocks (`Block 1` – `Block 6`) with exact cardio prescriptions, sets, reps, durations, weights, ranges, and trainer notes without altering original values.
- **Rest & Unscheduled Day Support:** Shows a calm recovery card on Rest Days (such as Sunday) with quick-jump links to active training days in the selected block.
- **Exercise-Specific Looping Animations:** Procedural 60fps kinematic SVG posture demonstrations tailored per exercise—differentiating grip, stance, equipment props, and target muscles—with static pose thumbnails on checklist cards and full playback controls (`Play/Pause`, `0.5×`/`1×` tempo, live rep phase indicator, and `prefers-reduced-motion` support) in the **Exercise Guide**.
- **Optional Custom Video Links:** Paste a YouTube (`watch`, `youtu.be`, `shorts`) or direct `.mp4`/`.webm` link in any Exercise Guide to toggle between the built-in animation and your custom video (saved automatically to `localStorage`).
- **Local Workout History:** Logs completion per calendar date and programme block (`YYYY-MM-DD__blockId__day`) in `localStorage` with zero sign-in required.
- **Obsidian & Sage Mint Theme:** Supports **Dark** (default), **Light**, and **System** appearance modes with zero-flash startup initialization.

---

## Tech Stack & Versions

| Package / Tool | Version | Role |
| --- | --- | --- |
| **React** | `19.0.1` | UI component framework |
| **React DOM** | `19.0.1` | DOM renderer |
| **TypeScript** | `7.0.2` | Static type checking (`tsc --noEmit`) |
| **Vite** | `8.3.0` | Build tool & dev server |
| **Tailwind CSS** | `4.3.3` | Utility-first styling (`@tailwindcss/vite`) |
| **vite-plugin-pwa** | `2.0.0` | Web App Manifest & Workbox service worker |
| **Lucide React** | `0.546.0` | Minimal line iconography |
| **Motion** | `12.23.24` | Smooth UI transitions |
| **@types/node** | `22.14.0` | Node.js type definitions (Node `>=20` recommended) |

---

## Version History

### `v1.0.0`
- **Today-First Checklist & Weekday Switcher:** Default landing view synced to today's calendar date with a 7-day switcher strip and recovery card for Rest Days.
- **Obsidian & Sage Mint Design System:** Calm charcoal dark palette (`#111413` / `#8ED1B2`) and crisp eucalyptus light palette (`#F5F7F6` / `#2B7A5B`) using `Manrope` + `Inter` typography.
- **Exercise-Specific Kinematic Demonstrations:** ~60 unique looping vector animations with differentiated grips, stances, and equipment, plus Play/Pause, `0.5×`/`1×` speed toggle, and optional auto-saved custom video links.
- **Local-First PWA Persistence:** Full offline support via Workbox precaching and local browser storage for preferences, completion history, and custom video URLs.

---

## Project Structure

```text
.
├── index.html                          # Entry HTML, PWA/OG meta tags, zero-flash theme script
├── metadata.json                       # Application metadata
├── package.json                        # Scripts, dependencies, and app version (1.0.0)
├── tsconfig.json                       # TypeScript configuration
├── vite.config.ts                      # Vite + VitePWA Workbox configuration
├── public/
│   ├── apple-touch-icon.png
│   ├── favicon.ico
│   ├── icon.svg
│   ├── pwa-192x192.png
│   ├── pwa-512x512.png
│   ├── pwa-maskable-512x512.png
│   └── assets/aistudio/
│       └── gym_workout_program_393f9047.json
└── src/
    ├── App.tsx                         # Main application state & tab routing
    ├── index.css                       # Tailwind CSS import & theme CSS variables
    ├── main.tsx                        # React root & PWA service worker registration
    ├── components/
    │   ├── AppLayout.tsx               # App shell, header, and layout container
    │   ├── BottomNavigation.tsx        # Today / History / Settings mobile navigation
    │   ├── CardioChecklistItem.tsx     # Daily cardio completion row
    │   ├── CompletionProgress.tsx      # Daily workout progress bar
    │   ├── DailyChecklist.tsx          # Date picker, progress, cardio, and exercise list
    │   ├── ExerciseCard.tsx            # Exercise card with static pose thumbnail & checkbox
    │   ├── ExerciseDiagram.tsx         # Procedural 60fps kinematic SVG animation renderer
    │   ├── ExerciseGuide.tsx           # Modal with animation player & custom video link
    │   ├── HistoryPage.tsx             # Logged workout sessions & inspection view
    │   ├── PWAInstallButton.tsx        # Install prompt / instructions trigger
    │   ├── SettingsPage.tsx            # Theme, active block, week start, & reset controls
    │   ├── ThemeProvider.tsx           # Dark / Light / System theme context
    │   └── WeekdaySwitcherStrip.tsx    # Compact block selector & 7-day weekday strip
    ├── data/
    │   ├── exerciseAnimations.ts       # Keyframe pose specs for all programme exercises
    │   └── programmes.ts               # Immutable trainer programme loader
    ├── hooks/
    │   ├── useOnlineStatus.ts          # Online / offline connectivity hook
    │   └── usePWAInstall.ts            # BeforeInstallPrompt & standalone detection hook
    ├── services/
    │   └── storage.ts                  # localStorage persistence helpers
    ├── types/
    │   └── workout.ts                  # TypeScript interfaces & union types
    └── utils/
        ├── videoHelpers.ts             # YouTube & direct video URL parser
        └── workoutFormatters.ts        # Volume, weight, date, and category formatters
```

---

## Getting Started

### Prerequisites
- **Node.js** `20+` (or `22 LTS`)
- **npm** (or `bun`)

### Local Development

```bash
# 1. Install dependencies
npm install

# 2. Start the development server on http://localhost:3000
npm run dev
```

### Build & Verify

```bash
# Type-check with TypeScript
npm run lint

# Build production bundle & generate PWA service worker
npm run build

# Preview the production build locally
npm run preview
```

---

## Data & Privacy

- **100% Local Persistence:** All workout check-ins, theme/block preferences, and custom exercise video links are stored in `localStorage` (`setora_preferences`, `setora_completion_records`, `setora_exercise_notes`) on your device.
- **No Account Required:** No sign-in walls, no telemetry, and no external tracking.
- **Immutable Programme:** The prescribed workout JSON is loaded read-only so trainer targets remain intact.
