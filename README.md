# Desk Racer

A browser time-trial where a seal-point Siamese cat drives a 1:87 HO-scale kart around a miniature coaster built on a night-time desk. Three laps, a ghost of your best lap, and a diorama of real desk objects: a Logitech G915, an LG UltraGear, a boom mic, a key light, and a ginger cat figurine.

The in-game title is **Siamese Cat Grand Prix**. The package name is `desk-racer`.

## Features

- **3-lap time trial** on a closed coaster, with an F1-style start countdown and a finish screen (total time and best lap).
- **Siamese cat driver** with seal-point fur, sapphire eyes, racing goggles, a steering-wheel grip, a head that leans into turns, and a swishing tail.
- **1:87 micro kart** (about 18 × 12 × 8 mm) with steerable wheels, headlights, exhaust, and drift sparks.
- **Spline-assisted driving** on a banked track. Steer to hold the racing line; miss the apex and the kart slides toward the outside rail. A clean corner exit gives a short boost. Hitting the guardrail pins you.
- **Ghost car** records your best lap at 30 Hz, replays it as a cyan hologram, and shows a live time delta. The record is stored in `localStorage` (`desk_racer_ghost_v1`). Toggle it with **G**.
- **Autopilot** follows the racing line, drifts the tight sectors, and boosts on the keyboard straight.
- **Four cameras:** chase, cockpit, free desk orbit, and a kart-locked drone.
- **Desk diorama** at real-world millimeter scale, plus a bedroom around the desk. GLB props are preferred; procedural meshes are the fallback.
- **Night lighting** with a warm desk lamp, cyan keyboard and mouse-pad glow, a blue mic ring, soft shadows, depth-of-field, bloom, and FXAA.
- **Hybrid audio:** sampled idle, cruise, drift, and curb loops, plus exhaust sputters, crossfaded by engine speed. Mute with **M**.
- **Touch controls** for phones after the race starts.

## Controls

| Input | Action |
| --- | --- |
| **Enter** | Start the time trial, or race again from the finish screen |
| **W** / **↑** | Accelerate |
| **S** / **↓** | Brake |
| **A** / **←** **D** / **→** | Steer |
| **1** | Chase view |
| **2** | Cockpit |
| **3** | Full desk (orbit, pan, zoom) |
| **4** | Drone / helicopter view |
| **G** | Toggle ghost car |
| **M** | Mute / unmute |
| **P** | Toggle autopilot |
| **R** | Reset to the start line |

Driving with **W / A / S / D** or the arrow keys cancels autopilot. On a phone, use the on-screen steer, accel, and brake buttons.

Click the **Desk Racer** title to reopen the controls dialog.

## Getting started

Requires Node.js 18+ (or [Bun](https://bun.sh)) and a WebGL2 browser. A network connection is needed the first time so the dev server can proxy the desk, track, kart, and room GLBs.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Press **Enter** when the circuit is ready.

```bash
npm run build    # production bundle; downloads GLBs into dist/
npm run preview  # serve the production build on port 3000
npm run lint     # tsc --noEmit
```

`predev`, `prebuild`, and `prelint` install dependencies automatically if `node_modules/.bin` is missing (`bun install`, then `npm install`).

## How it is built

The page is a single WebGL app. `index.html` mounts the canvas and HUD, then loads `src/main.js`. React is a dependency, but the race loop does not go through `src/App.tsx`.

| Piece | Role |
| --- | --- |
| `src/main.js` | Scene, renderer, post-processing, asset load, HUD, cameras, game loop |
| `src/physics/KartPhysicsController.js` | Rapier world (desk, monuments, track trimesh) plus a spline vehicle step |
| `src/scene/CoasterTrackBuilder.js` | Track mesh, curbs, rails, start lights, checkered gantry |
| `src/scene/DeskDioramaBuilder.js` | Oak desk and props, with procedural textures |
| `src/scene/RoomEnvironmentBuilder.js` | Bedroom around the desk |
| `src/scene/MicroKartBuilder.js` | Player kart and cat driver |
| `src/scene/GhostKartBuilder.js` | Holographic ghost kart |
| `src/scene/SiameseCatDriver.js` | Cat mesh, shared by the player and the ghost |
| `src/scene/GoldenHourAtmosphere.js` | Lights, dust, and night illumination |
| `src/ghost/GhostSystem.js` | Lap recording, playback, and `localStorage` |
| `src/audio/WebAudioSynth.js` | Sampled engine, drift, curb, and one-shot sputters |
| `public/assets/data/track_spline.json` | 720-sample closed loop (6 sectors, ~3.61 m, ~314 m at full scale) |
| `public/assets/data/desk_manifest.json` | Desk object sizes and positions in meters |

Scale is meters in the scene: 1 unit = 1 m. The kart is HO 1:87. The HUD speedometer is scaled so a cruise of about 0.20 m/s reads as 75 km/h.

### Track sectors

1. BoYata laptop-stand climb
2. Ginger-cat 360° banked helix
3. Blue-mic underpass and boom-arm ridge
4. Key-light 360° corkscrew
5. Mouse-mat C-curve
6. Logitech G915 lattice viaduct (start / finish)

### Models

At dev time, `/assets/models` and `/api/gstatic-models` proxy:

`https://www.gstatic.com/aistudio/starter-apps/desk-racer/models`

Files: `desk_props.glb`, `track_coaster.glb`, `kart_1to87.glb`, `room_environment.glb`.

`vite build` downloads those files into `dist/assets/models` and `dist/api/gstatic-models`. If a GLB is missing, the procedural builders still draw the desk, track, kart, and room.

### Debug query flags

Optional URL parameters used for screenshots and inspection, not normal play:

`?cam=1..9`, `?sector=1..6`, `?s=`, `?speed=`, `?boost=1`, `?finish=1`, `?f1step=1..5`, `?screenshot=1`, `?sparks=1`, `?hidelogo=1`, `?carview=front|rear`.

## Project layout

```
index.html                 HUD, welcome dialog, canvas mount
src/main.js                Game entry and render loop
src/physics/               Rapier + spline kart controller
src/scene/                 Diorama, track, kart, cat, lighting
src/ghost/                 Best-lap ghost
src/audio/                 Web Audio engine
public/assets/audio/       Idle, cruise, drift, curb, sputter WAVs
public/assets/data/        Track spline and desk manifest
vite.config.ts             Dev proxy and build-time GLB fetch
```

## Stack

- [Vite](https://vitejs.dev/) 6
- [Three.js](https://threejs.org/) (ACES filmic tone mapping, bokeh, bloom, FXAA)
- [@dimforge/rapier3d-compat](https://rapier.rs/) for static colliders
- Web Audio API and sampled stems in `public/assets/audio/`
