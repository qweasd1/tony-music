import { useRef, useState } from 'react'
import { Pause, Play } from 'lucide-react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import { Button } from '@/components/ui/button'
import './App.css'

function App() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [playbackError, setPlaybackError] = useState('')
  const audioRef = useRef<HTMLAudioElement>(null)

  async function togglePlayback() {
    const audio = audioRef.current
    if (!audio) return

    setPlaybackError('')
    if (isPlaying) {
      audio.pause()
      return
    }

    try {
      await audio.play()
    } catch {
      setPlaybackError('Unable to play this track. Please try again.')
    }
  }

  return (
    <>
      <section id="center">
        <div className="hero">
          <img src={heroImg} className="base" width="170" height="179" alt="" />
          <img src={reactLogo} className="framework" alt="React logo" />
          <img src={viteLogo} className="vite" alt="Vite logo" />
        </div>
        <div>
          <h1>当你孤单时你会想起谁</h1>
          <p>Listen to this track</p>
        </div>
        <Button
          type="button"
          onClick={togglePlayback}
          aria-label={isPlaying ? 'Pause track' : 'Play track'}
        >
          {isPlaying ? <Pause aria-hidden="true" /> : <Play aria-hidden="true" />}
          {isPlaying ? 'Pause' : 'Play'}
        </Button>
        <audio
          ref={audioRef}
          preload="none"
          src="https://github.com/qweasd1/tony-music/raw/refs/heads/master/data/songs/%E5%BD%93%E4%BD%A0%E5%AD%A4%E5%8D%95%E6%97%B6%E4%BD%A0%E4%BC%9A%E6%83%B3%E8%B5%B7%E8%B0%81.mp3"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => setIsPlaying(false)}
          onError={() =>
            setPlaybackError('Unable to load this track. Please try again.')
          }
        />
        {playbackError && (
          <p className="playback-error" role="alert">
            {playbackError}
          </p>
        )}
      </section>

      <div className="ticks"></div>

      <section id="next-steps">
        <div id="docs">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#documentation-icon"></use>
          </svg>
          <h2>Documentation</h2>
          <p>Your questions, answered</p>
          <ul>
            <li>
              <a href="https://vite.dev/" target="_blank">
                <img className="logo" src={viteLogo} alt="" />
                Explore Vite
              </a>
            </li>
            <li>
              <a href="https://react.dev/" target="_blank">
                <img className="button-icon" src={reactLogo} alt="" />
                Learn more
              </a>
            </li>
          </ul>
        </div>
        <div id="social">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#social-icon"></use>
          </svg>
          <h2>Connect with us</h2>
          <p>Join the Vite community</p>
          <ul>
            <li>
              <a href="https://github.com/vitejs/vite" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#github-icon"></use>
                </svg>
                GitHub
              </a>
            </li>
            <li>
              <a href="https://chat.vite.dev/" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#discord-icon"></use>
                </svg>
                Discord
              </a>
            </li>
            <li>
              <a href="https://x.com/vite_js" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#x-icon"></use>
                </svg>
                X.com
              </a>
            </li>
            <li>
              <a href="https://bsky.app/profile/vite.dev" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#bluesky-icon"></use>
                </svg>
                Bluesky
              </a>
            </li>
          </ul>
        </div>
      </section>

      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  )
}

export default App
