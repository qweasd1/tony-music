import { Music, Music2, Music3, Music4 } from 'lucide-react'

const ICONS = [Music, Music2, Music3, Music4]

// LV-monogram style: a dense, tilted grid of music icons drifting downward
// forever, with each note gently swaying on its own.
const COLS = 8
const ROWS = 12

// Deterministic pseudo-random in [0, 1) so both pattern blocks are identical
// (required for a seamless infinite loop). One step of mulberry32.
function rand(seed: number) {
  const a = (seed + 0x6d2b79f5) | 0
  let t = Math.imul(a ^ (a >>> 15), 1 | a)
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}

function PatternBlock() {
  const cells = Array.from({ length: COLS * ROWS }, (_, i) => {
    const row = Math.floor(i / COLS)
    const col = i % COLS
    const Icon = ICONS[(row * COLS + col) % ICONS.length]
    const opacity = 0.1 + (((row + col) % 3) * 0.06)
    const size = 16 + ((row + col) % 3) * 6
    const swayX = (rand(i * 7 + 1) - 0.5) * 10
    const swayY = (rand(i * 7 + 2) - 0.5) * 7
    const swayR = (rand(i * 7 + 3) - 0.5) * 6
    const swayDur = 4 + rand(i * 7 + 4) * 4
    const swayDelay = -rand(i * 7 + 5) * 8
    return (
      <div
        key={i}
        className="flex items-center justify-center"
        style={{ transform: 'rotate(-14deg)', opacity }}
      >
        <div
          className="splash-note"
          style={
            {
              '--sway-x': `${swayX.toFixed(1)}px`,
              '--sway-y': `${swayY.toFixed(1)}px`,
              '--sway-r': `${swayR.toFixed(1)}deg`,
              animationDuration: `${swayDur.toFixed(2)}s`,
              animationDelay: `${swayDelay.toFixed(2)}s`,
            } as React.CSSProperties
          }
        >
          <Icon style={{ width: size, height: size }} strokeWidth={1.5} />
        </div>
      </div>
    )
  })

  return (
    <div
      className="grid h-1/2 w-full shrink-0"
      style={{
        gridTemplateColumns: `repeat(${COLS}, 1fr)`,
        gridTemplateRows: `repeat(${ROWS}, 1fr)`,
        color: 'white',
      }}
    >
      {cells}
    </div>
  )
}

export function SplashMonogram() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {/* Wrapper is 200% tall with two identical blocks (one screen each).
          It drifts from translateY(-50%) to translateY(0): the screen is fully
          covered at every moment, and the loop restarts pixel-identically,
          giving an infinite seamless downward drift. */}
      <div className="splash-monogram-scroll flex h-[200%] w-full flex-col">
        <PatternBlock />
        <PatternBlock />
      </div>
    </div>
  )
}
