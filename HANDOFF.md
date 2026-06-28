# 🤝 HANDOFF — pawa-birtday (Pop-Up Petang birthday site)

> Catatan serah-terima untuk melanjutkan di sesi berikutnya (setelah clear chat).
> Penjelasan dalam Bahasa Indonesia; **semua konten website ditulis English** (preferensi user).
> Terakhir diperbarui: 2026-06-28.

---

## 1. Status singkat

**Website SUDAH SELESAI diimplementasi penuh & terverifikasi end-to-end.** Belum di-commit (semua perubahan masih di working tree). Tidak ada error: `tsc -b`, `oxlint`, dan `vite build` semua bersih.

Desain: **"Pop-Up Petang"** — buku pop-up cut-paper. Gelap bercahaya lilin → flip saklar → ruangan banjir cahaya emas + confetti + musik → foto, balon, kue, stiker kenangan → amplop → surat kertas bergaris.

Stack: **Vite 8 + React 19 + TypeScript + Bun + oxlint**. Animasi tangan (SVG+CSS) + `motion` + `canvas-confetti` + font self-host (Fraunces / Newsreader / Caveat / Pinyon Script via `@fontsource`).

Deploy target: **GitHub Pages** project site di base `/pawa-birtday/`.

---

## 2. Cara menjalankan

```bash
bun install
bun run dev        # http://localhost:5173/pawa-birtday/
bun run build      # tsc -b && vite build
bun run preview    # produksi di base path asli (http://localhost:4173/pawa-birtday/)
bun run lint       # oxlint
```

> Catatan: server mungkin masih jalan dari sesi lalu. Cek dulu sebelum start baru.

---

## 3. 10 langkah flow (semua sudah jalan)

DARK → typed _"why is it so dark in here??"_ → lilin muncul & menyala → saklar muncul → typed _"flip the switch to light up the room"_ → **flip saklar** (satu-satunya gate) → IGNITE (flood `--lit` + confetti + musik) → PARTY (judul, foto hero, balon, kue, stiker) → klik amplop → LETTER (surat kertas bergaris).

State machine: `Phase = 'DARK'|'LINE1'|'CANDLE'|'SWITCH'|'LINE2'|'IGNITE'|'PARTY'|'LETTER'`.

- Transisi waktu (timer) ada di `src/state/useStoryMachine.ts` (`AUTO_TIMERS`).
- Transisi gesture/callback (flip, openLetter, advance setelah typewriter) dari komponen.
- Reducer: `src/state/storyReducer.ts`. Tipe: `src/state/phases.ts`.

---

## 4. Peta file penting

```
src/
  config.ts              ← ⭐ SATU-SATUNYA file yang user edit (nama, foto, stiker, musik, ucapan)
  config.types.ts        ← tipe StoryConfig
  App.tsx                ← root: AudioProvider + story machine + StoryStage + lazy PartyScene
  main.tsx               ← import font + styles + render
  lib/paths.ts           ← asset() helper (prefix import.meta.env.BASE_URL) — SEMUA path lewat sini
  state/                 ← phases.ts, storyReducer.ts, useStoryMachine.ts
  hooks/                 ← useTypewriter, useReducedMotionPref, usePointerParallax,
                           useSeededRotation, useBreakpoint, useLocalStorage
  audio/                 ← useAudioController (HTMLAudio, unlock saat flip — iOS-safe),
                           audioContext.ts (useAudio), AudioProvider.tsx
  scenes/
    DarkScene.tsx        ← intro langkah 1-5 (+ fade-out saat IGNITE)
    PartyScene.tsx       ← langkah 6-10 (LAZY-loaded; confetti, firework, parallax)
  components/
    candle/   Flame.tsx (SHARED: lilin intro + lilin kue), Candle.tsx
    switch/   LightSwitch.tsx, DrawArrow.tsx
    background/ DarkBackdrop.tsx, BackgroundDiorama.tsx
    photo/    TapedPhoto.tsx (SHARED: hero + semua stiker), PhotoPlaceholder.tsx,
              TornLabel.tsx, StickerLayer.tsx (layout map per-breakpoint)
    balloons/ Balloon.tsx, BalloonField.tsx
    cake/     Cake.tsx (lilin bisa ditiup → "make a wish")
    letter/   Envelope.tsx, WaxSeal.tsx, Letter.tsx (portal + focus trap + Esc)
    celebration/ ConfettiController.tsx, Firework.tsx
    ui/       StoryStage.tsx (perspektif + --lit), MuteToggle.tsx, SkipIntro.tsx
    dialogue/ TypedLine.tsx
  styles/   theme.css (palet + font vars), base.css (reset + dvh + safe-area),
            keyframes.css (semua animasi)
public/ favicon.svg (kue+lilin), .nojekyll
.github/workflows/deploy.yml   ← GitHub Actions (Bun)
```

