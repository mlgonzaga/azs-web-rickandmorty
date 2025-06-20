import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { Episode } from '@/interfaces/episodes'

interface PaginationState {
  currentPage: number
  totalPages: number
  totalEpisodes: number
  hasNextPage: boolean
  hasPrevPage: boolean
  loadedPages: Record<number, string[]>
}

interface EpisodesState {
  episodeData: Record<string, Episode>
  currentPageEpisodes: Episode[]
  loading: boolean
  error: string | null
  pagination: PaginationState
  showFavorites: boolean
  showWatched: boolean
}

const initialState: EpisodesState = {
  episodeData: {},
  currentPageEpisodes: [],
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalEpisodes: 0,
    hasNextPage: false,
    hasPrevPage: false,
    loadedPages: {},
  },
  showFavorites: false,
  showWatched: false,
}

const episodeSlice = createSlice({
  name: 'episodes',
  initialState,
  reducers: {
    /**
     * Salva/adiciona episódios de uma página no estado
     */
    setPageEpisodes(state, action: PayloadAction<{ episodes: Episode[]; info: any; page: number }>) {
      const { episodes, info, page } = action.payload
      // Atualiza dados dos episódios, preservando favorite e watched
      episodes.forEach((ep: Episode) => {
        const prev = state.episodeData[String(ep.id)] as Partial<Episode> || {};
        state.episodeData[String(ep.id)] = {
          ...ep,
          favorite: prev.favorite ?? false,
          watched: prev.watched ?? false,
        }
      })
      // Atualiza lista de IDs da página
      const ids = episodes.map((ep: Episode) => String(ep.id))
      state.pagination.loadedPages[page] = ids
      state.currentPageEpisodes = episodes.map((ep: Episode) => {
        const prev = state.episodeData[String(ep.id)] as Partial<Episode> || {};
        return {
          ...ep,
          favorite: prev.favorite ?? false,
          watched: prev.watched ?? false,
        }
      })
      // Atualiza info de paginação
      state.pagination.totalPages = info.pages
      state.pagination.totalEpisodes = info.count
      state.pagination.hasNextPage = !!info.next
      state.pagination.hasPrevPage = !!info.prev
    },
    /**
     * Atualiza informações de um episódio já existente (favorito, assistido, etc)
     */
    updateEpisode(state, action: PayloadAction<Partial<Episode> & { id: string }>) {
      const id = String(action.payload.id)
      const prev = state.episodeData[id]
      if (!prev) return // não atualiza se não existe
      // Atualiza apenas os campos de favorito/assistido, mantendo os obrigatórios
      state.episodeData[id] = {
        id: prev.id,
        name: prev.name,
        air_date: prev.air_date,
        episode: prev.episode,
        characters: prev.characters,
        favorite: action.payload.favorite !== undefined ? action.payload.favorite : prev.favorite,
        watched: action.payload.watched !== undefined ? action.payload.watched : prev.watched,
      }
      // Atualiza lista da página atual se necessário
      const idx = state.currentPageEpisodes.findIndex(ep => String(ep.id) === id)
      if (idx !== -1) {
        state.currentPageEpisodes[idx] = {
          id: prev.id,
          name: prev.name,
          air_date: prev.air_date,
          episode: prev.episode,
          characters: prev.characters,
          favorite: action.payload.favorite !== undefined ? action.payload.favorite : prev.favorite,
          watched: action.payload.watched !== undefined ? action.payload.watched : prev.watched,
        }
      }
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload
    },
    setShowFavorites(state, action: PayloadAction<boolean>) {
      state.showFavorites = action.payload
    },
    setShowWatched(state, action: PayloadAction<boolean>) {
      state.showWatched = action.payload
    },
    initializePage(state) {
      // Apenas reseta os episódios da página atual
      state.currentPageEpisodes = []
    },
  },
})

export const {
  setLoading,
  setError,
  setPageEpisodes,
  updateEpisode,
  setShowFavorites,
  setShowWatched,
  initializePage,
} = episodeSlice.actions

export default episodeSlice.reducer
