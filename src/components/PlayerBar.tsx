import { Music2 } from 'lucide-react'
import { ControlBar } from './ControlBar'
import { ProgressBar } from './ProgressBar'
import type { LoopMode, Song } from '../types'

interface PlayerBarProps {
  currentSong?: Song
  isPlaying: boolean
  loopMode: LoopMode
  isShuffled: boolean
  currentTime: number
  duration: number
  onTogglePlay: () => void
  onPrevious: () => void
  onNext: () => void
  onCycleLoop: () => void
  onToggleShuffle: () => void
  onSeek?: (time: number) => void
}

export function PlayerBar({
  currentSong,
  isPlaying,
  loopMode,
  isShuffled,
  currentTime,
  duration,
  onTogglePlay,
  onPrevious,
  onNext,
  onCycleLoop,
  onToggleShuffle,
  onSeek,
}: PlayerBarProps) {
  return (
    <div className="border-t border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-3 px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-muted">
            <Music2 className="size-5 text-muted-foreground" aria-hidden="true" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-foreground">
              {currentSong?.name ?? 'Nothing playing'}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {currentSong ? currentSong.tags.join(' · ') : 'Pick a song to start'}
            </p>
          </div>
        </div>

        <ProgressBar
          currentTime={currentTime}
          duration={duration}
          onSeek={onSeek}
        />

        <ControlBar
          isPlaying={isPlaying}
          loopMode={loopMode}
          isShuffled={isShuffled}
          onTogglePlay={onTogglePlay}
          onPrevious={onPrevious}
          onNext={onNext}
          onCycleLoop={onCycleLoop}
          onToggleShuffle={onToggleShuffle}
        />
      </div>
    </div>
  )
}
