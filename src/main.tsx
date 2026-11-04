import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ErrorBoundary } from './components/ErrorBoundary.tsx'
import { LanguageProvider } from './context/LanguageContext.tsx'
import { SEOSettingsProvider } from './context/SEOSettingsContext.tsx'
import './index.css'
import App from './App.tsx'

// Simplified initialization - SEO settings will be handled via Context effects
// Remove problematic SEOWrapper that causes React hooks error

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
