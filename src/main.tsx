import { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import FullScreenLoader from './portal/FullScreenLoader'

// Lazy so the marketing site never loads Firebase (and the portal bundle).
const PortalPage = lazy(() => import('./portal/PortalPage'))

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route
          path="/portal"
          element={
            <Suspense fallback={<FullScreenLoader />}>
              <PortalPage />
            </Suspense>
          }
        />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
