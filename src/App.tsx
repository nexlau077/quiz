import { lazy, Suspense, useCallback, useEffect } from 'react'
import { AudioProvider } from './audio/AudioProvider'
import { useAudio } from './audio/audioContext'
import { useReducedMotionPref } from './hooks/useReducedMotionPref'
import { useStoryMachine } from './state/useStoryMachine'
import { StoryStage } from './components/ui/StoryStage'
import { SkipIntro } from './components/ui/SkipIntro'
import { DarkScene } from './scenes/DarkScene'

const PartyScene = lazy(() =>
  import('./scenes/PartyScene').then((m) => ({ default: m.PartyScene })),
)

function StoryExperience() {
  const reduced = useReducedMotionPref()
  const machine = useStoryMachine(reduced)
  const audio = useAudio()
  const { phase, flipped } = machine

  const lit = phase === 'IGNITE' || phase === 'PARTY' || phase === 'LETTER'
  const showDark = phase !== 'PARTY' && phase !== 'LETTER'
  const showParty = phase === 'IGNITE' || phase === 'PARTY' || phase === 'LETTER'
  const inIntro = !lit

  // Audio unlocks here — synchronous, inside the flip gesture (iOS-safe).
  const handleFlip = useCallback(() => {
    audio.unlock()
    audio.playSfx('switch')
    machine.flip()
  }, [audio, machine])

  // Skipping the intro jumps past the switch, so it must unlock audio itself —
  // inside this click gesture — or the music never starts on the skip path.
  const handleSkip = useCallback(() => {
    audio.unlock()
    machine.skip()
  }, [audio, machine])

  // Reflect the lit room to the browser chrome.
  useEffect(() => {
    const meta = document.querySelector('meta[name="theme-color"]')
    if (meta) meta.setAttribute('content', lit ? '#f6ead2' : '#14110f')
  }, [lit])

  return (
    <StoryStage lit={lit}>
      {showDark && (
        <DarkScene
          phase={phase}
          flipped={flipped}
          reduced={reduced}
          advance={machine.advance}
          onFlip={handleFlip}
        />
      )}

      {showParty && (
        <Suspense fallback={null}>
          <PartyScene
            phase={phase}
            reduced={reduced}
            openLetter={machine.openLetter}
            closeLetter={machine.closeLetter}
          />
        </Suspense>
      )}

      {inIntro && <SkipIntro onSkip={handleSkip} />}
    </StoryStage>
  )
}

export default function App() {
  return (
    <AudioProvider>
      <StoryExperience />
    </AudioProvider>
  )
}
