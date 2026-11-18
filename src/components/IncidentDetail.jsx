import React, { useState } from 'react';
import { X, Users, FileText, Radio, Zap, ArrowRight, CheckCircle, Cpu, ShieldCheck } from 'lucide-react';
import { SeverityBadge, StatusBadge } from './Badges.jsx';
import { useApp } from '../utils/AppContext.jsx';

export default function IncidentDetail({ incident, onClose }) {
  const { dispatchResponder, incidents, responders } = useApp();
  const [dispatched, setDispatched] = useState(false);
  const [dispatchedName, setDispatchedName] = useState('');

  // Always read latest incident data from context
  const liveIncident = incidents.find(i => i.id === incident.id) || incident;

  // Available responder candidate
  const availableResponder = responders.find(r => r.status === 'available');

  function handleDispatch() {
    if (!availableResponder) return;
    const ok = dispatchResponder(liveIncident.id);
    if (ok) {
      setDispatched(true);
      setDispatchedName(availableResponder.name);
    }
  }

  const canDispatch = !dispatched && availableResponder && liveIncident.status !== 'contained';

  // Compute calculated risk score for this incident
  const calculatedScore =
    liveIncident.severity === 'critical' ? 95 :
      liveIncident.severity === 'high' ? 84 :
        liveIncident.severity === 'moderate' ? 62 : 38;

  const scoreColor =
    calculatedScore >= 80 ? 'var(--red)' :
      calculatedScore >= 60 ? 'var(--orange)' :
        calculatedScore >= 40 ? 'var(--yellow)' : 'var(--green)';

  return (
    <div className="overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal animate-fadein" style={{ width: 520, maxHeight: '90vh', overflowY: 'auto' }}>
        {/* Header */}
        <div style={{ padding: '18px 22px 14px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <div className="flex items-center gap-2" style={{ marginBottom: 4 }}>
              <span style={{ fontSize: '1.25rem' }}>{liveIncident.icon}</span>
              <h2 style={{ fontSize: '1.1rem', margin: 0, fontWeight: 700 }}>{liveIncident.type} Incident</h2>
            </div>
            <div className="flex items-center gap-2">
              <SeverityBadge level={liveIncident.severity} />
              <StatusBadge status={liveIncident.status} />
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                {liveIncident.location} · {liveIncident.district}
              </span>
            </div>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={onClose} style={{ padding: '6px', minWidth: 0 }}>
            <X size={15} />
          </button>
        </div>

        <div style={{ padding: '18px 22px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Key metrics grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
            <MetricCard
              icon={<Users size={13} />}
              label="Affected"
              value={liveIncident.peopleAffected.toLocaleString()}
              color="var(--orange)"
            />
            <MetricCard
              icon={<FileText size={13} />}
              label="SOS Reports"
              value={liveIncident.communityReports}
              color="var(--accent-blue)"
            />
            <MetricCard
              icon={<Radio size={13} />}
              label="Responders"
              value={dispatched ? `${liveIncident.nearbyResponders} active` : `${liveIncident.nearbyResponders} nearby`}
              color="var(--green)"
            />
          </div>

          {/* AI Decision Intelligence Block */}
          <div
            style={{
              background: 'rgba(10, 18, 34, 0.75)',
              border: '1px solid rgba(56, 189, 248, 0.2)',
              borderRadius: 8,
              padding: '12px 14px',
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <Cpu size={13} color="var(--accent-blue)" />
                <span style={{ fontSize: '0.6875rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--accent-blue)' }}>
                  AI Decision Matrix
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>Priority Score:</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: scoreColor }}>
                  {calculatedScore}/100
                </span>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>(Conf: 94%)</span>
              </div>
            </div>

            {/* Assessment rationale */}
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.55, margin: 0 }}>
              {liveIncident.aiAssessment}
            </p>

            {/* Evaluation Factors */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 6, paddingTop: 4, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <FactorTag label="Inundation Rate" value="Surging" color="var(--red)" />
              <FactorTag label="Vulnerability" value="Dense Residential" color="var(--orange)" />
              <FactorTag label="Access Corridors" value="1 Road Blocked" color="var(--yellow)" />
              <FactorTag label="Mutual Aid" value="SDRF Standby" color="var(--green)" />
            </div>
          </div>

          {/* Recommended Action */}
          <div
            style={{
              background: 'rgba(249,115,22,0.08)',
              border: '1px solid rgba(249,115,22,0.25)',
              borderRadius: 8,
              padding: '11px 14px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.6875rem', fontWeight: 800, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--orange)', marginBottom: 4 }}>
              <ArrowRight size={12} />
              AI Recommended Tactical Action
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-primary)', lineHeight: 1.5, margin: 0, fontWeight: 500 }}>
              {liveIncident.recommendedAction}
            </p>
          </div>

          {/* Candidate Responder preview */}
          {availableResponder && !dispatched && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 12px',
                borderRadius: 6,
                background: 'rgba(34, 197, 94, 0.08)',
                border: '1px solid rgba(34, 197, 94, 0.25)',
                fontSize: '0.75rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <ShieldCheck size={14} color="var(--green)" />
                <span style={{ color: 'var(--text-secondary)' }}>
                  Nearest Match: <strong style={{ color: 'var(--text-primary)' }}>{availableResponder.name}</strong> ({availableResponder.type})
                </span>
              </div>
              <span style={{ color: 'var(--green)', fontWeight: 600 }}>ETA {availableResponder.eta}</span>
            </div>
          )}

          {/* Action Button */}
          <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
            {dispatched ? (
              <div
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  padding: '11px',
                  borderRadius: 8,
                  background: 'var(--green-dim)',
                  border: '1px solid rgba(34,197,94,0.4)',
                  color: 'var(--green)',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                }}
              >
                <CheckCircle size={16} />
                {dispatchedName || 'Responder'} Dispatched — En Route
              </div>
            ) : (
              <button
                className="btn btn-primary"
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  padding: '11px',
                  background: 'linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)',
                }}
                onClick={handleDispatch}
                disabled={!canDispatch}
              >
                <Radio size={15} />
                {!availableResponder ? 'No Responders Currently Available' : `Dispatch Nearest Responder (${availableResponder.name})`}
              </button>
            )}
            <button className="btn btn-ghost" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ icon, label, value, color }) {
  return (
    <div
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 8,
        padding: '10px 12px',
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 5, color }}>
        {icon}
        <span style={{ fontSize: '0.65rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {label}
        </span>
      </div>
      <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', lineHeight: 1 }}>
        {value}
      </div>
    </div>
  );
}

function FactorTag({ label, value, color }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.6875rem' }}>
      <span style={{ color: 'var(--text-muted)' }}>{label}</span>
      <span style={{ color, fontWeight: 600 }}>{value}</span>
    </div>
  );
}
