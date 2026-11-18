import React, { useState } from 'react';
import { Map, Layers, Filter, Eye, Cpu, Zap, Compass } from 'lucide-react';
import DisasterMap from '../components/DisasterMap.jsx';
import IncidentDetail from '../components/IncidentDetail.jsx';
import AIDecisionPanel from '../components/AIDecisionPanel.jsx';
import ResponseCycleBanner from '../components/ResponseCycleBanner.jsx';
import { useApp } from '../utils/AppContext.jsx';

const HAZARD_FILTERS = [
  { id: 'all', label: 'All Hazards', icon: '🌐' },
  { id: 'flood', label: 'Flood', icon: '🌊' },
  { id: 'fire', label: 'Fire', icon: '🔥' },
  { id: 'landslide', label: 'Landslide', icon: '⛰️' },
  { id: 'weather', label: 'Extreme Weather', icon: '🌀' },
];

const SEVERITY_FILTERS = [
  { id: 'all', label: 'All Severity' },
  { id: 'critical', label: 'Critical' },
  { id: 'high', label: 'High' },
  { id: 'moderate', label: 'Moderate' },
  { id: 'low', label: 'Low' },
];

const HAZARD_CONFIG = {
  all: {
    score: 86,
    severity: 'CRITICAL',
    rec: 'Activate multi-agency disaster coordination across Pune and Raigad corridors. Flood mitigation takes priority.',
    conf: 95,
  },
  flood: {
    score: 93,
    severity: 'CRITICAL',
    rec: 'Mula-Mutha river basin approaching crest. Pre-position NDRF boat teams and issue Sector 7 evacuation notice.',
    conf: 96,
  },
  fire: {
    score: 74,
    severity: 'HIGH',
    rec: 'Industrial fire in Nashik MIDC contained to 2 godowns. Maintain cooling perimeter and monitor wind direction.',
    conf: 91,
  },
  landslide: {
    score: 88,
    severity: 'CRITICAL',
    rec: 'Soil saturation threshold exceeded in Raigad slopes. Pre-position earthmovers and clear NH-48 bypass corridor.',
    conf: 93,
  },
  weather: {
    score: 68,
    severity: 'MODERATE',
    rec: 'Konkan coastal squall expected within 6 hours. Restrict marine operations and secure temporary shelters.',
    conf: 89,
  },
};

