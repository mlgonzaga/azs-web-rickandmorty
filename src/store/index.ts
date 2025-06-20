import { configureStore, createSelector } from '@reduxjs/toolkit'
import {  useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux'
import { persistReducer, persistStore } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import episodeReducer from './slices/episodeSlice'
import pageReducer from './slices/pageSlice'
import { episodesApi } from './services/episodes-api'


const episodesPersistConfig = {
  key: 'episodes',
  storage,
  whitelist: ['episodeData', 'pagination'],
}


const persistedEpisodeReducer = persistReducer(episodesPersistConfig, episodeReducer)

export const store = configureStore({
  reducer: {
   
    episodes: persistedEpisodeReducer,
    page: pageReducer,
    [episodesApi.reducerPath]: episodesApi.reducer,

  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          'persist/PERSIST',
          'persist/REHYDRATE',
          'persist/PURGE',
        ],
      },
    }).concat(
      episodesApi.middleware
    ),
})
export const persistor = persistStore(store)
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelect: TypedUseSelectorHook<RootState> = useSelector

export function useAppSelector<T>(selector: (state: RootState) => T) {
  const memoizedSelector = createSelector((state: RootState) => state, selector)
  return useAppSelect(memoizedSelector)
}
