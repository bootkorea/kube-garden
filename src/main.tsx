import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AudioProvider } from './components/AudioContext'
import { LanguageProvider } from './components/LanguageContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LanguageProvider>
      <AudioProvider>
        <App />
      </AudioProvider>
    </LanguageProvider>
  </StrictMode>,
)