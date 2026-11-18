import React, { useState, useEffect } from 'react';
import { AlertTriangle, Radio, Play, RotateCcw, CheckCircle, Zap, Shield, Sparkles, Send, Eye, MapPin } from 'lucide-react';
import DisasterMap from '../components/DisasterMap.jsx';
import IncidentDetail from '../components/IncidentDetail.jsx';
import AIDecisionPanel from '../components/AIDecisionPanel.jsx';
import ResponseCycleBanner from '../components/ResponseCycleBanner.jsx';
import { SeverityBadge, StatusBadge } from '../components/Badges.jsx';
import { useApp } from '../utils/AppContext.jsx';

export default function CommandCenter() {
  const {
    incidents,
    responders,
    situationSummary,
    simulationState,
    runSimulation,
    resetSimulation,
    dispatchResponder,
  } = useApp();

  const [modalIncident, setModalIncident] = useState(null);
  const [focusedIncident, setFocusedIncident] = useState(incidents[0]); // default to Pune Flood

  // Keep focusedIncident synced with latest state
  const liveFocused = incidents.find(i => i.id === focusedIncident?.id) || incidents[0];

  const availableCount = responders.filter(r => r.status === 'available').length;
  const deployedCount = responders.filter(r => r.status === 'deployed').length;
  const criticalCount = incidents.filter(i => i.severity === 'critical').length;
  const totalAffected = incidents.reduce((sum, inc) => sum + (inc.peopleAffected || 0), 0);

  // When simulation starts, automatically focus map on Pune Flood zone
  useEffect(() => {
    if (simulationState.active) {
      const pune = incidents.find(i => i.id === 'inc-001');
      if (pune) setFocusedIncident(pune);
    }
  }, [simulationState.active, incidents]);

  // Dynamic risk score based on state / simulation / focused incident
  const incidentScore =
    liveFocused?.id === 'inc-001' && simulationState.step >= 3 ? 96 :
      liveFocused?.severity === 'critical' ? 92 :
        liveFocused?.severity === 'high' ? 84 : 64;

  const incidentSeverity =
    liveFocused?.id === 'inc-001' && simulationState.step >= 2 ? 'CRITICAL' :
      liveFocused?.severity ? liveFocused.severity.toUpperCase() : 'HIGH';

  const factors = [
    {
      label: 'Flood Inundation Velocity',
      value: liveFocused?.id === 'inc-001' && simulationState.step >= 2 ? 96 : 78,
      level: liveFocused?.id === 'inc-001' && simulationState.step >= 2 ? 'Surging (+1.8m)' : 'Elevated (+0.8m)',
      color: liveFocused?.id === 'inc-001' && simulationState.step >= 2 ? 'var(--red)' : 'var(--orange)',
    },
    {
      label: 'Exposed Population',
      value: liveFocused ? Math.min(100, Math.round((liveFocused.peopleAffected / 2000) * 100)) : 72,
      level: `${(liveFocused?.peopleAffected || 1240).toLocaleString()} exposed`,
      color: 'var(--orange)',
    },
    {
      label: 'Responder Buffer',
      value: Math.round((availableCount / responders.length) * 100),
      level: `${availableCount} of ${responders.length} units ready`,
      color: availableCount <= 2 ? 'var(--red)' : 'var(--yellow)',
    },
    {
      label: 'Field SOS Signals',
      value: liveFocused?.id === 'inc-001' && simulationState.step >= 3 ? 95 : 68,
      level: `${liveFocused?.communityReports || 17} active reports`,
      color: liveFocused?.id === 'inc-001' && simulationState.step >= 3 ? 'var(--red)' : 'var(--yellow)',
    },
  ];

  const handleIncidentSelect = (inc) => {
    setFocusedIncident(inc);
  };

  const handleOpenModal = (inc) => {
    setModalIncident(inc || liveFocused);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* Response cycle indicator */}
      <ResponseCycleBanner currentStep="prioritize" />

      {/* Main layout */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', position: 'relative' }}>
        {/* Real Geographic Map (Center Stage) */}
        <div style={{ flex: 1, position: 'relative', margin: 10, borderRadius: 12, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <DisasterMap
            showIncidents
            showResponders
            showFacilities
            focusIncident={liveFocused}
            onIncidentClick={handleIncidentSelect}
          />

          {/* Top Bar Overlay */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 18px',
              background: 'linear-gradient(to bottom, rgba(5,11,22,0.95) 0%, rgba(5,11,22,0.6) 80%, transparent 100%)',
              pointerEvents: 'none',
              zIndex: 400,
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <h1 style={{ fontSize: '1.05rem', fontWeight: 800, letterSpacing: '-0.02em', margin: 0 }}>
                  Unified Command Center
                </h1>
                <span
                  style={{
                    fontSize: '0.625rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    padding: '2px 7px',
                    borderRadius: 4,
                    background: 'rgba(56, 189, 248, 0.15)',
                    color: 'var(--accent-blue)',
                    border: '1px solid rgba(56, 189, 248, 0.3)',
                  }}
                >
                  LIVE GIS INTEL
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                <div className="dot dot-active pulsing-dot" />
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  Real Maharashtra OpenStreetMap coordinates · Click markers to zoom & dispatch
                </span>
              </div>
            </div>

            {/* Stat pills & simulation button */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, pointerEvents: 'all' }}>
              <StatPill value={incidents.length} label="Incidents" color="var(--orange)" />
              <StatPill value={criticalCount} label="Critical" color="var(--red)" />
              <StatPill value={totalAffected.toLocaleString()} label="Affected" color="var(--accent-blue)" />
              <StatPill value={`${availableCount} Avail`} label="Responders" color="var(--green)" />

              {/* Simulation Trigger Button */}
              {simulationState.active ? (
                <button
                  className="btn btn-ghost"
                  onClick={resetSimulation}
                  style={{
                    padding: '8px 12px',
                    borderColor: 'rgba(239, 68, 68, 0.4)',
                    color: 'var(--red)',
                    fontSize: '0.75rem',
                  }}
                >
                  <RotateCcw size={13} />
                  Reset Simulation
                </button>
              ) : (
                <button
                  className="btn btn-primary"
                  onClick={runSimulation}
                  style={{
                    padding: '8px 14px',
                    background: 'linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)',
                    boxShadow: '0 4px 14px rgba(56, 189, 248, 0.35)',
                    fontSize: '0.75rem',
                  }}
                >
                  <Play size={13} fill="#080e1a" />
                  Run Disaster Simulation
                </button>
              )}
            </div>
          </div>

          {/* Simulation Progress Ribbon when active */}
          {simulationState.active && (
            <div
              style={{
                position: 'absolute',
                top: 66,
                left: 18,
                right: 18,
                background: 'rgba(11, 20, 38, 0.96)',
                border: '1px solid rgba(56, 189, 248, 0.35)',
                borderRadius: 8,
                padding: '9px 14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                zIndex: 450,
                backdropFilter: 'blur(8px)',
                animation: 'fadeIn 0.25s ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    background: simulationState.completed ? 'var(--green-dim)' : 'var(--red-dim)',
                    border: `1px solid ${simulationState.completed ? 'var(--green)' : 'var(--red)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {simulationState.completed ? (
                    <CheckCircle size={14} color="var(--green)" />
                  ) : (
                    <div className="dot dot-critical pulsing-dot" />
                  )}
                </div>
                <div>
                  <div style={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--accent-blue)' }}>
                    Phase {simulationState.step}/4: {simulationState.completed ? 'Simulation Protocol Deployed' : 'Active Tactical Escalation'}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-primary)', fontWeight: 500 }}>
                    {simulationState.statusText}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  Map focused on Pune Flood
                </span>
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={resetSimulation}
                  style={{ fontSize: '0.6875rem', padding: '4px 8px' }}
                >
                  Reset
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Intelligence Panel */}
        <div
          style={{
            width: 330,
            flexShrink: 0,
            background: 'var(--bg-surface)',
            borderLeft: '1px solid var(--border)',
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto',
            padding: '14px',
            gap: 14,
          }}
        >
          {/* Focused Incident Card */}
          <div
            style={{
              background: 'linear-gradient(145deg, rgba(17, 29, 53, 0.95) 0%, rgba(13, 21, 38, 0.98) 100%)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              borderRadius: 8,
              padding: '12px 14px',
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: '1.25rem' }}>{liveFocused?.icon}</span>
                  <div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                      {liveFocused?.type} — {liveFocused?.location}
                    </div>
                    <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                      {liveFocused?.district}
                    </div>
                  </div>
                </div>
              </div>
              <SeverityBadge level={liveFocused?.severity} />
            </div>

            {/* Quick Metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6, background: 'rgba(8,14,26,0.6)', padding: '8px 10px', borderRadius: 6 }}>
              <div>
                <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Affected</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--orange)' }}>
                  {liveFocused?.peopleAffected.toLocaleString()}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Field SOS</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--accent-blue)' }}>
                  {liveFocused?.communityReports}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Nearby Responders</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--green)' }}>
                  {liveFocused?.nearbyResponders}
                </div>
              </div>
            </div>

            {/* Focused Action Buttons */}
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => handleOpenModal(liveFocused)}
                style={{ flex: 1, justifyContent: 'center', padding: '7px 8px', fontSize: '0.72rem' }}
              >
                <Eye size={12} />
                View Incident
              </button>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => dispatchResponder(liveFocused?.id)}
                disabled={availableCount === 0 || liveFocused?.status === 'contained'}
                style={{ flex: 1, justifyContent: 'center', padding: '7px 8px', fontSize: '0.72rem' }}
              >
                <Send size={12} />
                Dispatch
              </button>
            </div>
          </div>

          {/* AI Decision Intelligence Panel */}
          <AIDecisionPanel
            score={incidentScore}
            severityLevel={incidentSeverity}
            recommendation={liveFocused?.recommendedAction || situationSummary.recommendation}
            confidence={94}
            factors={factors}
          />

          {/* Active Incidents List with Zoom/Focus trigger */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <span className="section-label" style={{ margin: 0 }}>
                Active Incidents ({incidents.length})
              </span>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                Click to Pan Map
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {incidents.map(inc => {
                const isSelected = liveFocused?.id === inc.id;
                return (
                  <button
                    key={inc.id}
                    onClick={() => handleIncidentSelect(inc)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: '9px 11px',
                      borderRadius: 8,
                      background: isSelected ? 'var(--bg-hover)' : 'var(--bg-card)',
                      border: `1px solid ${isSelected ? 'var(--accent-blue)' : 'var(--border)'}`,
                      cursor: 'pointer',
                      textAlign: 'left',
                      width: '100%',
                      transition: 'all 0.15s',
                      fontFamily: 'inherit',
                    }}
                  >
                    <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>{inc.icon}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '0.78rem', fontWeight: isSelected ? 800 : 600, color: isSelected ? 'var(--accent-blue)' : 'var(--text-primary)' }}>
                        {inc.type} · {inc.location}
                      </div>
                      <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                        {inc.peopleAffected.toLocaleString()} affected · {inc.communityReports} reports
                      </div>
                    </div>
                    <SeverityBadge level={inc.severity} />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Incident Detail Modal */}
      {modalIncident && (
        <IncidentDetail
          incident={modalIncident}
          onClose={() => setModalIncident(null)}
        />
      )}
    </div>
  );
}

function StatPill({ value, label, color }) {
  return (
    <div
      style={{
        background: 'rgba(10, 18, 34, 0.88)',
        border: '1px solid var(--border)',
        borderRadius: 8,
        padding: '5px 12px',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 1,
        minWidth: 64,
      }}
    >
      <span style={{ fontSize: '0.95rem', fontWeight: 800, color, letterSpacing: '-0.02em', lineHeight: 1 }}>
        {value}
      </span>
      <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
        {label}
      </span>
    </div>
  );
}
