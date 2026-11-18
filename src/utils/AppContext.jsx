import React, { createContext, useContext, useState, useCallback } from 'react';
import {
  incidents as initialIncidents,
  responders as initialResponders,
  communityReports as initialCommunityReports,
  recoveryZones as initialRecoveryZones,
  resourceStatus as initialResourceStatus,
  situationSummary as initialSituationSummary,
  hazardZones as initialHazardZones,
} from '../data/mockData.js';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [incidents, setIncidents] = useState(initialIncidents);
  const [responders, setResponders] = useState(initialResponders);
  const [communityReports, setCommunityReports] = useState(initialCommunityReports);
  const [recoveryZones, setRecoveryZones] = useState(initialRecoveryZones);
  const [resourceStatus, setResourceStatus] = useState(initialResourceStatus);
  const [hazardZones, setHazardZones] = useState(initialHazardZones);
  const [situationSummary, setSituationSummary] = useState(initialSituationSummary);
  const [toasts, setToasts] = useState([]);
  const [simulationState, setSimulationState] = useState({
    active: false,
    step: 0,
    statusText: '',
    completed: false,
  });

  const addToast = useCallback((msg, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 4200);
  }, []);

  const dispatchResponder = useCallback((incidentId, customResponderId = null) => {
    // Find candidate responder
    const candidate = customResponderId
      ? responders.find(r => r.id === customResponderId && r.status === 'available')
      : responders.find(r => r.status === 'available');

    if (!candidate) {
      addToast('No available responders at this time.', 'error');
      return false;
    }

    setResponders(prev => prev.map(r =>
      r.id === candidate.id
        ? { ...r, status: 'deployed', deployedTo: incidentId, eta: '—' }
        : r
    ));

    setIncidents(prev => prev.map(inc =>
      inc.id === incidentId
        ? {
          ...inc,
          status: 'responding',
          nearbyResponders: Math.max(0, inc.nearbyResponders - 1),
        }
        : inc
    ));

    addToast(`⚡ ${candidate.name} dispatched to ${incidentId.startsWith('inc-') ? 'incident' : incidentId}.`, 'success');
    return true;
  }, [responders, addToast]);

  const submitCommunityReport = useCallback((newReport) => {
    const reportWithId = {
      ...newReport,
      id: `cr-${Date.now()}`,
      timeAgo: 'Just now',
      verified: true,
    };

    setCommunityReports(prev => [reportWithId, ...prev]);

    // If report targets an incident, bump count
    if (reportWithId.incidentId) {
      setIncidents(prev => prev.map(inc =>
        inc.id === reportWithId.incidentId
          ? { ...inc, communityReports: inc.communityReports + 1 }
          : inc
      ));
    }

    addToast(`Community report submitted & AI prioritized: ${reportWithId.aiClass.toUpperCase()}`, 'success');
    return reportWithId;
  }, [addToast]);

  const allocateResource = useCallback((resourceId, zoneName) => {
    setResourceStatus(prev => prev.map(r => {
      if (r.id === resourceId && r.available > 0) {
        return { ...r, available: r.available - 1 };
      }
      return r;
    }));
    addToast(`Allocated supplies to ${zoneName}. Resource ledger updated.`, 'success');
  }, [addToast]);

  const runSimulation = useCallback(() => {
    if (simulationState.active) return;

    setSimulationState({
      active: true,
      step: 1,
      statusText: 'Monsoon flash surge detected across Mula-Mutha river basin...',
      completed: false,
    });
    addToast('▶ Disaster Simulation Started: Inundation Surge', 'success');

    // Step 2 (1.2s): Hazard severity increases
    setTimeout(() => {
      setSimulationState({
        active: true,
        step: 2,
        statusText: 'Water level +1.8m in Pune. Flood hazard elevated to CRITICAL.',
        completed: false,
      });

      setIncidents(prev => prev.map(inc =>
        inc.id === 'inc-001'
          ? {
            ...inc,
            severity: 'critical',
            peopleAffected: 1850,
            communityReports: 24,
            aiAssessment: 'CRITICAL INUNDATION: Mula-Mutha water level surpassed red mark by 1.8m. 3 residential wards face imminent submersion.',
          }
          : inc
      ));

      setHazardZones(prev => prev.map(hz =>
        hz.id === 'h-1'
          ? { ...hz, severity: 'critical', opacity: 0.42, color: '#ef4444', radius: 18000 }
          : hz
      ));

      addToast('Flood severity escalated HIGH → CRITICAL (Pune Sector 7)', 'error');
    }, 1300);

    // Step 3 (2.6s): Community reports surge + AI risk recalculated
    setTimeout(() => {
      setSimulationState({
        active: true,
        step: 3,
        statusText: 'Surge in SOS community reports. AI recalculated Risk Score: 96/100.',
        completed: false,
      });

      const autoReport = {
        id: `cr-sim-${Date.now()}`,
        text: 'URGENT: Flash surge trapped 18 elderly residents in Sector 7 ground floors!',
        location: 'Sector 7, Warje, Pune',
        timeAgo: 'Just now',
        category: 'Evacuation',
        urgency: 'critical',
        verified: true,
        aiClass: 'critical',
        aiNote: 'Life-safety emergency corroborated by 6 geocoded reports. Immediate boat rescue mandated.',
        incidentId: 'inc-001',
      };
      setCommunityReports(prev => [autoReport, ...prev]);

      setSituationSummary(prev => ({
        ...prev,
        criticalCount: 2,
        totalAffected: 3075,
        aiSummary: 'CRITICAL ESCALATION: Pune flood basin risk increased to 96/100. Water ingress rate 15cm/hr. Immediate tactical rescue dispatch required.',
        criticalAlert: 'Sector 7 embankment breach reported. Narrowing 20-minute evacuation window.',
        recommendation: 'Deploy NDRF Team Alpha immediately to Sector 7 with rescue boats and high-water gear.',
      }));

      addToast('AI Risk Score Recalculated: 96/100 (CRITICAL)', 'error');
    }, 2700);

    // Step 4 (4.0s): AI Auto-recommends & dispatches NDRF Team Alpha
    setTimeout(() => {
      setSimulationState({
        active: true,
        step: 4,
        statusText: 'AI tactical match: NDRF Team Alpha deployed with 2 rescue boats.',
        completed: true,
      });

      setResponders(prev => prev.map(r =>
        r.id === 'r-001'
          ? { ...r, status: 'deployed', deployedTo: 'inc-001', eta: 'En Route (8m)' }
          : r
      ));

      setIncidents(prev => prev.map(inc =>
        inc.id === 'inc-001'
          ? { ...inc, status: 'responding' }
          : inc
      ));

      addToast('✓ Auto-Dispatched NDRF Team Alpha to Pune Critical Zone', 'success');
    }, 4100);
  }, [simulationState.active, addToast]);

  const resetSimulation = useCallback(() => {
    setIncidents(initialIncidents);
    setResponders(initialResponders);
    setCommunityReports(initialCommunityReports);
    setRecoveryZones(initialRecoveryZones);
    setResourceStatus(initialResourceStatus);
    setHazardZones(initialHazardZones);
    setSituationSummary(initialSituationSummary);
    setSimulationState({
      active: false,
      step: 0,
      statusText: '',
      completed: false,
    });
    addToast('Simulation reset to baseline state.', 'success');
  }, [addToast]);

  return (
    <AppContext.Provider
      value={{
        incidents,
        responders,
        communityReports,
        recoveryZones,
        resourceStatus,
        hazardZones,
        situationSummary,
        toasts,
        simulationState,
        dispatchResponder,
        submitCommunityReport,
        allocateResource,
        runSimulation,
        resetSimulation,
        addToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
