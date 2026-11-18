import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './utils/AppContext.jsx';
import Sidebar from './components/Sidebar.jsx';
import ToastContainer from './components/ToastContainer.jsx';
import CommandCenter from './pages/CommandCenter.jsx';
import DisasterRisk from './pages/DisasterRisk.jsx';
import EmergencyIntelligence from './pages/EmergencyIntelligence.jsx';
import RecoveryResilience from './pages/RecoveryResilience.jsx';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'var(--bg-base)' }}>
          <Sidebar />
          <main style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <Routes>
              <Route path="/" element={<CommandCenter />} />
              <Route path="/risk" element={<DisasterRisk />} />
              <Route path="/emergency" element={<EmergencyIntelligence />} />
              <Route path="/recovery" element={<RecoveryResilience />} />
            </Routes>
          </main>
        </div>
        <ToastContainer />
      </BrowserRouter>
    </AppProvider>
  );
}

