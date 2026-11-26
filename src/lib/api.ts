import type { Song } from '../types'

// GitHub's /raw/ URLs redirect with an invalid CORS header in browsers, so
// requests are rewritten to the equivalent raw.githubusercontent.com host,
// which serves the same content with `Access-Control-Allow-Origin: *`.
const BASE_URL = 'https://raw.githubusercontent.com/qweasd1/tony-music/refs/heads/master/data'

interface MetaSong {
  songId: string
  name: string
  tags: string[]
}

interface MetaResponse {
  songs: MetaSong[]
}

function songSrc(songId: string): string {
  return `${BASE_URL}/songs/${encodeURIComponent(songId)}.mp3`
}

/** Fetch the playlist metadata from the remote data directory. */
export async function fetchPlaylist(): Promise<Song[]> {
  const response = await fetch(`${BASE_URL}/meta.json`)
  if (!response.ok) {
    throw new Error(`Failed to fetch meta.json: ${response.status} ${response.statusText}`)
  }
  const meta = (await response.json()) as MetaResponse
  return meta.songs.map((song) => ({
    songId: song.songId,
    name: song.name,
    tags: song.tags ?? [],
    src: songSrc(song.songId),
  }))
}
