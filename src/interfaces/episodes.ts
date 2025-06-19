export interface Character {
  id: string
  name: string
  status: string
  species: string
  image: string
}

export interface Episode {
  id: string
  name: string
  air_date: string
  episode: string
  characters: Character[]
  favorite?: boolean
  watched?: boolean
}

export interface EpisodesResponse {
  episodes: {
    info: {
      count: number
      pages: number
      next: number | null
      prev: number | null
    }
    results: Episode[]
  }
}

export interface EpisodeResponse {
  episode: Episode
} 