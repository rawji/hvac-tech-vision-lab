# HVAC Technician World

Browser-native 3D service-call practice — a compact, handcrafted neighborhood diorama where you respond to HVAC calls, inspect equipment, and reason through diagnoses with optional **Tech Vision** overlay.

> **Learn it in 2D. Practice it in 3D. Diagnose it with Tech Vision.**

This repo is separate from the 2D HVAC/EPA curriculum app. It does not import curriculum content, EPA study sessions, or curriculum data files.

## Design Direction

**Messenger-inspired, not a clone.** The quality bar is [Messenger by Abeto](https://messenger.abeto.co/) — effortless click-to-move, small dense world, minimal UI friction, illustration-like polish — translated into an HVAC field-service experience.

*“Messenger, but instead of delivering mail on a tiny planet, you are an HVAC technician responding to service calls in a living neighborhood.”*

Player goal: *“What should I inspect next?”* — not *“What button do I press?”*

## Product Vision

Three connected but independent experiences:

1. **HVAC Curriculum 2D** — structured lessons (separate project)
2. **HVAC Technician World** — applied service-call practice (this repo)
3. **Tech Vision** — optional diagnostic overlay inside the 3D world

## Purpose

One focused field-service loop:

Click to navigate → Inspect on arrival → Enable Tech Vision → Scan clues → Reason through causes → Choose diagnosis → Receive HVAC explanation

First mission: **Service Call: No Cooling Reported** (dirty condenser coil scenario)

## Setup

```bash
cd hvac-tech-vision-lab
npm install
```

## Run Locally

```bash
npm run dev
```

Open the URL shown in the terminal (typically `http://localhost:5173/hvac-tech-vision-lab/` in production builds, or `http://localhost:5173` in dev).

## Build

```bash
npm run build
npm run preview
```

## Test

```bash
npm test
```

## Deploy

```bash
npm run deploy
```

Pushes `dist/` to the `gh-pages` branch. Also deploys automatically on push to `main` via GitHub Actions.

Live demo: https://rawji.github.io/hvac-tech-vision-lab/

## Demo Checklist

1. **Open URL** — local dev or GitHub Pages
2. **Select technician** — choose appearance on the service-call roster
3. **Start mission** — loading splash, then neighborhood diorama loads
4. **Click to move** — click yard, path, or driveway; technician walks smoothly
5. **Click equipment** — click condenser or thermostat; inspection card opens on arrival
6. **Tech Vision** — tap **Tech Vision** button; cooler diagnostic overlay activates
7. **Scan clues** — use **Scan** from the action menu with Tech Vision ON (at least two components)
8. **Diagnose** — pick the most likely cause and submit
9. **Review feedback** — HVAC explanation and related concepts
10. **Camera** — drag to orbit (360°), scroll/pinch zoom; **Reset View** restores default
11. **Mute** — toggle sound in the world overlay

## Controls

| Input | Action |
|-------|--------|
| Click / tap ground | Walk to destination |
| Click / tap equipment | Walk to equipment; inspection opens on arrival |
| Drag on scene | Orbit camera (holds your chosen angle) |
| Scroll / pinch | Zoom camera |
| Action menu | Inspect, Scan, View Notes |
| Tech Vision button | Toggle diagnostic overlay |
| Reset View | Restore start position and camera |
| Esc | Close panels |
| 🔊 / 🔇 | Mute procedural sound |

**Optional keyboard (accessibility):** V = Tech Vision, E = inspect nearby, F = scan nearby

**Mission 1 is fully playable with mouse only (desktop) or touch only (mobile).**

## Tech Vision Mode

Optional diagnostic layer — not an answer key. Cooler palette, wireframe highlights, component tags, thermal/airflow overlays, clipboard-style scan readouts with observed conditions and possible causes.

## Mission Summary

**Customer complaint:** Homeowner reports the system runs but the house is not cooling well.

Investigate the residential scene, inspect and scan equipment, gather clues (elevated head pressure, restricted outdoor airflow, dirty coil indicators), and select the most likely diagnosis.

## Architecture

```
src/
  data/          Mission content, equipment health, scan definitions
  logic/         Mission state, status mapping, diagnosis evaluation
  components/
    ui/          HTML panels and HUD
    world/       3D service-call scene
    techVision/  Diagnostic overlay visuals only
    interactions/ Proximity, navigation helpers
```

Diagnosis logic stays in `logic/`. Tech Vision reads equipment health — it does not evaluate answers.

## Known Limitations

- Single mission POC (Mission 1 neighborhood diorama)
- Stylized low-poly geometry (no external 3D models)
- Three.js bundle ~1 MB JS (gzip ~280 KB) — normal for WebGL + R3F
- No backend, auth, or cloud saves
- No connection to 2D curriculum progress

## Future Integration (Not Implemented)

- Launcher link from 2D curriculum
- Shared concept IDs
- Optional shared progress backend

Do **not** merge WebGL dependencies into the curriculum repo until this POC is stable.

## License

Private experimental POC — not for production deployment without further review.
