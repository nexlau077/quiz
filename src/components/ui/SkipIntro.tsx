import './SkipIntro.css'

/** Lets returning/impatient visitors jump straight to the party. */
export function SkipIntro({ onSkip }: { onSkip: () => void }) {
  return (
    <button type="button" className="skip-intro" onClick={onSkip}>
      Skip&nbsp;›
    </button>
  )
}
