import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ErrorBoundary } from './components/ErrorBoundary.tsx'
import { AuthProvider } from './context/AuthContext'
import { EmployeeProvider } from './context/EmployeeContext'
import { ProjectProvider } from './context/ProjectContext'
import { ServiceProvider } from './context/ServiceContext'
import { CategoryProvider } from './context/CategoryContext'
import { ArticleProvider } from './context/ArticleContext'
import { LanguageProvider } from './context/LanguageContext.tsx'
import { SEOSettingsProvider } from './context/SEOSettingsContext.tsx'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <LanguageProvider>
        <SEOSettingsProvider>
          <AuthProvider>
            <EmployeeProvider>
              <ProjectProvider>
                <ServiceProvider>
                  <CategoryProvider>
                    <ArticleProvider>
                      <ErrorBoundary>
                        <App />
                      </ErrorBoundary>
                    </ArticleProvider>
                  </CategoryProvider>
                </ServiceProvider>
              </ProjectProvider>
            </EmployeeProvider>
          </AuthProvider>
        </SEOSettingsProvider>
      </LanguageProvider>
    </BrowserRouter>
  </StrictMode>,
)
