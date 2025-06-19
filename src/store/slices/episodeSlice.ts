import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { Episode } from '@/interfaces/episodes'

interface PaginationState {
  currentPage: number
  totalPages: number
  totalEpisodes: number
  hasNextPage: boolean
  hasPrevPage: boolean
  loadedPages: Record<number, string[]> // page -> array of episode IDs (string)
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
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload
    },
    setCurrentPage(state, action: PayloadAction<number>) {
      state.pagination.currentPage = action.payload
      // Ao mudar de página, limpa os episódios da página atual
      state.currentPageEpisodes = []
    },
    setPageEpisodes(state, action: PayloadAction<{ episodes: Episode[]; info: any; page: number }>) {
      const { episodes, info, page } = action.payload
      // Atualiza dados dos episódios
      episodes.forEach((ep: Episode) => {
        state.episodeData[String(ep.id)] = ep
      })
      // Atualiza lista de IDs da página
      const ids = episodes.map((ep: Episode) => String(ep.id))
      state.pagination.loadedPages[page] = ids
      state.currentPageEpisodes = episodes
      // Atualiza info de paginação
      state.pagination.totalPages = info.pages
      state.pagination.totalEpisodes = info.count
      state.pagination.hasNextPage = !!info.next
      state.pagination.hasPrevPage = !!info.prev
    },
    initializePage(state) {
      // Apenas reseta os episódios da página atual
      state.currentPageEpisodes = []
    },
    setShowFavorites(state, action: PayloadAction<boolean>) {
      state.showFavorites = action.payload
    },
    setShowWatched(state, action: PayloadAction<boolean>) {
      state.showWatched = action.payload
    },
    // Atualização de episódio (favorito/assistido)
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
  },
})

export const {
  setLoading,
  setError,
  setCurrentPage,
  setPageEpisodes,
  initializePage,
  setShowFavorites,
  setShowWatched,
  updateEpisode,
} = episodeSlice.actions
export default episodeSlice.reducer
