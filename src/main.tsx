import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import RegistrationScreen from './portal/RegistrationScreen'
import TeamPortalScreen from './portal/TeamPortalScreen'
import PortalPreview from './portal/PortalPreview'
import { mockTeam } from './portal/mockData'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        {/* PHASE 1 preview routes (no auth). Replaced by a single self-guarding
            /portal → <PortalPage/> in Phase 2. */}
        <Route path="/portal" element={<PortalPreview />} />
        <Route path="/portal/register" element={<RegistrationScreen />} />
        <Route path="/portal/team" element={<TeamPortalScreen team={mockTeam} />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
