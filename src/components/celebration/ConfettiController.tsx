import { useEffect, useRef } from 'react'
import confetti from 'canvas-confetti'
import type { ConfettiIntensity } from '../../config.types'
import './ConfettiController.css'

const COLORS = ['#e8728c', '#7faa78', '#6db5c9', '#c9a24b', '#ff9d4d', '#9b7ad1', '#fffaf0']
const COUNTS: Record<ConfettiIntensity, number> = { low: 90, med: 160, high: 240 }

/** Fires a celebratory confetti burst once, when the room lights up. */
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

    // Custom paper shapes (★ + ♥) alongside default squares.
    let shapes: confetti.Shape[] | undefined
    try {
      shapes = [
        confetti.shapeFromText({ text: '★', scalar: 2 }),
        confetti.shapeFromText({ text: '♥', scalar: 2 }),
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
      return () => fire.reset()
    }

    const count = COUNTS[intensity]

    // central pop
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
    // big shape burst
    fire({
      particleCount: Math.round(count * 0.35),
      spread: 130,
      startVelocity: 35,
      scalar: 1.6,
      origin: { y: 0.45 },
      colors: COLORS,
      shapes,
    })

    // streaming side cannons for ~900ms
    const end = performance.now() + 900
    const frame = () => {
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
      if (performance.now() < end) raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(raf)
      fire.reset()
    }
  }, [reduced, intensity])

  return <canvas ref={canvasRef} className="confetti-canvas" aria-hidden="true" />
}
