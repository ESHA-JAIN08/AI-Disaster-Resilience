import React, { useState } from 'react';
import { Heart, Zap, Package, Users, TrendingUp, CheckCircle, ArrowRight, ShieldCheck, Cpu } from 'lucide-react';
import ResponseCycleBanner from '../components/ResponseCycleBanner.jsx';
import { useApp } from '../utils/AppContext.jsx';

const NEED_ICONS = {
  'Drinking Water': '💧',
  'Food Supply': '🍱',
  'Medical Support': '🏥',
  'Temporary Shelter': '🏕️',
  'Road Access': '🛣️',
  'Power Restoration': '⚡',
};

const ZONE_PRIORITY_META = {
  'zone-c': {
    score: 94,
    level: 'CRITICAL NEED',
    color: 'var(--red)',
    action: 'Prioritize drinking water tankers and emergency pediatric medical kits for Zone C. Deploy 8 modular temporary shelters within 12 hours to alleviate overcrowded relief camps.',
    resourceId: 'rs-1',
  },
  'zone-b': {
    score: 76,
    level: 'HIGH NEED',
    color: 'var(--orange)',
    action: 'Clear NH-48 access bypass to allow food and water tankers into Raigad village cluster. Pre-position helicopter drops for isolated hamlets.',
    resourceId: 'rs-2',
  },
  'zone-d': {
    score: 55,
    level: 'MODERATE NEED',
    color: 'var(--yellow)',
    action: 'Restore power grid infrastructure across Nashik MIDC sector to reactivate local water treatment facilities.',
    resourceId: 'rs-6',
  },
  'zone-a': {
    score: 28,
    level: 'LOW NEED / STABLE',
    color: 'var(--green)',
    action: 'North Pune recovery progressing smoothly at 78%. Reassign spare medical personnel to high-deficit Zone C camps.',
    resourceId: 'rs-3',
  },
};

