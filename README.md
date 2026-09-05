# Sticky Roll World

Roll a sticky ball around a low-poly planet, absorbing everything in your path. Start the size of a pebble, finish the size of a skyscraper — five biomes, fleeing animals, legendary landmarks, and a 10-minute clock.

Built with React 19, Three.js, Tailwind CSS 4, and Vite. Fully client-side, no backend.

## How to Play

- **Roll** — `WASD` / Arrow Keys (or virtual stick on touch devices)
- **Boost Dash** — `Space` (or boost button)
- **Camera View** — `C` (or camera icon)
- **Pause** — `P`

Roll over objects smaller than you to absorb them and grow. Anything too big bounces you off — until you're big enough that it doesn't. Absorb everything on the planet for a perfect run.

## Getting Started

**Prerequisites:** [Bun](https://bun.sh) (or Node.js + npm)

```bash
bun install
bun run dev
```

Open http://localhost:3000.

## Scripts

| Command | What it does |
|---|---|
| `bun run dev` | Dev server with hot reload |
| `bun run build` | Production build to `dist/` |
| `bun run build:single` | Self-contained single-file `dist/index.html` — works offline by double-clicking |
| `bun run preview` | Preview the production build |
| `bun run lint` | Type-check with `tsc --noEmit` |

## Project Structure

```
src/
├── game/        # Engine: rolling physics, planet generation, procedural audio, object models
├── components/  # HUD, pause/game-over/catalog overlays
├── utils/       # Formatters
├── types.ts     # Shared game types
├── App.tsx
└── main.tsx
```

## License

[Apache-2.0](LICENSE)
