import { useEffect, useRef } from 'react'
import confetti from 'canvas-confetti'
import type { ConfettiIntensity } from '../../config.types'
import './ConfettiController.css'

const COLORS = ['#e8728c', '#7faa78', '#6db5c9', '#c9a24b', '#ff9d4d', '#9b7ad1', '#fffaf0']
// Particle budget for the opening splash.
const COUNTS: Record<ConfettiIntensity, number> = { low: 90, med: 160, high: 240 }
// Gentle ongoing rain after the splash — a small batch on a timer (NOT every
// frame) with short-lived particles, so it keeps falling without piling up.
const RAIN: Record<ConfettiIntensity, { batch: number; everyMs: number }> = {
  low: { batch: 1, everyMs: 240 },
  med: { batch: 1, everyMs: 180 },
  high: { batch: 2, everyMs: 160 },
}

const rnd = (min: number, max: number) => Math.random() * (max - min) + min

/**
 * Celebration confetti: a one-off splash when the room lights up, then a gentle
 * ongoing shower that keeps drifting down (it keeps running while you scroll).
 * The shower is rate-limited and uses short-lived particles to stay light.
 */
export function ConfettiController({
  reduced,
  intensity = 'high',
}: {
  reduced: boolean
  intensity?: ConfettiIntensity
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Cap the backing-store resolution. A full-screen fixed canvas that
    // animates non-stop is composited on every scroll; at full devicePixelRatio
    // (4x the pixels on a 2x display) that clear+redraw is what makes scrolling
    // feel heavy. 1.5 keeps it crisp while roughly halving the per-frame cost.
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
    const setSize = () => {
      canvas.width = Math.floor(window.innerWidth * dpr)
      canvas.height = Math.floor(window.innerHeight * dpr)
    }
    setSize()
    window.addEventListener('resize', setSize)

    // We size the canvas ourselves (resize: false). Worker mode is dropped
    // because it requires resize:true / OffscreenCanvas transfer, which fights
    // the manual sizing above.
    const fire = confetti.create(canvas, { resize: false, useWorker: false })
    let raf = 0
    let rainTimer = 0

    // Custom paper shapes (★ + ♥) mixed with default squares/circles.
    let shapes: confetti.Shape[] | undefined
    try {
      shapes = [
        confetti.shapeFromText({ text: '★', scalar: 1.8 }),
        confetti.shapeFromText({ text: '♥', scalar: 1.8 }),
        'square',
        'circle',
      ]
    } catch {
      shapes = undefined
    }

    if (reduced) {
      // a single gentle sprinkle
      fire({
        particleCount: 50,
        spread: 75,
        startVelocity: 28,
        origin: { y: 0.35 },
        colors: COLORS,
      })
      return () => {
        window.removeEventListener('resize', setSize)
        fire.reset()
      }
    }

    const count = COUNTS[intensity]

    // ── 1. The opening splash (central pop + big shape burst + side cannons) ──
    fire({
      particleCount: count,
      spread: 110,
      startVelocity: 48,
      decay: 0.92,
      scalar: 1.1,
      origin: { y: 0.5 },
      colors: COLORS,
      shapes,
    })
    fire({
      particleCount: Math.round(count * 0.35),
      spread: 130,
      startVelocity: 35,
      scalar: 1.6,
      origin: { y: 0.45 },
      colors: COLORS,
      shapes,
    })

    const end = performance.now() + 900
    const cannons = () => {
      fire({
        particleCount: 5,
        angle: 60,
        spread: 60,
        startVelocity: 45,
        origin: { x: 0, y: 0.7 },
        colors: COLORS,
        shapes,
      })
      fire({
        particleCount: 5,
        angle: 120,
        spread: 60,
        startVelocity: 45,
        origin: { x: 1, y: 0.7 },
        colors: COLORS,
        shapes,
      })
      if (performance.now() < end) raf = requestAnimationFrame(cannons)
    }
    raf = requestAnimationFrame(cannons)

    // ── 2. The gentle ongoing rain (rate-limited, short-lived) ──
    const { batch, everyMs } = RAIN[intensity]
    const startRain = () => {
      if (rainTimer) return
      rainTimer = window.setInterval(() => {
        for (let i = 0; i < batch; i++) {
          fire({
            particleCount: 1,
            startVelocity: 0,
            // Opacity fades linearly as tick/ticks → 1, so the particle must
            // reach the bottom well before its ticks run out or it vanishes
            // mid-screen. Falls ~gravity*3 px/frame; the canvas is innerHeight
            // *1.5 px tall (DPR cap), so we need a generous ticks budget paired
            // with a brisker gravity to land it at the bottom still visible.
            ticks: 420,
            origin: { x: Math.random(), y: rnd(-0.2, 0) },
            colors: COLORS,
            shapes,
            gravity: rnd(1.4, 1.9),
            scalar: rnd(0.7, 1.2),
            drift: rnd(-0.5, 0.5),
          })
        }
      }, everyMs)
    }
    const stopRain = () => {
      window.clearInterval(rainTimer)
      rainTimer = 0
    }
    // Don't keep the canvas redrawing when the page isn't visible.
    const onVisibility = () => (document.hidden ? stopRain() : startRain())
    document.addEventListener('visibilitychange', onVisibility)
    startRain()

    return () => {
      cancelAnimationFrame(raf)
      stopRain()
      window.removeEventListener('resize', setSize)
      document.removeEventListener('visibilitychange', onVisibility)
      fire.reset()
    }
  }, [reduced, intensity])

  return <canvas ref={canvasRef} className="confetti-canvas" aria-hidden="true" />
}
