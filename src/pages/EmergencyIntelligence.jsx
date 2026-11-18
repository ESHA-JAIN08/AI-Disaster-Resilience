import React, { useState } from 'react';
import {
  AlertTriangle,
  MessageSquare,
  Zap,
  ChevronRight,
  CheckCircle,
  PlusCircle,
  Cpu,
  Radio,
  Send,
  ShieldAlert,
  ArrowRight,
  Clock,
  Sparkles,
} from 'lucide-react';
import { SeverityBadge, StatusBadge } from '../components/Badges.jsx';
import IncidentDetail from '../components/IncidentDetail.jsx';
import ResponseCycleBanner from '../components/ResponseCycleBanner.jsx';
import { useApp } from '../utils/AppContext.jsx';

const URGENCY_DOT = {
  critical: 'dot-critical',
  high: 'dot-high',
  moderate: 'dot-moderate',
  low: 'dot-low',
};

const SAMPLE_REPORTS = [
  {
    text: 'Flash water ingress reached 4ft at Sinhagad residential enclave. 14 residents trapped on 1st floor.',
    location: 'Sinhagad Road, Pune',
    category: 'Flooding',
    urgency: 'critical',
    aiClass: 'critical',
    score: 92,
    reason: 'Rapid water velocity + elderly residents + 1 road submerged',
    action: 'Dispatch NDRF boat squad for immediate perimeter evacuation',
    incidentId: 'inc-001',
  },
  {
    text: 'Secondary mudslide blocking eastern approach to village. Medical convoy stalled.',
    location: 'NH-48 Sector B, Raigad',
    category: 'Infrastructure',
    urgency: 'high',
    aiClass: 'high',
    score: 82,
    reason: 'Access route obstruction + stranded medical supplies',
    action: 'Deploy earthmoving unit and SDRF clearing crew',
    incidentId: 'inc-002',
  },
  {
    text: 'Relief camp medical supplies depleted. 8 dehydration cases reported among children.',
    location: 'Community Hall, Haveli',
    category: 'Medical',
    urgency: 'high',
    aiClass: 'high',
    score: 79,
    reason: 'Vulnerable pediatric patients + depleted IV fluids',
    action: 'Dispatch Mobile Medical Unit 3 with rehydration supplies',
    incidentId: 'inc-003',
  },
];

