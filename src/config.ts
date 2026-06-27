import type { StoryConfig } from './config.types'

/* ============================================================================
   ✦ THE ONLY FILE YOU NEED TO EDIT ✦
   ----------------------------------------------------------------------------
   Drop real assets into /public (e.g. public/photos, public/stickers,
   public/audio) and point the paths below at them. Leave a path out and a
   hand-drawn placeholder is shown instead — the layout never shifts when you
   later add the real photo. All visible copy is in English; change freely.
   ============================================================================ */

export const config: StoryConfig = {
  // — Who this is for —
  friendName: 'My Friend',
  age: 21,

  // — Hero photo (centre stage). Omit `heroPhoto` to use the placeholder.
  // heroPhoto: 'photos/hero.jpg',

  // — Candles on the cake —
  candleCount: 5,
  confettiIntensity: 'high',

  // — The two typed lines of the intro —
  dialogue: {
    darkLine: 'why is it so dark in here??',
    switchHint: 'flip the switch to light up the room',
  },

  // — The letter inside the envelope —
  greeting: {
    salutation: 'To my dearest friend,',
    body: [
      'Happy birthday!',
      'Thank you for always being there — through the bright days and the dark ones.',
      'May all your dreams light up one by one, just like these candles.',
    ],
    signoff: 'With love,',
  },

  // — Scattered memory stickers. Add `src` to use a real photo; omit for a
  //   drawn placeholder. `together: true` marks a "you + friend" shot. —
  stickers: [
    { caption: 'us together', together: true, shape: 'polaroid', tapeStyle: 'cross' },
    { caption: 'the birthday star', shape: 'polaroid', tapeStyle: 'single' },
    { caption: 'our adventure', together: true, shape: 'torn', tapeStyle: 'tack' },
    { caption: 'throwback', shape: 'polaroid', tapeStyle: 'single' },
    { caption: 'good times', together: true, shape: 'torn', tapeStyle: 'cross' },
    { caption: 'memories', shape: 'circle', tapeStyle: 'tack' },
  ],

  // — Audio. Drop files in /public/audio and uncomment. Music only starts after
  //   the switch is flipped (a user gesture), which is required on iOS. —
  // musicPath: 'audio/celebration.mp3',
  // sfx: {
  //   switch: 'audio/click.mp3',
  //   pop: 'audio/pop.mp3',
  //   whoosh: 'audio/whoosh.mp3',
  //   sealCrack: 'audio/seal.mp3',
  //   rustle: 'audio/rustle.mp3',
  // },

  // — Optional theme overrides (CSS custom properties, no leading dashes) —
  // theme: { rose: '#ff6f91', 'lit-gold': '#d8b04e' },
}

export default config
