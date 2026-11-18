import React from 'react';
import { Zap, ShieldAlert, Cpu, CheckCircle2, TrendingUp, AlertCircle } from 'lucide-react';

export default function AIDecisionPanel({
  score = 87,
  severityLevel = 'CRITICAL',
  recommendation = 'Deploy NDRF Team Alpha to the Pune flood zone and pre-position medical resources at Sector 7.',
  confidence = 94,
  factors = null,
  contextNote = 'Multi-signal fusion: Weather radar + 17 community SOS reports + satellite elevation mapping',
  compact = false,
}) {
  // Default decision factors if not supplied
  const defaultFactors = [
    { label: 'Hazard Severity', value: 92, level: 'Critical', color: 'var(--red)' },
    { label: 'Population Affected', value: 76, level: '1,240 exposed', color: 'var(--orange)' },
    { label: 'Responder Availability', value: 33, level: '1 of 3 nearby', color: 'var(--yellow)' },
    { label: 'Community Reports', value: 85, level: 'Surge (17 SOS)', color: 'var(--orange)' },
    { label: 'Resource Buffer', value: 38, level: 'Low Shelter Reserve', color: 'var(--yellow)' },
  ];

  const activeFactors = factors || defaultFactors;

  const scoreColor =
    score >= 80 ? 'var(--red)' :
    score >= 60 ? 'var(--orange)' :
    score >= 40 ? 'var(--yellow)' : 'var(--green)';

  return (
    <div
      style={{
        background: 'linear-gradient(145deg, rgba(17, 29, 53, 0.95) 0%, rgba(13, 21, 38, 0.98) 100%)',
        border: '1px solid rgba(56, 189, 248, 0.22)',
        borderRadius: 'var(--radius)',
        padding: compact ? '12px 14px' : '16px 18px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.36)',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Top accent line */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          background: `linear-gradient(90deg, ${scoreColor} 0%, var(--accent-blue) 100%)`,
        }}
      />

      {/* Header bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div
            style={{
              width: 20,
              height: 20,
              borderRadius: 4,
              background: 'rgba(56, 189, 248, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Cpu size={12} color="var(--accent-blue)" />
          </div>
          <span
            style={{
              fontSize: '0.6875rem',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--accent-blue)',
            }}
          >
            AI Tactical Assessment
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <span
            style={{
              fontSize: '0.65rem',
              color: 'var(--text-muted)',
              background: 'rgba(255,255,255,0.05)',
              padding: '2px 6px',
              borderRadius: 4,
            }}
          >
            Confidence: <strong style={{ color: 'var(--text-primary)' }}>{confidence}%</strong>
          </span>
        </div>
      </div>

      {/* Score and level readout */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(8, 14, 26, 0.6)',
          border: '1px solid rgba(56, 189, 248, 0.12)',
          borderRadius: 8,
          padding: '10px 14px',
        }}
      >
        <div>
          <div style={{ fontSize: '0.625rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
            Synthetic AI Risk Index
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 2 }}>
            <span style={{ fontSize: '1.65rem', fontWeight: 800, color: scoreColor, lineHeight: 1, letterSpacing: '-0.03em' }}>
              {score}
            </span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>/ 100</span>
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <span
            style={{
              display: 'inline-block',
              padding: '3px 10px',
              borderRadius: 100,
              fontSize: '0.72rem',
              fontWeight: 800,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              background: `${scoreColor}22`,
              color: scoreColor,
              border: `1px solid ${scoreColor}55`,
            }}
          >
            {severityLevel}
          </span>
          <div style={{ fontSize: '0.625rem', color: 'var(--text-muted)', marginTop: 4 }}>
            Multi-Signal Priority
          </div>
        </div>
      </div>

      {/* Multi-factor breakdown */}
      {!compact && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
          <div style={{ fontSize: '0.625rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text-muted)' }}>
            Evaluation Factors
          </div>
          {activeFactors.map(f => (
            <div key={f.label} style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.7rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>{f.label}</span>
                <span style={{ color: f.color, fontWeight: 600 }}>{f.level}</span>
              </div>
              <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 100, overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${f.value}%`,
                    background: f.color,
                    borderRadius: 100,
                    transition: 'width 0.4s ease',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Recommendation quote */}
      <div
        style={{
          background: 'rgba(56, 189, 248, 0.06)',
          borderLeft: `3px solid ${scoreColor}`,
          borderRadius: '0 6px 6px 0',
          padding: '9px 12px',
        }}
      >
        <div style={{ fontSize: '0.625rem', fontWeight: 700, color: 'var(--accent-blue)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3, display: 'flex', alignItems: 'center', gap: 4 }}>
          <Zap size={10} />
          Recommended Action
        </div>
        <p style={{ fontSize: '0.78rem', color: 'var(--text-primary)', lineHeight: 1.5, margin: 0, fontWeight: 500 }}>
          {recommendation}
        </p>
      </div>

      {/* Subtitle disclaimer */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.625rem', color: 'var(--text-muted)' }}>
        <span>AI-assisted decision engine</span>
        <span style={{ opacity: 0.75 }}>Simulated intelligence</span>
      </div>
    </div>
  );
}