### Konsep kunci yang gampang lupa

- **`--lit` flood**: registered `@property --lit` (0→1) di `.story-stage`. Token turunan
  (`--pct`, `--surface-*`, `--text-*`) HARUS dideklarasi di `.story-stage` (StoryStage.css),
  BUKAN di `:root` — kalau di `:root`, `var(--lit)` ke-resolve dari nilai root (selalu 0) sebelum
  inherit turun. Ini bug yang sudah diperbaiki; jangan ulangi.
- **Base path GitHub Pages**: `vite.config.ts` `base: '/pawa-birtday/'` + `asset()` + `public/.nojekyll`.
- **Audio iOS**: `audio.unlock()` dipanggil SINKRON di handler klik saklar (App `handleFlip`).
- **Rotasi stiker**: deterministik via `seededRotation()` (jangan `Math.random()` saat render).
- **Constraint repo**: `erasableSyntaxOnly` (tanpa enum), `verbatimModuleSyntax` (pakai `import type`),
  `noUnusedLocals/Parameters`, oxlint `react/only-export-components`.

---

## 5. Yang sudah diverifikasi (Chrome DevTools MCP)

- ✅ Alur lengkap intro → flip → party → surat (screenshot tiap tahap)
- ✅ `--lit` dark→cream flood (`--pct` = 100% setelah flip)
- ✅ Surat: autofocus tombol close, Esc menutup, fokus balik ke amplop
- ✅ Reduced-motion (override matchMedia): semua langkah muncul, firework hilang, typing instan
- ✅ Responsif: 1280 / 1600 / ~500 / 390 / landscape 860×380 — tanpa overflow horizontal, stiker tidak tabrakan
- ✅ Produksi base path: 0 error 404, PartyScene + Pinyon di-lazy-load

---

## 6. Yang HARUS dilakukan user (belum bisa dikerjakan Claude)

1. **Aset asli** → taruh di `public/` (mis. `public/photos/hero.jpg`, `public/audio/celebration.mp3`)
   lalu set path-nya di `src/config.ts` (TANPA leading slash). Tanpa aset → placeholder gambar tampil,
   layout tetap sama saat foto asli ditambahkan.
2. **Enable Pages** (sekali): repo **Settings → Pages → Source = "GitHub Actions"**. Workflow sudah siap; push ke `main` → auto-deploy ke `https://<username>.github.io/pawa-birtday/`.
3. (Opsional) **Commit** perubahan — Claude belum commit apa pun.

---

## 7. Ide polish / kemungkinan lanjutan (opsional, belum dikerjakan)

- **DrawArrow** (panah hint ke saklar) masih agak halus secara visual — bisa dibuat lebih jelas
  atau diganti gaya doodle lain. Posisinya di `DarkScene.css` `.dark-scene__arrow`.
- **Persistence kunjungan ulang**: saat ini tombol "Skip" selalu ada saat intro; belum ada
  auto-skip untuk pengunjung berulang (sengaja, karena audio butuh gesture). Bisa ditambah kalau mau.
- **Stiker saat scroll**: StickerLayer fixed sebagai bingkai (tidak ikut scroll konten). Kalau mau
  ikut scroll, pindahkan ke dalam `.party-scene__scroll`.
- Garis pada kertas surat tidak persis sejajar baseline teks — kosmetik, bisa dirapikan.
- Belum ada file musik/SFX nyata → audio no-op sampai user kasih aset.
- Bisa tambah opsi `theme` override (sudah didukung di config, contoh ada di komentar `config.ts`).

---

## 8. Referensi

- Plan lengkap: `C:\Users\david\.claude\plans\aku-ingin-membuat-website-mutable-fern.md`
- Dokumentasi config & deploy: `README.md`
- Memory tersimpan: `language-preference` (Indonesia chat / English konten), `birthday-site-project` (status).

---

## 9. Cara resume di sesi berikutnya

Cukup bilang: **"lanjutkan project pawa-birtday, baca HANDOFF.md"**. Claude akan baca file ini +
`README.md` + `config.ts` untuk dapat konteks penuh, lalu lanjut dari poin 6/7 di atas.
