import { useMemo, useState } from 'react'
import logo from './assets/logo.png'
import { SearchBar } from './components/SearchBar'
import { SongList } from './components/SongList'
import { PlayerBar } from './components/PlayerBar'
import { SplashMonogram } from './components/SplashMonogram'
import { songs } from './data/songs'
import type { LoopMode, Song } from './types'

function App() {
  const [splashFading, setSplashFading] = useState(false)
  const [splashMounted, setSplashMounted] = useState(true)
  const [query, setQuery] = useState('')
  const [playlist, setPlaylist] = useState<Song[]>(songs)
  const [currentSong, setCurrentSong] = useState<Song | undefined>(songs[0])
  const [isPlaying, setIsPlaying] = useState(false)
  const [loopMode, setLoopMode] = useState<LoopMode>('off')
  const [isShuffled, setIsShuffled] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  // Mock duration until real audio metadata is wired up.
  const duration = 182

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
      else setPlaylist(songs)
      return next
    })
  }

  function handleCycleLoop() {
    setLoopMode((mode) => (mode === 'off' ? 'all' : mode === 'all' ? 'one' : 'off'))
  }


  if (splashMounted) {
    const splashBackgroundColor = splashMounted ? "from-[#5a0f84] via-[#571080] to-[#521a74]" : ""
    return (
      <div
        className={`fixed inset-0 flex flex-col items-center justify-center gap-8 overflow-hidden bg-gradient-to-b ${splashBackgroundColor} transition-opacity duration-500 ease-out ${
          splashFading ? 'pointer-events-none opacity-0' : 'opacity-100'
        }`}
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
            setSplashFading(true)
            setTimeout(() => setSplashMounted(false), 500)
          }}
          className="relative z-10 rounded-full bg-white/15 px-8 py-3 text-base font-semibold text-white backdrop-blur transition-colors hover:bg-white/25 active:bg-white/30"
        >
          让老王唱起来
        </button>
      </div>
    )
  }

  return (
    <div className="flex min-h-svh flex-col bg-background text-foreground">
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-4 px-4 py-4">
        <SearchBar value={query} onChange={setQuery} />
        <SongList
          songs={visibleSongs}
          currentSongId={currentSong?.songId}
          isPlaying={isPlaying}
          onSelect={selectSong}
        />
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
