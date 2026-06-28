import { useCallback, useEffect, useRef, useState } from 'react'
import { config } from '../config'
import { asset } from '../lib/paths'

const MUSIC_VOLUME = 0.55
const SFX_VOLUME = 0.7
const FADE_MS = 600

export interface AudioApi {
  /** Has audio been unlocked by a user gesture yet. */
  ready: boolean
  /** Call SYNCHRONOUSLY inside a click/tap handler (required on iOS). */
  unlock: () => void
  /** Play a one-shot sound effect by config key. */
  playSfx: (name: string) => void
}

/** Owns background music + SFX. Autoplay-safe: nothing plays until unlock(). */
export function useAudioController(): AudioApi {
  const [ready, setReady] = useState(false)
  const musicRef = useRef<HTMLAudioElement | null>(null)
  const fadeRef = useRef(0)

  const fadeTo = useCallback((target: number) => {
    const el = musicRef.current
    if (!el) return
    window.clearInterval(fadeRef.current)
    const from = el.volume
    const start = performance.now()
    fadeRef.current = window.setInterval(() => {
      const t = Math.min(1, (performance.now() - start) / FADE_MS)
      el.volume = from + (target - from) * t
      if (t >= 1) window.clearInterval(fadeRef.current)
    }, 30)
  }, [])

  const unlock = useCallback(() => {
    if (ready) return
    setReady(true)
    if (!config.musicPath) return
    const src = asset(config.musicPath)
    if (!src) return
    const el = new Audio(src)
    el.loop = true
    el.volume = 0
    el.preload = 'auto'
    musicRef.current = el
    // play() must be called within the gesture; ignore rejection (missing file).
    el.play()
      .then(() => fadeTo(MUSIC_VOLUME))
      .catch(() => {
        /* asset missing or blocked — stay silent */
      })
  }, [ready, fadeTo])

  const playSfx = useCallback((name: string) => {
    const path = config.sfx?.[name]
    const src = asset(path)
    if (!src) return
    const el = new Audio(src)
    el.volume = SFX_VOLUME
    el.play().catch(() => {
      /* missing sfx — ignore */
    })
  }, [])

  // Cleanup on unmount (StrictMode-safe).
  useEffect(() => {
    return () => {
      window.clearInterval(fadeRef.current)
      musicRef.current?.pause()
      musicRef.current = null
    }
  }, [])

  return { ready, unlock, playSfx }
}
