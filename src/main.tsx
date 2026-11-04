import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ErrorBoundary } from './components/ErrorBoundary.tsx'
import { LanguageProvider } from './context/LanguageContext.tsx'
import { SEOSettingsProvider } from './context/SEOSettingsContext.tsx'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <LanguageProvider>
        <SEOSettingsProvider>
          <ErrorBoundary>
            <App />
          </ErrorBoundary>
        </SEOSettingsProvider>
      </LanguageProvider>
    </BrowserRouter>
  </StrictMode>,
)
