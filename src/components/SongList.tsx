import { ListMusic, Play } from 'lucide-react'
import type { Song } from '../types'
import { cn } from '@/lib/utils'

interface SongListProps {
  songs: Song[]
  currentSongId?: string
  isPlaying: boolean
  onSelect: (song: Song) => void
}

export function SongList({
  songs,
  currentSongId,
  isPlaying,
  onSelect,
}: SongListProps) {
  if (songs.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-12 text-muted-foreground">
        <ListMusic className="size-8" />
        <p className="text-sm">No songs found</p>
      </div>
    )
  }

  return (
    <ul className="flex flex-col gap-1" aria-label="Song list">
      {songs.map((song, index) => {
        const isCurrent = song.songId === currentSongId
        return (
          <li key={song.songId}>
            <button
              type="button"
              onClick={() => onSelect(song)}
              aria-current={isCurrent ? 'true' : undefined}
              className={cn(
                'group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-muted',
                isCurrent && 'bg-muted',
              )}
            >
              <span className="flex size-8 shrink-0 items-center justify-center">
                {isCurrent ? (
                  <PlayingIndicator playing={isPlaying} />
                ) : (
                  <>
                    <span className="text-sm text-muted-foreground group-hover:hidden">
                      {index + 1}
                    </span>
                    <Play
                      className="hidden size-4 fill-current text-foreground group-hover:block"
                      aria-hidden="true"
                    />
                  </>
                )}
              </span>
              <span className="min-w-0 flex-1">
                <span
                  className={cn(
                    'block truncate text-sm font-medium',
                    isCurrent ? 'text-primary' : 'text-foreground',
                  )}
                >
                  {song.name}
                </span>
                <span className="block truncate text-xs text-muted-foreground">
                  {song.tags.join(' · ')}
                </span>
              </span>
            </button>
          </li>
        )
      })}
    </ul>
  )
}

function PlayingIndicator({ playing }: { playing: boolean }) {
  return (
    <span
      className="flex h-4 items-end gap-0.5"
      role="img"
      aria-label={playing ? 'Now playing' : 'Paused'}
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className={cn(
            'w-0.5 rounded-sm bg-primary',
            playing ? 'animate-pulse' : 'h-1',
            playing && ['h-2', 'h-4', 'h-3'][i],
          )}
          style={playing ? { animationDelay: `${i * 150}ms` } : undefined}
        />
      ))}
    </span>
  )
}
