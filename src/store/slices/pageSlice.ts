import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

interface PageState {
  currentPage: number
}

const getInitialPage = (): number => {
  // Tenta pegar da URL
  const params = new URLSearchParams(window.location.search)
  const urlPage = params.get('page')
  if (urlPage && !isNaN(Number(urlPage))) {
    localStorage.setItem('currentPage', urlPage)
    return Number(urlPage)
  }
  // Tenta pegar do localStorage
  const stored = localStorage.getItem('currentPage')
  if (stored && !isNaN(Number(stored))) {
    return Number(stored)
  }
  // Default para 1
  localStorage.setItem('currentPage', '1')
  return 1
}

const initialState: PageState = {
  currentPage: getInitialPage(),
}

const pageSlice = createSlice({
  name: 'page',
  initialState,
  reducers: {
    setCurrentPage(state, action: PayloadAction<number>) {
      state.currentPage = action.payload
      localStorage.setItem('currentPage', String(action.payload))
    },
  },
})

export const { setCurrentPage } = pageSlice.actions
export default pageSlice.reducer 