export default function DisasterRisk() {
  const { hazardZones, incidents, responders } = useApp();
  const [hazardFilter, setHazardFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [selectedIncident, setSelectedIncident] = useState(null);

  const counts = {
    flood: hazardZones.filter(z => z.type === 'flood').length,
    fire: hazardZones.filter(z => z.type === 'fire').length,
    landslide: hazardZones.filter(z => z.type === 'landslide').length,
    weather: hazardZones.filter(z => z.type === 'weather').length,
  };

  const visibleCount = hazardZones.filter(z => {
    if (hazardFilter !== 'all' && z.type !== hazardFilter) return false;
    if (severityFilter !== 'all' && z.severity !== severityFilter) return false;
    return true;
  }).length;

  const currentCfg = HAZARD_CONFIG[hazardFilter] || HAZARD_CONFIG.all;

  const riskFactors = [
    { label: 'Spatial Hazard Overlap', value: 92, level: '3 Active Sectors', color: 'var(--red)' },
    { label: 'Soil/Drainage Saturation', value: 88, level: 'Critical Level', color: 'var(--red)' },
    { label: 'Infrastructure Exposure', value: 72, level: 'NH-48 & Bridges', color: 'var(--orange)' },
    { label: 'Safe Point Proximity', value: 45, level: '4 Camps Active', color: 'var(--yellow)' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* Response cycle indicator */}
      <ResponseCycleBanner currentStep="risk" />

      {/* Header */}
      <div
        style={{
          padding: '12px 24px',
          borderBottom: '1px solid var(--border)',
          background: 'var(--bg-surface)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <div className="flex items-center gap-2" style={{ marginBottom: 2 }}>
            <Map size={17} color="var(--accent-blue)" />
            <h1 style={{ fontSize: '1.05rem', margin: 0, fontWeight: 700 }}>
              Disaster Risk Intelligence
            </h1>
          </div>
          <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: 0 }}>
            Where is the danger and how severe is it? Multi-hazard spatial modeling
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          <Layers size={13} color="var(--accent-blue)" />
          <span><strong>{visibleCount}</strong> spatial hazard zones mapped</span>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div
        style={{
          padding: '10px 24px',
          borderBottom: '1px solid var(--border)',
          background: 'var(--bg-surface)',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          flexWrap: 'wrap',
        }}
      >
        <div className="flex items-center gap-6" style={{ flex: 1 }}>
          <div className="flex items-center gap-2">
            <Filter size={12} color="var(--text-muted)" />
            <span style={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text-muted)' }}>
              Hazard Layer
            </span>
          </div>
          <div className="flex items-center gap-2" style={{ flexWrap: 'wrap' }}>
            {HAZARD_FILTERS.map(f => (
              <button
                key={f.id}
                className={`chip ${hazardFilter === f.id ? 'active' : ''}`}
                onClick={() => setHazardFilter(f.id)}
              >
                <span>{f.icon}</span>
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ width: 1, height: 20, background: 'var(--border)' }} />

        <div className="flex items-center gap-2">
          <span style={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text-muted)' }}>
            Severity
          </span>
          {SEVERITY_FILTERS.map(f => (
            <button
              key={f.id}
              className={`chip ${severityFilter === f.id ? 'active' : ''}`}
              onClick={() => setSeverityFilter(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main content: Dominant Map + Right Intel Panel */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Map (Dominant Hero Visual) */}
        <div style={{ flex: 1, padding: 12, overflow: 'hidden', position: 'relative' }}>
          <DisasterMap
            filterHazard={hazardFilter}
            filterSeverity={severityFilter}
            showIncidents
            showResponders
            showSafePoints
            onIncidentClick={setSelectedIncident}
          />
        </div>

        {/* Right Intel Panel */}
        <div
          style={{
            width: 320,
            flexShrink: 0,
            background: 'var(--bg-surface)',
            borderLeft: '1px solid var(--border)',
            padding: '14px',
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
            overflowY: 'auto',
          }}
        >
          {/* Dynamic AI Risk Panel reacting to hazard selection */}
          <AIDecisionPanel
            score={currentCfg.score}
            severityLevel={currentCfg.severity}
            recommendation={currentCfg.rec}
            confidence={currentCfg.conf}
            factors={riskFactors}
          />

          {/* Hazard Summary Counts */}
          <div>
            <div className="section-label" style={{ marginBottom: 8 }}>
              Active Hazard Inventory
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
              <HazardCountCard label="Floods" count={counts.flood} active={hazardFilter === 'flood'} color="var(--accent-blue)" icon="🌊" />
              <HazardCountCard label="Landslides" count={counts.landslide} active={hazardFilter === 'landslide'} color="var(--orange)" icon="⛰️" />
              <HazardCountCard label="Fires" count={counts.fire} active={hazardFilter === 'fire'} color="var(--red)" icon="🔥" />
              <HazardCountCard label="Squalls" count={counts.weather} active={hazardFilter === 'weather'} color="#c084fc" icon="🌀" />
            </div>
          </div>

          {/* District Spatial Breakdown */}
          <div>
            <div className="section-label" style={{ marginBottom: 8 }}>
              Vulnerable Districts
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[
                { district: 'Pune Basin', risk: 'Critical (93/100)', color: 'var(--red)' },
                { district: 'Raigad Foothills', risk: 'Critical (88/100)', color: 'var(--red)' },
                { district: 'Nashik MIDC', risk: 'High (74/100)', color: 'var(--orange)' },
                { district: 'Mumbai Coastal', risk: 'Moderate (64/100)', color: 'var(--yellow)' },
              ].map(d => (
                <div
                  key={d.district}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 10px',
                    borderRadius: 6,
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    fontSize: '0.75rem',
                  }}
                >
                  <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{d.district}</span>
                  <span style={{ color: d.color, fontWeight: 700 }}>{d.risk}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Incident Modal */}
      {selectedIncident && (
        <IncidentDetail
          incident={selectedIncident}
          onClose={() => setSelectedIncident(null)}
        />
      )}
    </div>
  );
}

function HazardCountCard({ label, count, active, color, icon }) {
  return (
    <div
      style={{
        background: active ? 'rgba(56,189,248,0.1)' : 'var(--bg-card)',
        border: `1px solid ${active ? 'var(--accent-blue)' : 'var(--border)'}`,
        borderRadius: 8,
        padding: '10px 12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <div>
        <div style={{ fontSize: '0.625rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
          {label}
        </div>
        <div style={{ fontSize: '1.2rem', fontWeight: 800, color, letterSpacing: '-0.02em', lineHeight: 1.1, marginTop: 2 }}>
          {count} zones
        </div>
      </div>
      <span style={{ fontSize: '1.25rem' }}>{icon}</span>
    </div>
  );
}
