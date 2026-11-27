import { useCallback, useEffect, useRef, useState } from 'react'
import type { Song } from '../types'

export interface AudioPlayer {
  /** Props to spread onto the app's single, always-mounted <audio> element. */
  audioProps: {
    ref: React.Ref<HTMLAudioElement>
    src: string | undefined
    preload: 'auto'
    onTimeUpdate: () => void
    onLoadedMetadata: () => void
    onDurationChange: () => void
    onPlay: () => void
    onPause: () => void
    onEnded: () => void
  }
  /** Direct ref to the audio element, for imperative control (e.g. loop-one restart). */
  audioRef: React.RefObject<HTMLAudioElement | null>
  currentTime: number
  duration: number
  /** Actual playback state reported by the audio element. */
  isPlaying: boolean
  seek: (time: number) => void
}

/**
 * Drives an <audio> element for the given song. Returns live
 * currentTime/duration for the progress bar and a seek() to scrub.
 * `onEnded` fires when a track finishes (loop/next handling lives in the caller).
 */
export function useAudioPlayer(
  song: Song | undefined,
  isPlaying: boolean,
  onEnded: () => void,
): AudioPlayer {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [playing, setPlaying] = useState(false)
  const onEndedRef = useRef(onEnded)
  onEndedRef.current = onEnded

  // Reset the progress state when the selected song changes.
  useEffect(() => {
    setCurrentTime(0)
    setDuration(0)
  }, [song?.songId, song?.src])

  // Play/pause in sync with the requested state.
  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !song?.src) return
    if (isPlaying) {
      audio.play().catch(() => setPlaying(false))
    } else {
      audio.pause()
    }
  }, [isPlaying, song?.src])

  const seek = useCallback((time: number) => {
    const audio = audioRef.current
    if (!audio || !Number.isFinite(time)) return
    audio.currentTime = time
    setCurrentTime(time)
  }, [])

  const audioProps = {
    ref: audioRef,
    src: song?.src,
    preload: 'auto' as const,
    onTimeUpdate: () => {
      const audio = audioRef.current
      if (audio) setCurrentTime(audio.currentTime)
    },
    onLoadedMetadata: () => {
      const audio = audioRef.current
      if (audio) setDuration(audio.duration)
    },
    onDurationChange: () => {
      const audio = audioRef.current
      if (audio) setDuration(audio.duration)
    },
    onPlay: () => setPlaying(true),
    onPause: () => setPlaying(false),
    onEnded: () => {
      setPlaying(false)
      onEndedRef.current()
    },
  }

  return { audioProps, audioRef, currentTime, duration, isPlaying: playing, seek }
}
