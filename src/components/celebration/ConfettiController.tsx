import { useEffect, useRef } from 'react'
import confetti from 'canvas-confetti'
import type { ConfettiIntensity } from '../../config.types'
import './ConfettiController.css'

const COLORS = ['#e8728c', '#7faa78', '#6db5c9', '#c9a24b', '#ff9d4d', '#9b7ad1', '#fffaf0']
// How many flakes to drop in per animation frame — denser at higher intensity.
const PER_FRAME: Record<ConfettiIntensity, number> = { low: 1, med: 2, high: 3 }

const rnd = (min: number, max: number) => Math.random() * (max - min) + min

/** Continuously rains celebratory confetti down from the top of the screen. */
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

    const fire = confetti.create(canvas, { resize: true, useWorker: true })
    let raf = 0

    // Custom paper shapes (★ + ♥) mixed with default squares/circles.
    let shapes: confetti.Shape[] | undefined
    try {
      shapes = [
        confetti.shapeFromText({ text: '★', scalar: 1.6 }),
        confetti.shapeFromText({ text: '♥', scalar: 1.6 }),
        'square',
        'circle',
      ]
    } catch {
      shapes = undefined
    }

    if (reduced) {
      // a single gentle sprinkle from the top — no looping
      fire({
        particleCount: 40,
        spread: 120,
        startVelocity: 8,
        gravity: 0.8,
        ticks: 200,
        origin: { y: 0 },
        colors: COLORS,
      })
      return () => fire.reset()
    }

    const perFrame = PER_FRAME[intensity]

    // Rain: every frame, drop a few flakes in from just above the top edge,
    // spread across the width, and let gravity carry them down with a little
    // sideways sway (drift) so they scatter instead of falling in straight lines.
    const frame = () => {
      for (let i = 0; i < perFrame; i++) {
        fire({
          particleCount: 1,
          startVelocity: 0,
          ticks: 360, // live long enough to fall past the bottom edge
          origin: { x: Math.random(), y: rnd(-0.2, 0) },
          colors: COLORS,
          shapes,
          gravity: rnd(0.5, 0.8),
          scalar: rnd(0.7, 1.3),
          drift: rnd(-0.6, 0.6),
        })
      }
      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(raf)
      fire.reset()
    }
  }, [reduced, intensity])

  return <canvas ref={canvasRef} className="confetti-canvas" aria-hidden="true" />
}
