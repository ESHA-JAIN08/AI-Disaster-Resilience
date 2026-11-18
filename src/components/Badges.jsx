import React from 'react';

const BADGE_MAP = {
  critical: 'badge-critical',
  high: 'badge-high',
  moderate: 'badge-moderate',
  low: 'badge-low',
  new: 'badge-critical',
  responding: 'badge-blue',
  contained: 'badge-low',
  monitoring: 'badge-gray',
  available: 'badge-low',
  deployed: 'badge-blue',
};

export function SeverityBadge({ level }) {
  const cls = BADGE_MAP[level?.toLowerCase()] || 'badge-gray';
  return <span className={`badge ${cls}`}>{level}</span>;
}

export function StatusBadge({ status }) {
  const cls = BADGE_MAP[status?.toLowerCase()] || 'badge-gray';
  return <span className={`badge ${cls}`}>{status}</span>;
}

