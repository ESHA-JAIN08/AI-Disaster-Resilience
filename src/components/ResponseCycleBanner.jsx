import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Eye, Radio, Cpu, Send, HeartHandshake } from 'lucide-react';

const STAGES = [
  { id: 'risk', label: '1. Detect Danger', path: '/risk', icon: Eye, desc: 'Hazard Spatial AI' },
  { id: 'community', label: '2. Community Signals', path: '/emergency', icon: Radio, desc: 'Field & SOS Reports' },
  { id: 'prioritize', label: '3. AI Prioritization', path: '/', icon: Cpu, desc: 'Risk Scoring' },
  { id: 'response', label: '4. Dispatch Action', path: '/emergency', icon: Send, desc: 'Responder Deployment' },
  { id: 'recovery', label: '5. Recovery & Resilience', path: '/recovery', icon: HeartHandshake, desc: 'Resource Allocation' },
];

export default function ResponseCycleBanner({ currentStep = 'overview' }) {
  const location = useLocation();

  const getActiveId = () => {
    if (currentStep !== 'overview') return currentStep;
    if (location.pathname === '/risk') return 'risk';
    if (location.pathname === '/emergency') return 'community';
    if (location.pathname === '/recovery') return 'recovery';
    return 'prioritize'; // default on command center
  };

  const activeId = getActiveId();

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '6px 14px',
        background: 'rgba(10, 18, 34, 0.85)',
        borderBottom: '1px solid var(--border)',
        backdropFilter: 'blur(10px)',
        fontSize: '0.6875rem',
        overflowX: 'auto',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0, marginRight: 12 }}>
        <span style={{ fontSize: '0.625rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--accent-blue)' }}>
          Disaster Cycle
        </span>
        <span style={{ color: 'var(--text-muted)' }}>▸</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 1, minWidth: 500, justifyContent: 'space-between' }}>
        {STAGES.map((s, idx) => {
          const isActive = s.id === activeId || (activeId === 'prioritize' && location.pathname === '/');
          const Icon = s.icon;
          return (
            <React.Fragment key={s.id}>
              <Link
                to={s.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                  padding: '3px 8px',
                  borderRadius: 4,
                  textDecoration: 'none',
                  background: isActive ? 'rgba(56, 189, 248, 0.14)' : 'transparent',
                  border: `1px solid ${isActive ? 'rgba(56, 189, 248, 0.35)' : 'transparent'}`,
                  color: isActive ? 'var(--text-primary)' : 'var(--text-muted)',
                  fontWeight: isActive ? 600 : 400,
                  transition: 'all 0.15s ease',
                  whiteSpace: 'nowrap',
                }}
              >
                <Icon size={11} color={isActive ? 'var(--accent-cyan)' : 'var(--text-muted)'} />
                <span>{s.label}</span>
              </Link>
              {idx < STAGES.length - 1 && (
                <span style={{ color: 'rgba(255,255,255,0.12)', fontSize: '0.625rem' }}>→</span>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