export default function EmergencyIntelligence() {
  const {
    incidents,
    responders,
    communityReports,
    submitCommunityReport,
    dispatchResponder,
  } = useApp();

  const [selectedIncident, setSelectedIncident] = useState(null);
  const [selectedReport, setSelectedReport] = useState(communityReports[0]);
  const [activeTab, setActiveTab] = useState('incidents'); // 'incidents' | 'reports'
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [analyzingReport, setAnalyzingReport] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);

  const availableCount = responders.filter(r => r.status === 'available').length;
  const deployedCount = responders.filter(r => r.status === 'deployed').length;

  const handleSelectSample = (sample) => {
    setAnalyzingReport(sample);
    setTimeout(() => {
      const created = submitCommunityReport({
        text: sample.text,
        location: sample.location,
        category: sample.category,
        urgency: sample.urgency,
        aiClass: sample.aiClass,
        aiNote: `${sample.reason}. Action: ${sample.action}`,
        incidentId: sample.incidentId,
      });

      setAnalysisResult({
        ...sample,
        id: created.id,
      });
      setAnalyzingReport(null);
      setSelectedReport(created);
    }, 900);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* Response cycle indicator */}
      <ResponseCycleBanner currentStep="community" />

      {/* Screen Header */}
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
            <AlertTriangle size={17} color="var(--orange)" />
            <h1 style={{ fontSize: '1.05rem', margin: 0, fontWeight: 700 }}>
              Emergency & Community Intelligence
            </h1>
          </div>
          <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: 0 }}>
            Who needs help and what should responders do? AI field signal triangulation
          </p>
        </div>

        {/* Responders readiness pills & Submit Report Button */}
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 12, background: 'rgba(8,14,26,0.6)', padding: '5px 12px', borderRadius: 8, border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div className="dot dot-low" />
              <span style={{ fontSize: '0.75rem', color: 'var(--green)', fontWeight: 600 }}>{availableCount} Available</span>
            </div>
            <div style={{ width: 1, height: 14, background: 'var(--border)' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div className="dot dot-active" />
              <span style={{ fontSize: '0.75rem', color: 'var(--accent-blue)', fontWeight: 600 }}>{deployedCount} Deployed</span>
            </div>
          </div>

          <button
            className="btn btn-primary btn-sm"
            onClick={() => setShowSubmitModal(true)}
            style={{ padding: '7px 12px', fontSize: '0.75rem' }}
          >
            <PlusCircle size={14} />
            Submit Community Report
          </button>
        </div>
      </div>

      {/* Main Content Split */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Left Column: List with Tabs */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', background: 'var(--bg-surface)' }}>
            <TabButton active={activeTab === 'incidents'} onClick={() => setActiveTab('incidents')}>
              <AlertTriangle size={13} />
              Active Incidents ({incidents.length})
            </TabButton>
            <TabButton active={activeTab === 'reports'} onClick={() => setActiveTab('reports')}>
              <MessageSquare size={13} />
              Community Field Reports ({communityReports.length})
            </TabButton>
          </div>

          {/* Incidents View */}
          {activeTab === 'incidents' && (
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div className="ai-box">
                <div className="ai-label">
                  <Zap size={11} />
                  AI Tactical Incident Prioritization
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.55, margin: 0 }}>
                  Active prioritization correlates 5 emergency incidents against field reports and flood velocity. <strong>Pune Flood Zone</strong> and <strong>Raigad Landslide</strong> currently account for 78% of active life-safety risk.
                </p>
              </div>

              {incidents.map(inc => (
                <IncidentCard
                  key={inc.id}
                  incident={inc}
                  onClick={() => setSelectedIncident(inc)}
                />
              ))}
            </div>
          )}

          {/* Community Reports View */}
          {activeTab === 'reports' && (
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div
                style={{
                  background: 'rgba(56, 189, 248, 0.05)',
                  border: '1px solid rgba(56, 189, 248, 0.2)',
                  borderRadius: 8,
                  padding: '10px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--accent-blue)', letterSpacing: '0.06em' }}>
                    AI Citizen Signal Pipeline
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Reports automatically verified, clustered by coordinates, and assigned AI priority scores.
                  </div>
                </div>
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => setShowSubmitModal(true)}
                  style={{ fontSize: '0.72rem', padding: '5px 10px' }}
                >
                  <PlusCircle size={12} />
                  Test New Report
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {communityReports.map(r => (
                  <CommunityReportCard
                    key={r.id}
                    report={r}
                    onSelect={setSelectedReport}
                    selected={selectedReport?.id === r.id}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: AI Analysis & Response Workflow (The WOW Panel) */}
        <div
          style={{
            width: 340,
            flexShrink: 0,
            background: 'var(--bg-surface)',
            borderLeft: '1px solid var(--border)',
            padding: '16px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
          }}
        >
          {activeTab === 'reports' ? (
            <ReportAIWorkflowPanel
              report={selectedReport}
              responders={responders}
              onDispatch={(incId) => dispatchResponder(incId || 'inc-001')}
            />
          ) : (
            <RespondersListPanel
              responders={responders}
              incidents={incidents}
              onSelectIncident={(inc) => setSelectedIncident(inc)}
            />
          )}
        </div>
      </div>

      {/* Incident Detail Modal */}
      {selectedIncident && (
        <IncidentDetail
          incident={selectedIncident}
          onClose={() => setSelectedIncident(null)}
        />
      )}

      {/* Submit Community Report Modal with AI Analysis Workflow */}
      {showSubmitModal && (
        <SubmitReportModal
          onClose={() => {
            setShowSubmitModal(false);
            setAnalysisResult(null);
          }}
          analyzing={analyzingReport}
          analysisResult={analysisResult}
          onSelectSample={handleSelectSample}
          onDispatch={(incId) => {
            dispatchResponder(incId || 'inc-001');
            setShowSubmitModal(false);
            setAnalysisResult(null);
          }}
          availableResponders={responders.filter(r => r.status === 'available')}
        />
      )}
    </div>
  );
}

function CommunityReportCard({ report, onSelect, selected }) {
  return (
    <button
      onClick={() => onSelect(report)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 7,
        padding: '11px 13px',
        borderRadius: 8,
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
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <div className={`dot ${URGENCY_DOT[report.urgency] || 'dot-moderate'}`} style={{ marginTop: 2, flexShrink: 0 }} />
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.4 }}>
            {report.text}
          </span>
        </div>
        <ChevronRight size={14} color="var(--text-muted)" style={{ flexShrink: 0, marginTop: 2 }} />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingLeft: 14 }}>
        <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>{report.location}</span>
        <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>·</span>
        <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>{report.timeAgo}</span>
        <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>·</span>
        <SeverityBadge level={report.aiClass} />
        {report.verified && (
          <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: '0.6875rem', color: 'var(--green)' }}>
            <CheckCircle size={10} />Verified
          </span>
        )}
      </div>
    </button>
  );
}

