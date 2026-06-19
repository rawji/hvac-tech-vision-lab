# HVAC Tech Vision Lab

Isolated WebGL proof-of-concept for a browser-based 3D HVAC technician training world with an optional **Tech Vision Mode** diagnostic overlay.

> **Learn it in 2D. Practice it in 3D. Diagnose it with Tech Vision.**

This repository is intentionally separate from the existing 2D HVAC/EPA curriculum app. It does not import curriculum content, EPA study sessions, or curriculum data files.

## Product Vision

Three connected but independent experiences:

1. **HVAC Curriculum 2D** — structured lessons and assessments (existing separate project)
2. **HVAC Technician World 3D** — applied service-call practice (this repo)
3. **Tech Vision Mode** — optional diagnostic visualization overlay inside the 3D world

## Purpose

Prove one focused learning loop:

Walk to equipment → Activate Tech Vision → Scan clues → Reason through causes → Choose diagnosis → Receive HVAC explanation

First mission: **No Cooling Call: Dirty Condenser Coil**

## Setup

```bash
cd hvac-tech-vision-lab
npm install
```

## Run Locally

```bash
npm run dev
```

Open the URL shown in the terminal (typically `http://localhost:5173`).

## Build

```bash
npm run build
npm run preview
```

## Test

```bash
npm test
```

## Demo Checklist

Use this flow to verify the one-mission POC before a live demo or GitHub Pages deploy:

1. **Open URL** — run `npm run dev` locally or open the GitHub Pages URL
2. **Select technician** — choose any male/female and appearance option
3. **Start mission** — confirm the service-call scene loads (loading splash, then world)
4. **Move toward condenser** — use WASD/arrows or the touch pad; camera should follow smoothly
5. **Inspect equipment** — stand near the thermostat and press **E** or tap **Inspect**
6. **Toggle Tech Vision** — press **V** or tap **Tech Vision** (optional scanner chirp after first click)
7. **Scan at least two clues** — walk to the outdoor condenser coil and another component; press **F** or tap **Scan** with Tech Vision ON
8. **Choose diagnosis** — open Mission Details if needed; pick the most likely cause and **Submit Diagnosis**
9. **Review feedback** — confirm educational explanation and related concepts appear
10. **Test Reset View** — return to mission and tap **Reset View** to restore start position
11. **Test mute toggle** — tap 🔊/🔇; sounds should stop without breaking gameplay

Optional recovery during demo: **Reset View** restores player position and camera. **Mute** keeps the demo quiet in shared spaces.

## Controls

| Input | Action |
|-------|--------|
| WASD / Arrow keys | Move technician (camera-relative) |
| Right-drag on scene | Gently adjust camera angle |
| E | Inspect nearby equipment (normal mode) |
| F | Diagnostic scan (Tech Vision must be ON) |
| V | Toggle Tech Vision Mode |
| Esc | Close scan card / hide mission details (mobile) |
| 🔊 / 🔇 | Mute or unmute procedural sound effects |
| On-screen pad | Move on touch devices (camera-relative) |
| World overlay buttons | Tech Vision, Inspect, Scan, Reset (mobile-friendly) |
| Reset View | Restore player position and camera |

**Inspect vs Scan:** Inspect works anytime and shows component readings. Scan with Tech Vision ON records diagnostic clues toward your diagnosis. Tech Vision reveals clues and possible causes — not the final answer.

**Desktop recommended** for the best experience. Mobile uses a large touch pad, world overlay action buttons, and a collapsible mission details drawer.

## Tech Vision Mode

Tech Vision is an optional diagnostic overlay — not an answer key.

When enabled:

- Wireframe highlights and diagnostic grid
- Component tags with status colors
- Thermal, airflow, and refrigerant flow overlays
- ASCII-style scan cards with observed conditions and possible causes

Status colors:

- Green = normal
- Yellow = warning
- Red = fault
- Blue = informational

Labels and text accompany colors for accessibility.

## Mission Summary

**Customer complaint:** "The system runs, but the house is not cooling well."

Investigate the residential service-call scene, scan equipment, gather clues (high head pressure, restricted outdoor airflow, dirty condenser coil indicators), and select the most likely diagnosis.

## Architecture

```
src/
  data/          Mission content, equipment health, scan definitions
  logic/         Mission state, status mapping, diagnosis evaluation
  components/
    ui/          HTML panels and HUD
    world/       Normal 3D scene
    techVision/  Diagnostic overlay visuals only
    interactions/ Proximity, keyboard, prompts
```

Tech Vision visuals read equipment health data — they do not evaluate mission answers.

## Known Limitations

- Single mission POC only
- Stylized low-poly geometry (no external 3D models)
- Touch movement uses a large on-screen pad; desktop keyboard is recommended for demos
- Optional procedural sound (Web Audio API); mute toggle in header and world overlay
- No backend, authentication, or cloud saves
- No connection to 2D curriculum progress
- Orbit camera may feel less intuitive on small screens (follow camera is default)

## Performance Notes

- **Three.js bundle size is expected** — production build is ~1 MB JS (gzip ~287 KB). This is normal for WebGL + React Three Fiber.
- **Code splitting recommended later** — lazy-load the 3D world route/chunk before GitHub Pages production traffic.
- **Mobile performance may vary** — lower-end GPUs may drop frames when Tech Vision overlays are active.
- **Avoid external 3D models until optimized** — imported assets would increase load time and memory use.
- Lightweight geometry, low particle counts, and HTML UI outside the Canvas help keep the POC stable.
- Tech Vision toggles off cleanly to restore normal rendering.

## Future Integration (Not Implemented)

Recommended later connection points:

- External link or launcher button from 2D curriculum
- Shared concept IDs and mission-to-lesson references
- Separate GitHub Pages deployment URL
- Optional shared progress backend

Do **not** merge WebGL dependencies into the curriculum repo until this POC is stable.

## Accessibility Notes

- Tech Vision toggle via keyboard (V) and button
- Scan cards rendered as readable HTML
- Status text labels alongside color coding
- Reduced-motion CSS preference respected for non-essential animations

## License

Private experimental POC — not for production deployment without further review.
