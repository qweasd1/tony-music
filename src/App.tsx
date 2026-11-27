import { useEffect, useMemo, useRef, useState } from 'react'
import logo from './assets/logo.png'
import { SearchBar } from './components/SearchBar'
import { SongList } from './components/SongList'
import { PlayerBar } from './components/PlayerBar'
import { SplashMonogram } from './components/SplashMonogram'
import { fetchPlaylist } from './lib/api'
import { useAudioPlayer } from './lib/useAudioPlayer'
import type { LoopMode, Song } from './types'

function App() {
  const [splashMounted, setSplashMounted] = useState(true)
  const [query, setQuery] = useState('')
  const [playlist, setPlaylist] = useState<Song[]>([])
  const [currentSong, setCurrentSong] = useState<Song | undefined>(undefined)
  const [isPlaying, setIsPlaying] = useState(false)
  const [loopMode, setLoopMode] = useState<LoopMode>('off')
  const [isShuffled, setIsShuffled] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)
  const fetchedSongsRef = useRef<Song[]>([])
  const loopModeRef = useRef<LoopMode>(loopMode)
  loopModeRef.current = loopMode
  const playlistRef = useRef<Song[]>(playlist)
  playlistRef.current = playlist
  const currentSongRef = useRef<Song | undefined>(currentSong)
  currentSongRef.current = currentSong

  function handleTrackEnded() {
    const mode = loopModeRef.current
    if (mode === 'one') {
      const audio = player.audioRef.current
      if (audio) {
        audio.currentTime = 0
        audio.play().catch(() => setIsPlaying(false))
      }
      return
    }
    const list = playlistRef.current
    if (list.length === 0) return
    const current = currentSongRef.current
    const index = list.findIndex((s) => s.songId === current?.songId)
    // Always advance, wrapping from the last song back to the first.
    const next = list[(index + 1 + list.length) % list.length]
    setCurrentSong(next)
    setIsPlaying(true)
  }

  const player = useAudioPlayer(currentSong, isPlaying, handleTrackEnded)

  // Load the playlist from the remote meta.json when the app starts.
  useEffect(() => {
    let cancelled = false
    fetchPlaylist()
      .then((songs) => {
        if (cancelled) return
        fetchedSongsRef.current = songs
        setPlaylist(songs)
        setCurrentSong((song) => song ?? songs[0])
      })
      .catch((error: unknown) => {
        if (cancelled) return
        setLoadError(error instanceof Error ? error.message : 'Failed to load playlist')
      })
    return () => {
      cancelled = true
    }
  }, [])

  const visibleSongs = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return playlist
    return playlist.filter(
      (song) =>
        song.name.toLowerCase().includes(q) ||
        song.tags.some((tag) => tag.toLowerCase().includes(q)),
    )
  }, [playlist, query])

  function selectSong(song: Song) {
    if (song.songId === currentSong?.songId) {
      setIsPlaying((playing) => !playing)
      return
    }
    setCurrentSong(song)
    setIsPlaying(true)
  }

  function stepSong(direction: 1 | -1) {
    if (playlist.length === 0) return
    const index = playlist.findIndex((s) => s.songId === currentSong?.songId)
    const next =
      playlist[
        (index + direction + playlist.length) % playlist.length
      ]
    setCurrentSong(next)
  }

  function shufflePlaylist() {
    setPlaylist((current) => {
      const shuffled = [...current]
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
      }
      return shuffled
    })
  }

  function handleToggleShuffle() {
    setIsShuffled((value) => {
      const next = !value
      if (next) shufflePlaylist()
      else setPlaylist(fetchedSongsRef.current)
      return next
    })
  }

  function handleCycleLoop() {
    setLoopMode((mode) => (mode === 'off' ? 'all' : mode === 'all' ? 'one' : 'off'))
  }

  const splashBackgroundColor = splashMounted ? "bg-[#5a0f84]" : ""

  return (
    <>
      {/* Single always-mounted audio element; src/events handled by useAudioPlayer. */}
      <audio {...player.audioProps} className="hidden" />
      {splashMounted ? (
        <div
          className={`fixed inset-0 flex flex-col items-center justify-center gap-8  ${splashBackgroundColor}`}
        >
          <SplashMonogram />
          <img
            src={logo}
            alt="王八音盒"
            className="relative z-10 w-2/3 rounded-2xl shadow-2xl"
          />
          <button
            type="button"
            onClick={() => {
              setSplashMounted(false)
            }}
            className="relative z-10 rounded-full bg-white/15 px-8 py-3 text-base font-semibold text-white backdrop-blur transition-colors hover:bg-white/25 active:bg-white/30"
          >
            让老王唱起来
          </button>
        </div>
      ) : (
        <div className={`flex h-svh flex-col overflow-hidden ${splashBackgroundColor} text-foreground`}>
          <main className="mx-auto flex min-h-0 w-full max-w-3xl flex-1 flex-col gap-4 px-4 py-4">
            <SearchBar value={query} onChange={setQuery} />
            <div className="min-h-0 flex-1 overflow-y-auto">
              {loadError ? (
                <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  Could not load playlist: {loadError}
                </div>
              ) : playlist.length === 0 ? (
                <div className="py-12 text-center text-sm text-muted-foreground">
                  Loading playlist…
                </div>
              ) : (
                <SongList
                  songs={visibleSongs}
                  currentSongId={currentSong?.songId}
                  isPlaying={isPlaying}
                  onSelect={selectSong}
                />
              )}
            </div>
          </main>

          <PlayerBar
            currentSong={currentSong}
            isPlaying={isPlaying}
            loopMode={loopMode}
            isShuffled={isShuffled}
            currentTime={player.currentTime}
            duration={player.duration}
            onTogglePlay={() => setIsPlaying((playing) => !playing)}
            onPrevious={() => stepSong(-1)}
            onNext={() => stepSong(1)}
            onCycleLoop={handleCycleLoop}
            onToggleShuffle={handleToggleShuffle}
            onSeek={player.seek}
          />
        </div>
      )}
    </>
  )
}

export default App
