import { useEffect, useMemo, useRef, useState } from 'react'
import logo from './assets/logo.png'
import { SearchBar } from './components/SearchBar'
import { SongList } from './components/SongList'
import { PlayerBar } from './components/PlayerBar'
import { SplashMonogram } from './components/SplashMonogram'
import { fetchPlaylist } from './lib/api'
import type { LoopMode, Song } from './types'

function App() {
  const [splashMounted, setSplashMounted] = useState(true)
  const [query, setQuery] = useState('')
  const [playlist, setPlaylist] = useState<Song[]>([])
  const [currentSong, setCurrentSong] = useState<Song | undefined>(undefined)
  const [isPlaying, setIsPlaying] = useState(false)
  const [loopMode, setLoopMode] = useState<LoopMode>('off')
  const [isShuffled, setIsShuffled] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [loadError, setLoadError] = useState<string | null>(null)
  const fetchedSongsRef = useRef<Song[]>([])
  // Mock duration until real audio metadata is wired up.
  const duration = 182

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
    setCurrentTime(0)
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
    setCurrentTime(0)
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

  if (splashMounted) {
    
    return (
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
    )
  }

  return (
    <div className={`flex min-h-svh flex-col  ${splashBackgroundColor} text-foreground`}>
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-4 px-4 py-4">
        <SearchBar value={query} onChange={setQuery} />
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
      </main>

      <PlayerBar
        currentSong={currentSong}
        isPlaying={isPlaying}
        loopMode={loopMode}
        isShuffled={isShuffled}
        currentTime={currentTime}
        duration={duration}
        onTogglePlay={() => setIsPlaying((playing) => !playing)}
        onPrevious={() => stepSong(-1)}
        onNext={() => stepSong(1)}
        onCycleLoop={handleCycleLoop}
        onToggleShuffle={handleToggleShuffle}
        onSeek={setCurrentTime}
      />
    </div>
  )
}

export default App
