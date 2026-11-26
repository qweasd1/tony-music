export interface Song {
  songId: string
  name: string
  tags: string[]
  src?: string
}

export type LoopMode = 'off' | 'all' | 'one'
