import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ErrorBoundary } from './components/ErrorBoundary.tsx'
import { LanguageProvider } from './context/LanguageContext.tsx'
import { SEOSettingsProvider } from './context/SEOSettingsContext.tsx'
import { useSEOSettings } from './context/SEOSettingsContext.tsx'
import { usePageTracking } from './lib/AnalyticsManager.tsx'
import { useSearchConsoleVerification } from './lib/SearchConsoleManager.ts'
import './index.css'
import App from './App.tsx'

// Analytics & Search Console wrapper component
const SEOWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { settings } = useSEOSettings();

  // GA4 page tracking
  usePageTracking(settings.ga4MeasurementId, settings.ga4Enabled);

  // Search Console verification
  useSearchConsoleVerification(
    settings.searchConsoleCode,
    settings.searchConsoleMethod,
    settings.searchConsoleEnabled
  );

  return <>{children}</>;
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <LanguageProvider>
        <SEOSettingsProvider>
          <SEOWrapper>
            <ErrorBoundary>
              <App />
            </ErrorBoundary>
          </SEOWrapper>
        </SEOSettingsProvider>
      </LanguageProvider>
    </BrowserRouter>
  </StrictMode>,
)