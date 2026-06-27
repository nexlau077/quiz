import { useAudio } from '../../audio/audioContext'
import './MuteToggle.css'

/** Floating sound on/off control (persisted). */
export function MuteToggle() {
  const { muted, toggleMuted } = useAudio()
  return (
    <button
      type="button"
      className="mute-toggle"
      onClick={toggleMuted}
      aria-label={muted ? 'Sound on' : 'Sound off'}
      aria-pressed={!muted}
      title="Sound on/off"
    >
      <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
        <path
          d="M4 9v6h4l5 4V5L8 9H4z"
          fill="currentColor"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
        {muted ? (
          <path
            d="M16 9l5 6M21 9l-5 6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        ) : (
          <path
            d="M16.5 8.5a5 5 0 0 1 0 7M18.8 6.2a8 8 0 0 1 0 11.6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        )}
      </svg>
    </button>
  )
}