export default function RecoveryResilience() {
  const { recoveryZones, resourceStatus, allocateResource } = useApp();
  const [selectedZone, setSelectedZone] = useState(recoveryZones[2]); // Zone C default (most critical)

  const totalSheltered = recoveryZones.reduce((s, z) => s + z.sheltered, 0);
  const avgRecovery = Math.round(recoveryZones.reduce((s, z) => s + z.recoveryPct, 0) / recoveryZones.length);

  const activeMeta = ZONE_PRIORITY_META[selectedZone?.id] || ZONE_PRIORITY_META['zone-c'];

  const recoveryFactors = [
    { label: 'Recovery Deficit', value: 100 - (selectedZone?.recoveryPct || 50), level: `${100 - (selectedZone?.recoveryPct || 50)}% pending`, color: activeMeta.color },
    { label: 'Sheltered Population', value: Math.min(100, Math.round((selectedZone?.sheltered || 1000) / 40)), level: `${selectedZone?.sheltered.toLocaleString()} sheltered`, color: 'var(--orange)' },
    { label: 'Unresolved Needs', value: (selectedZone?.needs.length || 2) * 25, level: `${selectedZone?.needs.length} critical categories`, color: 'var(--yellow)' },
    { label: 'Buffer Reserve', value: selectedZone?.id === 'zone-c' ? 22 : 65, level: selectedZone?.id === 'zone-c' ? 'Strained' : 'Adequate', color: selectedZone?.id === 'zone-c' ? 'var(--red)' : 'var(--green)' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* Response cycle indicator */}
      <ResponseCycleBanner currentStep="recovery" />

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
            <Heart size={17} color="var(--green)" />
            <h1 style={{ fontSize: '1.05rem', margin: 0, fontWeight: 700 }}>
              Recovery & Community Resilience
            </h1>
          </div>
          <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: 0 }}>
            What does the community need and how is recovery progressing?
          </p>
        </div>

        <div style={{ display: 'flex', gap: 16 }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--accent-blue)', letterSpacing: '-0.02em', lineHeight: 1 }}>
              {totalSheltered.toLocaleString()}
            </div>
            <div style={{ fontSize: '0.625rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', marginTop: 2 }}>
              Total Sheltered
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: avgRecovery > 60 ? 'var(--green)' : avgRecovery > 40 ? 'var(--yellow)' : 'var(--orange)', letterSpacing: '-0.02em', lineHeight: 1 }}>
              {avgRecovery}%
            </div>
            <div style={{ fontSize: '0.625rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', marginTop: 2 }}>
              Statewide Recovery
            </div>
          </div>
        </div>
      </div>

      {/* Main split */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Left: Zones list + Resource Status */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', borderRight: '1px solid var(--border)' }}>
          {/* Priority Communities List */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div className="section-label">
              Priority Community Sectors (Sorted by Vulnerability)
            </div>
            {[...recoveryZones].sort((a, b) => a.recoveryPct - b.recoveryPct).map(zone => (
              <ZoneCard
                key={zone.id}
                zone={zone}
                selected={selectedZone?.id === zone.id}
                onClick={setSelectedZone}
              />
            ))}
          </div>

          {/* Resources Status Ledger */}
          <div style={{ padding: '14px 16px', borderTop: '1px solid var(--border)', background: 'var(--bg-surface)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
              <div className="section-label" style={{ margin: 0 }}>
                Relief Supplies Buffer & Ledger
              </div>
              <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                Live Inventory
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px 16px' }}>
              {resourceStatus.map(r => (
                <ResourceRow key={r.id} resource={r} />
              ))}
            </div>
          </div>
        </div>

        {/* Right: Selected Zone AI Recovery Intelligence Panel */}
        <div
          style={{
            width: 340,
            flexShrink: 0,
            background: 'var(--bg-surface)',
            padding: '16px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
          }}
        >
          {selectedZone && (
            <>
              {/* Zone Title & Metrics */}
              <div>
                <div className="section-label" style={{ marginBottom: 4 }}>
                  Target Zone Intel
                </div>
                <h2 style={{ fontSize: '0.95rem', margin: 0, fontWeight: 700, color: 'var(--text-primary)' }}>
                  {selectedZone.name}
                </h2>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 2 }}>
                  Pop. {selectedZone.population.toLocaleString()} · {selectedZone.sheltered.toLocaleString()} in camps
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8, marginTop: 12 }}>
                  <MiniStat label="Recovery Progress" value={`${selectedZone.recoveryPct}%`} color={selectedZone.recoveryPct < 40 ? 'var(--red)' : selectedZone.recoveryPct < 70 ? 'var(--yellow)' : 'var(--green)'} />
                  <MiniStat label="Unresolved Needs" value={`${selectedZone.needs.length} items`} color="var(--orange)" />
                </div>
              </div>

              {/* AI Recovery Priority Score Box */}
              <div
                style={{
                  background: 'linear-gradient(145deg, rgba(13, 21, 38, 0.95) 0%, rgba(8, 14, 26, 0.98) 100%)',
                  border: '1px solid rgba(56, 189, 248, 0.25)',
                  borderRadius: 8,
                  padding: '14px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Cpu size={14} color="var(--accent-blue)" />
                    <span style={{ fontSize: '0.6875rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--accent-blue)', letterSpacing: '0.06em' }}>
                      Recovery Priority Score
                    </span>
                  </div>
                  <span
                    style={{
                      padding: '2px 8px',
                      borderRadius: 100,
                      fontSize: '0.6875rem',
                      fontWeight: 800,
                      background: `${activeMeta.color}22`,
                      color: activeMeta.color,
                      border: `1px solid ${activeMeta.color}55`,
                    }}
                  >
                    {activeMeta.level}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                  <span style={{ fontSize: '1.6rem', fontWeight: 800, color: activeMeta.color, lineHeight: 1 }}>
                    {activeMeta.score}
                  </span>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>/ 100 Resource Priority Index</span>
                </div>

                {/* Factors */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, paddingTop: 6, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  {recoveryFactors.map(f => (
                    <div key={f.label} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6875rem' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>{f.label}</span>
                        <span style={{ color: f.color, fontWeight: 600 }}>{f.level}</span>
                      </div>
                      <div style={{ height: 3.5, background: 'rgba(255,255,255,0.06)', borderRadius: 100, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${f.value}%`, background: f.color, borderRadius: 100 }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Recovery Action */}
              <div
                style={{
                  background: 'rgba(34, 197, 94, 0.08)',
                  border: '1px solid rgba(34, 197, 94, 0.28)',
                  borderRadius: 8,
                  padding: '12px 14px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.6875rem', fontWeight: 800, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--green)', marginBottom: 5 }}>
                  <TrendingUp size={12} />
                  AI Recommended Recovery Action
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-primary)', lineHeight: 1.55, margin: 0, fontWeight: 500 }}>
                  {activeMeta.action}
                </p>
              </div>

              {/* Unresolved Needs list */}
              <div>
                <div className="section-label" style={{ marginBottom: 6 }}>
                  Unresolved Community Needs
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {selectedZone.needs.map(need => (
                    <div
                      key={need}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        padding: '8px 12px',
                        borderRadius: 6,
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border)',
                      }}
                    >
                      <span style={{ fontSize: '1rem' }}>{NEED_ICONS[need] || '📦'}</span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 500 }}>{need}</span>
                      <span style={{ marginLeft: 'auto', fontSize: '0.65rem', fontWeight: 700, padding: '2px 7px', borderRadius: 100, background: 'var(--red-dim)', color: 'var(--red)', border: '1px solid rgba(239,68,68,0.3)' }}>
                        Pending Allocation
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Resource Allocation Action */}
              <button
                className="btn btn-primary"
                onClick={() => allocateResource(activeMeta.resourceId, selectedZone.name)}
                style={{ width: '100%', justifyContent: 'center', padding: '10px', fontSize: '0.78rem' }}
              >
                <Package size={14} />
                Allocate Priority Supplies to {selectedZone.name.split('—')[0]}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function ZoneCard({ zone, selected, onClick }) {
  const pct = zone.recoveryPct;
  const color = pct >= 70 ? 'var(--green)' : pct >= 50 ? 'var(--yellow)' : pct >= 30 ? 'var(--orange)' : 'var(--red)';
  return (
    <button
      onClick={() => onClick(zone)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 9,
        padding: '13px 15px',
        borderRadius: 10,
        textAlign: 'left',
        background: selected ? 'var(--bg-hover)' : 'var(--bg-card)',
        border: `1px solid ${selected ? 'var(--accent-blue)' : 'var(--border)'}`,
        cursor: 'pointer',
        width: '100%',
        transition: 'all 0.15s',
        fontFamily: 'inherit',
      }}
      onMouseEnter={e => {
        if (!selected) e.currentTarget.style.borderColor = 'var(--border-strong)';
      }}
      onMouseLeave={e => {
        if (!selected) e.currentTarget.style.borderColor = 'var(--border)';
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 2 }}>
            {zone.name}
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
            Pop. {zone.population.toLocaleString()} · {zone.sheltered.toLocaleString()} in camps
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '1.3rem', fontWeight: 800, color, letterSpacing: '-0.02em', lineHeight: 1 }}>
            {pct}%
          </div>
          <div style={{ fontSize: '0.625rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 2 }}>
            Recovered
          </div>
        </div>
      </div>

      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${pct}%`, background: color }} />
      </div>

      <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
        {zone.needs.map(need => (
          <span
            key={need}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              padding: '2px 8px',
              borderRadius: 100,
              background: 'rgba(100,116,139,0.12)',
              border: '1px solid rgba(100,116,139,0.22)',
              fontSize: '0.6875rem',
              color: 'var(--text-secondary)',
            }}
          >
            {NEED_ICONS[need] || '📦'} {need}
          </span>
        ))}
      </div>
    </button>
  );
}

function ResourceRow({ resource }) {
  const pct = Math.round((resource.available / resource.total) * 100);
  const color =
    resource.status === 'critical' ? 'var(--red)' :
      resource.status === 'low' ? 'var(--orange)' :
        resource.status === 'moderate' ? 'var(--yellow)' : 'var(--green)';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, padding: '4px 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)' }}>
          {resource.name}
        </span>
        <span style={{ fontSize: '0.7rem', color, fontWeight: 700 }}>
          {resource.available}/{resource.total} {resource.unit}
        </span>
      </div>
      <div className="progress-bar" style={{ height: 4 }}>
        <div className="progress-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}

function MiniStat({ label, value, color = 'var(--text-primary)' }) {
  return (
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, padding: '9px 12px' }}>
      <div style={{ fontSize: '0.625rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', marginBottom: 2 }}>
        {label}
      </div>
      <div style={{ fontSize: '1.05rem', fontWeight: 800, color, letterSpacing: '-0.01em', lineHeight: 1.1 }}>
        {value}
      </div>
    </div>
  );
}