function ReportAIWorkflowPanel({ report, responders, onDispatch }) {
  if (!report) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
        Select a community report to view AI triage
      </div>
    );
  }

  const priorityScore =
    report.urgency === 'critical' ? 92 :
      report.urgency === 'high' ? 82 :
        report.urgency === 'moderate' ? 64 : 40;

  const scoreColor =
    priorityScore >= 80 ? 'var(--red)' :
      priorityScore >= 60 ? 'var(--orange)' : 'var(--yellow)';

  const availableResponder = responders.find(r => r.status === 'available');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, animation: 'fadeIn 0.2s ease' }}>
      {/* Workflow Step Tracker */}
      <div style={{ background: 'rgba(8,14,26,0.5)', padding: '8px 12px', borderRadius: 6, border: '1px solid var(--border)' }}>
        <div style={{ fontSize: '0.625rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--accent-blue)', letterSpacing: '0.07em', marginBottom: 4 }}>
          Field-to-Dispatch AI Flow
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
          <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Report</span>
          <span>→</span>
          <span style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>AI Triage</span>
          <span>→</span>
          <span style={{ color: scoreColor, fontWeight: 700 }}>Priority {priorityScore}</span>
          <span>→</span>
          <span style={{ color: 'var(--green)', fontWeight: 600 }}>Dispatch</span>
        </div>
      </div>

      {/* Report Raw Content */}
      <div style={{ background: 'var(--bg-card)', padding: '12px 14px', borderRadius: 8, border: '1px solid var(--border)' }}>
        <div style={{ fontSize: '0.625rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 4 }}>
          {report.category} Report · {report.location}
        </div>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-primary)', margin: 0, fontStyle: 'italic', lineHeight: 1.5 }}>
          "{report.text}"
        </p>
      </div>

      {/* AI Decision Result Box */}
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
              AI Analysis Complete
            </span>
          </div>
          <span
            style={{
              padding: '2px 8px',
              borderRadius: 100,
              fontSize: '0.6875rem',
              fontWeight: 800,
              background: `${scoreColor}22`,
              color: scoreColor,
              border: `1px solid ${scoreColor}55`,
            }}
          >
            {report.aiClass.toUpperCase()}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
          <span style={{ fontSize: '1.4rem', fontWeight: 800, color: scoreColor }}>
            {priorityScore}
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>/ 100 AI Priority Score</span>
        </div>

        <div>
          <div style={{ fontSize: '0.625rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 2 }}>
            Classification Rationale
          </div>
          <p style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
            {report.aiNote || 'Water encroachment verified against elevation map. High life-safety urgency.'}
          </p>
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 8 }}>
          <div style={{ fontSize: '0.625rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--orange)', marginBottom: 3, display: 'flex', alignItems: 'center', gap: 4 }}>
            <ArrowRight size={10} />
            Recommended Action
          </div>
          <p style={{ fontSize: '0.76rem', color: 'var(--text-primary)', margin: 0, fontWeight: 500 }}>
            Dispatch nearest available rescue team to evacuate high-risk households.
          </p>
        </div>
      </div>

      {/* Direct Dispatch Trigger */}
      {availableResponder ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
            Recommended Responder: <strong style={{ color: 'var(--text-primary)' }}>{availableResponder.name}</strong> ({availableResponder.eta})
          </div>
          <button
            className="btn btn-primary"
            onClick={() => onDispatch(report.incidentId)}
            style={{ justifyContent: 'center', padding: '10px' }}
          >
            <Send size={14} />
            Dispatch {availableResponder.name}
          </button>
        </div>
      ) : (
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', padding: '8px' }}>
          All responders currently deployed to active sectors.
        </div>
      )}
    </div>
  );
}

