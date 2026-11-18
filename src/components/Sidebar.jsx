import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Shield, Map, AlertTriangle, Heart, Radio, Activity } from 'lucide-react';
import { useApp } from '../utils/AppContext.jsx';

const navItems = [
  { to: '/', icon: Radio, label: 'Command Center', subtitle: 'Unified Operational View' },
  { to: '/risk', icon: Map, label: 'Disaster Risk', subtitle: 'Spatial Hazard Intel' },
  { to: '/emergency', icon: AlertTriangle, label: 'Emergency & Community', subtitle: 'Field Triage & Dispatch' },
  { to: '/recovery', icon: Heart, label: 'Recovery & Resilience', subtitle: 'Post-Disaster Needs' },
];

export default function Sidebar() {
  const location = useLocation();
  const { simulationState, responders } = useApp();

  const availableCount = responders.filter(r => r.status === 'available').length;

  return (
    <aside
      style={{
        width: '230px',
        flexShrink: 0,
        background: 'var(--bg-surface)',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        padding: '0',
        height: '100%',
        zIndex: 20,
      }}
    >
      {/* Brand Header */}
      <div
        style={{
          padding: '18px 16px 16px',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div className="flex items-center gap-2" style={{ marginBottom: '4px' }}>
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: 8,
              background: 'linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              boxShadow: '0 2px 10px rgba(56, 189, 248, 0.35)',
            }}
          >
            <Shield size={16} color="#060c18" strokeWidth={2.6} />
          </div>
          <div>
            <div style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
              DisasterAI
            </div>
            <div style={{ fontSize: '0.625rem', color: 'var(--text-muted)', letterSpacing: '0.04em', textTransform: 'uppercase', fontWeight: 600 }}>
              Community Safety Platform
            </div>
          </div>
        </div>

        {/* Tagline */}
        <div style={{ fontSize: '0.6875rem', color: 'var(--accent-blue)', fontStyle: 'italic', marginTop: 6, opacity: 0.9 }}>
          Prepare Smarter. Respond Faster. Recover Better.
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ padding: '12px 10px', flex: 1, display: 'flex', flexDirection: 'column', gap: '3px' }}>
        <div className="section-label" style={{ paddingLeft: '8px', marginBottom: '6px' }}>
          Core Modules
        </div>
        {navItems.map(({ to, icon: Icon, label, subtitle }) => {
          const isActive = to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);
          return (
            <NavLink
              key={to}
              to={to}
              className={`nav-item ${isActive ? 'active' : ''}`}
              style={{
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '9px 12px',
                borderRadius: 'var(--radius-sm)',
              }}
            >
              <Icon size={16} className="nav-icon" color={isActive ? 'var(--accent-cyan)' : 'var(--text-secondary)'} />
              <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                <span style={{ fontSize: '0.8125rem', fontWeight: isActive ? 700 : 500 }}>{label}</span>
                <span style={{ fontSize: '0.625rem', color: isActive ? 'rgba(56, 189, 248, 0.7)' : 'var(--text-muted)' }}>
                  {subtitle}
                </span>
              </div>
            </NavLink>
          );
        })}
      </nav>

      {/* Live System Telemetry Status */}
      <div style={{ padding: '12px 14px', margin: '0 10px 10px', background: 'rgba(8,14,26,0.6)', borderRadius: 8, border: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
          <span style={{ fontSize: '0.625rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.06em' }}>
            System Engine
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div className={`dot ${simulationState.active ? 'dot-critical pulsing-dot' : 'dot-low'}`} />
            <span style={{ fontSize: '0.6875rem', color: simulationState.active ? 'var(--red)' : 'var(--green)', fontWeight: 600 }}>
              {simulationState.active ? 'SIMULATION' : 'ONLINE'}
            </span>
          </div>
        </div>
        <div style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)' }}>
          {availableCount} units ready · GIS active
        </div>
      </div>

      {/* Bottom Disclaimer */}
      <div style={{ padding: '12px 14px 14px', borderTop: '1px solid var(--border)' }}>
        <div className="disclaimer" style={{ lineHeight: 1.4 }}>
          <span>⚠</span>
          <span>Prototype simulation — not live emergency data.</span>
        </div>
      </div>
    </aside>
  );
}
