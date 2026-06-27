import './LightSwitch.css'

interface LightSwitchProps {
  flipped: boolean
  onFlip: () => void
}

/**
 * Wall light switch. The single gate before the room lights up.
 * onFlip runs synchronously in the pointer handler so audio can unlock on iOS.
 */
export function LightSwitch({ flipped, onFlip }: LightSwitchProps) {
  return (
    <button
      type="button"
      className={`light-switch ${flipped ? 'is-on' : ''}`}
      aria-label="Light switch"
      aria-pressed={flipped}
      onPointerDown={(e) => {
        // Primary pointer only; act on press for snappy, hover-free feel.
        if (e.button !== 0 && e.pointerType === 'mouse') return
        if (!flipped) onFlip()
      }}
      onClick={() => {
        // Fallback for keyboard activation (Enter/Space fire click, not pointer).
        if (!flipped) onFlip()
      }}
    >
      <span className="light-switch__plate">
        <span className="light-switch__screw light-switch__screw--tl" />
        <span className="light-switch__screw light-switch__screw--br" />
        <span className="light-switch__slot">
          <span className="light-switch__rocker">
            <span className="light-switch__rocker-face" />
          </span>
        </span>
      </span>
      <span className="light-switch__halo" aria-hidden="true" />
    </button>
  )
}