function RespondersListPanel({ responders, incidents, onSelectIncident }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div className="section-label">Responder Force Deployment</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {responders.map(r => (
          <div
            key={r.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '10px 12px',
              borderRadius: 8,
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
            }}
          >
            <div className={`dot ${r.status === 'available' ? 'dot-low' : 'dot-active'}`} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 1 }}>
                {r.name}
              </div>
              <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                {r.type} · {r.location} {r.deployedTo ? `(Deployed)` : `(ETA ${r.eta})`}
              </div>
            </div>
            <span
              style={{
                fontSize: '0.65rem',
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: 100,
                background: r.status === 'available' ? 'var(--green-dim)' : 'rgba(56,189,248,0.12)',
                color: r.status === 'available' ? 'var(--green)' : 'var(--accent-blue)',
                border: `1px solid ${r.status === 'available' ? 'rgba(34,197,94,0.3)' : 'rgba(56,189,248,0.3)'}`,
              }}
            >
              {r.status.toUpperCase()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function IncidentCard({ incident, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        padding: '13px 15px',
        borderRadius: 10,
        textAlign: 'left',
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        cursor: 'pointer',
        width: '100%',
        transition: 'all 0.15s',
        fontFamily: 'inherit',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'var(--border-strong)';
        e.currentTarget.style.background = 'var(--bg-hover)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'var(--border)';
        e.currentTarget.style.background = 'var(--bg-card)';
      }}
    >
      <span style={{ fontSize: '1.4rem', flexShrink: 0 }}>{incident.icon}</span>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
            {incident.type}
          </span>
          <SeverityBadge level={incident.severity} />
          <StatusBadge status={incident.status} />
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 4 }}>
          {incident.location} · {incident.district}
        </div>
        <div style={{ display: 'flex', gap: 16 }}>
          <Stat label="Affected" value={incident.peopleAffected.toLocaleString()} />
          <Stat label="Reports" value={incident.communityReports} />
          <Stat label="Responders" value={`${incident.nearbyResponders} nearby`} />
          <Stat label="Updated" value={incident.updatedAt} />
        </div>
      </div>
      <ChevronRight size={16} color="var(--text-muted)" style={{ flexShrink: 0 }} />
    </button>
  );
}

function Stat({ label, value }) {
  return (
    <div>
      <div style={{ fontSize: '0.625rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text-muted)' }}>{label}</div>
      <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>{value}</div>
    </div>
  );
}

function TabButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 7,
        padding: '11px 18px',
        background: 'transparent',
        border: 'none',
        borderBottom: `2px solid ${active ? 'var(--accent-blue)' : 'transparent'}`,
        color: active ? 'var(--accent-blue)' : 'var(--text-muted)',
        fontSize: '0.8rem',
        fontWeight: active ? 700 : 500,
        cursor: 'pointer',
        transition: 'all 0.15s',
        fontFamily: 'inherit',
      }}
    >
      {children}
    </button>
  );
}

