
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Provider } from 'react-redux'
import { store, persistor } from './store/index.ts'
import { PersistGate } from 'redux-persist/integration/react'
import { Toaster } from "@/components/ui/sonner"

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={<div>Carregando...</div>} persistor={persistor}>
        <App />
        <Toaster position='bottom-left' richColors theme='light' />
      </PersistGate>
    </Provider>
  </StrictMode>
)
