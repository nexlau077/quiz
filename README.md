# 🎂 A Little Surprise — Birthday Greeting Site

A static, interactive birthday surprise built as a **cut-paper pop-up book**
("Pop-Up Petang"). The page boots in candlelit dark; flip the light switch and
the whole room floods with warm gold — confetti, music, balloons, a cake you can
blow out, scrapbook photos, and a sealed letter to open.

Everything is hand-built with **inline SVG + CSS** (candle, switch, balloons,
cake, envelope, fireworks) plus `motion`, `canvas-confetti`, and self-hosted
fonts. No real assets are required to run — drawn placeholders stand in until you
drop in real photos and music.

## The flow

Dark screen → typed _"why is it so dark in here??"_ → a candle appears and lights
→ a light switch fades in → typed _"flip the switch to light up the room"_ → flip
it → light floods in with confetti + music → the birthday photo, balloons, cake,
and taped memory photos appear → an envelope at the bottom opens into a
lined-paper letter.

## Configure (the only file you edit)

Open [`src/config.ts`](src/config.ts) and change:

- `friendName`, `age`
- `dialogue` — the two typed lines
- `greeting` — the letter (salutation, body paragraphs, sign-off)
- `stickers` — the scattered memory photos (captions, shapes, tape style)
- `heroPhoto`, `stickers[].src`, `musicPath`, `sfx` — asset paths
- `candleCount`, `confettiIntensity`, and optional `theme` overrides

### Adding real assets

Put files under `public/` (e.g. `public/photos/…`, `public/audio/…`) and point
the config paths at them, **without** a leading slash:

```ts
heroPhoto: 'photos/hero.jpg',
musicPath: 'audio/celebration.mp3',
stickers: [{ src: 'photos/us.jpg', caption: 'us together', together: true }],
```

Paths are resolved through `asset()` so they work correctly under the GitHub
Pages sub-path. Leave a path out → a hand-drawn placeholder is shown and the
layout stays identical when the real photo is added later.

> Music and sound effects only start **after** the switch is flipped (a user
> gesture), which is required for autoplay on iOS. A sound on/off toggle is in
> the top-right corner and is remembered across visits.

## Develop

```bash
bun install
bun run dev        # http://localhost:5173/pawa-birtday/
bun run build      # tsc -b && vite build
bun run preview    # serve the production build at the real base path
bun run lint       # oxlint
```

## Deploy (GitHub Pages)

1. Push to the `main` branch.
2. In the repo: **Settings → Pages → Build and deployment → Source = "GitHub
   Actions"** (one-time).
3. The included workflow ([.github/workflows/deploy.yml](.github/workflows/deploy.yml))
   builds with Bun and deploys automatically. The site goes live at
   `https://<your-username>.github.io/pawa-birtday/`.

If you rename the repository, update `base` in
[`vite.config.ts`](vite.config.ts) to match (`'/<repo-name>/'`).

## Notes

- Fully responsive (mobile → ultrawide, portrait & landscape) and tuned for
  Android/iOS — `dvh` units, safe-area insets, ≥44px touch targets, pointer
  events.
- Respects `prefers-reduced-motion`: all ten story beats still play, but loops,
  parallax, and the confetti storm are toned down.
- `Skip ›` (bottom-right) jumps straight to the party.