function SubmitReportModal({ onClose, analyzing, analysisResult, onSelectSample, onDispatch, availableResponders }) {
  return (
    <div className="overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal animate-fadein" style={{ width: 520, padding: 0 }}>
        {/* Header */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ fontSize: '1rem', margin: 0, fontWeight: 700 }}>
              {analysisResult ? 'AI Analysis Complete' : 'Submit Community Field Report'}
            </h2>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              Simulate citizen SOS submission into AI Decision Support Pipeline
            </div>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={onClose} style={{ padding: '6px' }}>
            ✕
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '18px 20px' }}>
          {analyzing ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '30px 20px', gap: 14 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  border: '3px solid rgba(56, 189, 248, 0.2)',
                  borderTopColor: 'var(--accent-blue)',
                  animation: 'spin 0.8s linear infinite',
                }}
              />
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--accent-blue)' }}>
                  Running Multi-Signal AI Analysis...
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>
                  Correlating geocoded elevation, water velocity, and nearest responder ETA
                </div>
              </div>
            </div>
          ) : analysisResult ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div
                style={{
                  background: 'rgba(56, 189, 248, 0.08)',
                  border: '1px solid rgba(56, 189, 248, 0.28)',
                  borderRadius: 8,
                  padding: '14px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: '0.6875rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--accent-blue)' }}>
                    AI Analysis Result
                  </span>
                  <span
                    style={{
                      padding: '2px 8px',
                      borderRadius: 100,
                      fontSize: '0.7rem',
                      fontWeight: 800,
                      background: 'rgba(239, 68, 68, 0.2)',
                      color: 'var(--red)',
                      border: '1px solid rgba(239, 68, 68, 0.4)',
                    }}
                  >
                    PRIORITY: {analysisResult.aiClass.toUpperCase()}
                  </span>
                </div>

                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--red)', marginBottom: 8 }}>
                  {analysisResult.score}/100 <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>Risk Index</span>
                </div>

                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 2, textTransform: 'uppercase', fontWeight: 600 }}>
                  Reason:
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-primary)', marginBottom: 10 }}>
                  {analysisResult.reason}
                </div>

                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 2, textTransform: 'uppercase', fontWeight: 600 }}>
                  Recommended Action:
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', fontWeight: 600 }}>
                  {analysisResult.action}
                </div>
              </div>

              {availableResponders.length > 0 && (
                <button
                  className="btn btn-primary"
                  onClick={() => onDispatch(analysisResult.incidentId)}
                  style={{ width: '100%', justifyContent: 'center', padding: '11px' }}
                >
                  <Send size={14} />
                  Dispatch Recommended Responder ({availableResponders[0].name})
                </button>
              )}

              <button className="btn btn-ghost" onClick={onClose} style={{ width: '100%', justifyContent: 'center' }}>
                Done
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Select an authentic community field scenario to trigger automated AI classification and response recommendation:
              </div>

              {SAMPLE_REPORTS.map((sample, idx) => (
                <button
                  key={idx}
                  onClick={() => onSelectSample(sample)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 6,
                    padding: '12px 14px',
                    borderRadius: 8,
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = 'var(--accent-blue)';
                    e.currentTarget.style.background = 'var(--bg-hover)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'var(--border)';
                    e.currentTarget.style.background = 'var(--bg-card)';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--accent-blue)', textTransform: 'uppercase' }}>
                      {sample.category} · {sample.location}
                    </span>
                    <span style={{ fontSize: '0.6875rem', color: 'var(--red)', fontWeight: 700 }}>
                      Expected Priority: {sample.aiClass.toUpperCase()}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-primary)', lineHeight: 1.45 }}>
                    "{sample.text}"
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
