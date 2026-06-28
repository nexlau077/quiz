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

Paths are resolved through `asset()` so they stay correct no matter what `base`
the site is served from. Leave a path out → a hand-drawn placeholder is shown and
the layout stays identical when the real photo is added later.

> Music and sound effects only start **after** the switch is flipped (a user
> gesture), which is required for autoplay on iOS. A sound on/off toggle is in
> the top-right corner and is remembered across visits.

## Develop

```bash
bun install
bun run dev        # http://localhost:5173/      (dev is served at root)
bun run build      # tsc -b && vite build
bun run preview    # http://localhost:4173/quiz/  (mirrors production)
bun run lint       # oxlint
```

## Deploy (GitHub Pages)

This is a **project site** served under the repo sub-path, so the production
build uses `base: '/quiz/'` (see [`vite.config.ts`](vite.config.ts)). It goes live
at `https://<username>.github.io/quiz/`. If you rename the repo, update the
production `base` string to `'/<repo>/'` to match, or assets will 404.

1. In the repo: **Settings → Pages → Build and deployment → Source = "GitHub
   Actions"** (one-time). **This is required** — if Source is left as "Deploy from
   a branch", Pages serves the raw source (`/src/main.tsx`) instead of the build
   and the page renders blank.
2. Push to the `main` branch.
3. The included workflow ([.github/workflows/deploy.yml](.github/workflows/deploy.yml))
   builds with Bun and deploys `dist/` automatically.

> Want a root URL (`https://<username>.github.io/` with no `/quiz/`) instead?
> Rename the repo to `<username>.github.io`, or add a custom domain via
> `public/CNAME` — then set the production `base` back to `'/'`.

## Notes

- Fully responsive (mobile → ultrawide, portrait & landscape) and tuned for
  Android/iOS — `dvh` units, safe-area insets, ≥44px touch targets, pointer
  events.
- Respects `prefers-reduced-motion`: all ten story beats still play, but loops,
  parallax, and the confetti storm are toned down.
- `Skip ›` (bottom-right) jumps straight to the party.
