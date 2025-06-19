import { configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { type TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import episodeSlice from './slices/episodeSlice'
import { episodesApi } from './services/episodes-api'

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['episodes'],
  blacklist: ['searchTerm'],
}

const persistedEpisodeReducer = persistReducer(persistConfig, episodeSlice)

export const store = configureStore({
  reducer: {
    episodes: persistedEpisodeReducer,
    [episodesApi.reducerPath]: episodesApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }).concat(episodesApi.middleware),
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
