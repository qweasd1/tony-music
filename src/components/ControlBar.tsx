import {
  Pause,
  Play,
  Repeat,
  Repeat1,
  RotateCcw,
  RotateCw,
  Shuffle,
  SkipBack,
  SkipForward,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { LoopMode } from '../types'

interface ControlBarProps {
  isPlaying: boolean
  loopMode: LoopMode
  isShuffled: boolean
  onTogglePlay: () => void
  onPrevious: () => void
  onNext: () => void
  onCycleLoop: () => void
  onToggleShuffle: () => void
  onSeekBy: (deltaSeconds: number) => void
}

export function ControlBar({
  isPlaying,
  loopMode,
  isShuffled,
  onTogglePlay,
  onPrevious,
  onNext,
  onCycleLoop,
  onToggleShuffle,
  onSeekBy,
}: ControlBarProps) {
  const LoopIcon = loopMode === 'one' ? Repeat1 : Repeat

  return (
    <div className="flex items-center justify-center gap-1">
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggleShuffle}
        aria-label="Shuffle playlist"
        aria-pressed={isShuffled}
        className={cn(isShuffled && 'text-primary')}
      >
        <Shuffle aria-hidden="true" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={onPrevious}
        aria-label="Previous song"
      >
        <SkipBack aria-hidden="true" className="size-5 fill-current" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => onSeekBy(-5)}
        aria-label="Back 5 seconds"
        className="relative"
      >
        <RotateCcw aria-hidden="true" />
        <span className="absolute text-[9px] font-semibold">5</span>
      </Button>

      <Button
        variant="default"
        size="icon-lg"
        onClick={onTogglePlay}
        aria-label={isPlaying ? 'Pause' : 'Play'}
        className="size-11 rounded-full"
      >
        {isPlaying ? (
          <Pause aria-hidden="true" className="size-5 fill-current" />
        ) : (
          <Play aria-hidden="true" className="size-5 fill-current" />
        )}
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => onSeekBy(5)}
        aria-label="Forward 5 seconds"
        className="relative"
      >
        <RotateCw aria-hidden="true" />
        <span className="absolute text-[9px] font-semibold">5</span>
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={onNext}
        aria-label="Next song"
      >
        <SkipForward aria-hidden="true" className="size-5 fill-current" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={onCycleLoop}
        aria-label={`Loop: ${loopMode === 'off' ? 'off' : loopMode === 'all' ? 'playlist' : 'one song'}`}
        aria-pressed={loopMode !== 'off'}
        className={cn(loopMode !== 'off' && 'text-primary')}
      >
        <LoopIcon aria-hidden="true" />
      </Button>
    </div>
  )
}
