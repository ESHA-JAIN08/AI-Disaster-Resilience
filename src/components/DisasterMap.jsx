import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { useApp } from '../utils/AppContext.jsx';
import { hospitals, shelters } from '../data/mockData.js';
import { Compass, Layers, Shield, Crosshair, Sparkles } from 'lucide-react';

const SEVERITY_COLORS = {
  critical: '#ef4444',
  high: '#f97316',
  moderate: '#eab308',
  low: '#22c55e',
};

const HAZARD_COLORS = {
  flood: { stroke: '#3b82f6', fill: '#3b82f6' },
  landslide: { stroke: '#f97316', fill: '#f97316' },
  fire: { stroke: '#ef4444', fill: '#ef4444' },
  weather: { stroke: '#a855f7', fill: '#a855f7' },
};

// Default center: Pune & Western Maharashtra
const MAHARASHTRA_CENTER = [18.82, 73.95];
const DEFAULT_ZOOM = 8;

export default function DisasterMap({
  filterHazard = 'all',
  filterSeverity = 'all',
  showIncidents = true,
  showResponders = true,
  showFacilities = true,
  showSafePoints = true,
  focusIncident = null,
  onIncidentClick,
  compactMode = false,
}) {
  const context = useApp();
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const layerGroupRef = useRef(null);
  const facilitiesVisible = showFacilities && showSafePoints;

  const [mapTheme, setMapTheme] = useState('dark'); // 'dark' | 'osm'
  const [activeLayers, setActiveLayers] = useState({
    hazards: true,
    responders: true,
    facilities: true,
  });

  const incidents = context?.incidents || [];
  const responders = context?.responders || [];
  const hazardZones = context?.hazardZones || [];

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: MAHARASHTRA_CENTER,
        zoom: DEFAULT_ZOOM,
        zoomControl: false,
        attributionControl: true,
      });

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // Layer group for dynamic items
      const layerGroup = L.layerGroup().addTo(map);
      layerGroupRef.current = layerGroup;
      mapInstanceRef.current = map;

      // Invalidate size once DOM layout is settled to prevent blank rectangular areas
      setTimeout(() => {
        map.invalidateSize();
      }, 150);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Handle Tile Layer changes (Dark Tactical vs Standard OpenStreetMap)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Remove existing tile layer if any
    map.eachLayer(layer => {
      if (layer instanceof L.TileLayer) {
        map.removeLayer(layer);
      }
    });

    const tileLayer =
      mapTheme === 'dark'
        ? L.tileLayer(
          'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png?key=cb1_561v_1_f81dfed156cacbd90f21e41c',
          {
            attribution:
              '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/" target="_blank">CARTO</a>',
            subdomains: 'abcd',
            maxZoom: 19,
          }
        )
        : L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors',
          maxZoom: 19,
        });

    tileLayer.addTo(map);
    map.invalidateSize();
  }, [mapTheme]);

  // Focus on selected incident when changed
  useEffect(() => {
    if (!mapInstanceRef.current || !focusIncident) return;
    const lat = focusIncident.lat || focusIncident.coordinates?.lat;
    const lng = focusIncident.lng || focusIncident.coordinates?.lng;
    if (lat && lng) {
      mapInstanceRef.current.flyTo([lat, lng], 11, { duration: 1.2 });
    }
  }, [focusIncident]);

  // Render Overlays (Hazards, Incidents, Responders, Facilities)
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layerGroup = layerGroupRef.current;
    if (!map || !layerGroup) return;

    layerGroup.clearLayers();

    // 1. Hazard Overlays (Circles with high-visibility fill & dashed borders)
    if (activeLayers.hazards) {
      const visibleHazards = hazardZones.filter(z => {
        if (filterHazard !== 'all' && z.type !== filterHazard) return false;
        if (filterSeverity !== 'all' && z.severity !== filterSeverity) return false;
        return true;
      });

      visibleHazards.forEach(hz => {
        if (!hz.lat || !hz.lng) return;
        const colorCfg = HAZARD_COLORS[hz.type] || HAZARD_COLORS.flood;
        const isCritical = hz.severity === 'critical';

        const circle = L.circle([hz.lat, hz.lng], {
          radius: hz.radius || 12000,
          color: colorCfg.stroke,
          fillColor: colorCfg.fill,
          fillOpacity: hz.opacity || (isCritical ? 0.35 : 0.22),
          weight: isCritical ? 2 : 1.2,
          dashArray: isCritical ? '4, 4' : null,
        });

        circle.bindPopup(`
          <div style="font-family: inherit;">
            <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; color: ${colorCfg.stroke}; margin-bottom: 2px;">
              ${hz.type} Hazard Zone
            </div>
            <div style="font-size: 13px; font-weight: 700; color: #f0f6ff; margin-bottom: 4px;">
              ${hz.label}
            </div>
            <div style="display: inline-block; padding: 2px 7px; border-radius: 4px; font-size: 10px; font-weight: 700; text-transform: uppercase; background: ${isCritical ? 'rgba(239,68,68,0.2)' : 'rgba(249,115,22,0.2)'}; color: ${isCritical ? '#ef4444' : '#f97316'}; border: 1px solid ${isCritical ? 'rgba(239,68,68,0.4)' : 'rgba(249,115,22,0.4)'};">
              Severity: ${hz.severity.toUpperCase()}
            </div>
          </div>
        `);

        layerGroup.addLayer(circle);
      });
    }

    // 2. Incident Markers (Interactive clickable pins)
    if (showIncidents) {
      const visibleIncidents = incidents.filter(inc => {
        if (filterHazard === 'flood' && inc.type !== 'Flood') return false;
        if (filterHazard === 'fire' && inc.type !== 'Fire') return false;
        if (filterHazard === 'landslide' && inc.type !== 'Landslide') return false;
        if (filterSeverity !== 'all' && inc.severity !== filterSeverity) return false;
        return true;
      });

      visibleIncidents.forEach(inc => {
        const lat = inc.lat || inc.coordinates?.lat;
        const lng = inc.lng || inc.coordinates?.lng;
        if (!lat || !lng) return;

        const isCritical = inc.severity === 'critical';
        const isHigh = inc.severity === 'high';
        const pinClass = isCritical
          ? 'marker-pin-critical'
          : isHigh
            ? 'marker-pin-high'
            : 'marker-pin-moderate';

        const customIcon = L.divIcon({
          className: 'custom-leaflet-marker',
          html: `
            <div class="marker-pin-incident ${pinClass}">
              <span>${inc.icon}</span>
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
          popupAnchor: [0, -18],
        });

        const marker = L.marker([lat, lng], { icon: customIcon });

        const popupContent = `
          <div style="font-family: inherit; min-width: 180px;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
              <span style="font-size: 14px; font-weight: 700; color: #f0f6ff;">${inc.type} — ${inc.location}</span>
              <span style="font-size: 10px; font-weight: 800; text-transform: uppercase; padding: 2px 6px; border-radius: 4px; background: ${SEVERITY_COLORS[inc.severity]}22; color: ${SEVERITY_COLORS[inc.severity]}; border: 1px solid ${SEVERITY_COLORS[inc.severity]}55;">
                ${inc.severity}
              </span>
            </div>
            <div style="font-size: 11px; color: #94a3b8; margin-bottom: 8px;">
              ${inc.district} · Status: <strong style="color: #38bdf8;">${inc.status.toUpperCase()}</strong>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; background: rgba(8,14,26,0.6); padding: 6px 8px; border-radius: 6px; margin-bottom: 10px; font-size: 11px;">
              <div>
                <div style="color: #64748b; font-size: 9px; text-transform: uppercase;">Affected</div>
                <div style="font-weight: 700; color: #f97316;">${inc.peopleAffected.toLocaleString()}</div>
              </div>
              <div>
                <div style="color: #64748b; font-size: 9px; text-transform: uppercase;">Field SOS</div>
                <div style="font-weight: 700; color: #38bdf8;">${inc.communityReports} reports</div>
              </div>
            </div>
            <div style="font-size: 11px; color: #cbd5e1; margin-bottom: 10px; line-height: 1.4;">
              ${inc.aiAssessment.slice(0, 110)}...
            </div>
            <button id="btn-popup-${inc.id}" style="width: 100%; background: #38bdf8; color: #080e1a; border: none; border-radius: 6px; padding: 6px 10px; font-size: 11px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 4px;">
              View Incident & AI Triage →
            </button>
          </div>
        `;

        marker.bindPopup(popupContent);

        marker.on('popupopen', () => {
          const btn = document.getElementById(`btn-popup-${inc.id}`);
          if (btn) {
            btn.onclick = () => {
              if (onIncidentClick) onIncidentClick(inc);
            };
          }
        });

        marker.on('click', () => {
          if (onIncidentClick) onIncidentClick(inc);
        });

        layerGroup.addLayer(marker);
      });
    }

    // 3. Responders (NDRF, SDRF, Medical, Marine)
    if (showResponders && activeLayers.responders) {
      responders.forEach(r => {
        const lat = r.lat || r.coordinates?.lat;
        const lng = r.lng || r.coordinates?.lng;
        if (!lat || !lng) return;

        const isAvailable = r.status === 'available';
        const customIcon = L.divIcon({
          className: 'custom-leaflet-marker',
          html: `
            <div class="marker-pin-responder ${isAvailable ? 'marker-responder-available' : 'marker-responder-deployed'}">
              <span>${isAvailable ? '🟢' : '🔵'}</span>
              <span>${r.name.split(' ')[0]}</span>
            </div>
          `,
          iconSize: [80, 24],
          iconAnchor: [40, 12],
          popupAnchor: [0, -14],
        });

        const marker = L.marker([lat, lng], { icon: customIcon });

        marker.bindPopup(`
          <div style="font-family: inherit; min-width: 160px;">
            <div style="font-size: 13px; font-weight: 700; color: #f0f6ff; margin-bottom: 2px;">
              ${r.name}
            </div>
            <div style="font-size: 11px; color: #94a3b8; margin-bottom: 6px;">
              Type: ${r.type} · ${r.location}
            </div>
            <div style="display: flex; align-items: center; justify-content: space-between; font-size: 11px; background: rgba(8,14,26,0.6); padding: 5px 8px; border-radius: 4px;">
              <span style="color: #64748b;">Readiness:</span>
              <strong style="color: ${isAvailable ? '#22c55e' : '#38bdf8'};">${r.status.toUpperCase()}</strong>
            </div>
            <div style="font-size: 10px; color: #94a3b8; margin-top: 6px;">
              ${isAvailable ? `Estimated Deployment ETA: ${r.eta}` : `Deployed to active sector`}
            </div>
          </div>
        `);

        layerGroup.addLayer(marker);
      });
    }

    // 4. Critical Facilities (Hospitals & Evacuation Shelters)
    if (facilitiesVisible && activeLayers.facilities) {
      // Hospitals
      hospitals.forEach(h => {
        const icon = L.divIcon({
          className: 'custom-leaflet-marker',
          html: `<div class="marker-facility">🏥 <span>${h.name.split(' ')[0]}</span></div>`,
          iconSize: [75, 22],
          iconAnchor: [37, 11],
        });
        const m = L.marker([h.lat, h.lng], { icon });
        m.bindPopup(`
          <div style="font-family: inherit;">
            <div style="font-size: 12px; font-weight: 700; color: #38bdf8;">🏥 ${h.name}</div>
            <div style="font-size: 11px; color: #94a3b8; margin: 3px 0;">${h.location}</div>
            <div style="font-size: 11px; color: #22c55e; font-weight: 600;">Capacity: ${h.capacity} (${h.status})</div>
          </div>
        `);
        layerGroup.addLayer(m);
      });

      // Shelters
      shelters.forEach(s => {
        const icon = L.divIcon({
          className: 'custom-leaflet-marker',
          html: `<div class="marker-facility" style="border-color: rgba(34,197,94,0.4);">🏠 <span>${s.name.split(' ')[0]}</span></div>`,
          iconSize: [75, 22],
          iconAnchor: [37, 11],
        });
        const m = L.marker([s.lat, s.lng], { icon });
        m.bindPopup(`
          <div style="font-family: inherit;">
            <div style="font-size: 12px; font-weight: 700; color: #22c55e;">🏠 ${s.name}</div>
            <div style="font-size: 11px; color: #94a3b8; margin: 3px 0;">${s.location}</div>
            <div style="font-size: 11px; color: #f0f6ff; font-weight: 600;">Shelter Load: ${s.capacity}</div>
          </div>
        `);
        layerGroup.addLayer(m);
      });
    }
  }, [
    incidents,
    responders,
    hazardZones,
    filterHazard,
    filterSeverity,
    showIncidents,
    showResponders,
    showFacilities,
    activeLayers,
    onIncidentClick,
  ]);

  // Center reset helper
  const handleResetView = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(MAHARASHTRA_CENTER, DEFAULT_ZOOM, { duration: 1 });
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', borderRadius: 'inherit', overflow: 'hidden' }}>
      {/* Real Geographic Map Container */}
      <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />

      {/* Top Left: GIS Intelligence Header Pill */}
      <div
        style={{
          position: 'absolute',
          top: 12,
          left: 12,
          zIndex: 500,
          background: 'rgba(9, 16, 30, 0.88)',
          border: '1px solid var(--border-strong)',
          borderRadius: 8,
          padding: '6px 12px',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent-blue)', boxShadow: '0 0 8px var(--accent-blue)' }} />
        <div>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '0.02em' }}>
            Maharashtra Geospatial Vector Map
          </div>
          <div style={{ fontSize: '0.625rem', color: 'var(--text-muted)' }}>
            Real OpenStreetMap Tiles · High-Res GIS Coordinate Overlay
          </div>
        </div>
      </div>

      {/* Top Right: Layer & Basemap Toggles */}
      <div
        style={{
          position: 'absolute',
          top: 12,
          right: 12,
          zIndex: 500,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
        }}
      >
        {/* Reset View Button */}
        <button
          className="btn btn-ghost btn-sm"
          onClick={handleResetView}
          title="Reset to Maharashtra Overview"
          style={{
            background: 'rgba(9, 16, 30, 0.88)',
            border: '1px solid var(--border)',
            backdropFilter: 'blur(8px)',
            padding: '5px 9px',
            fontSize: '0.7rem',
          }}
        >
          <Crosshair size={12} />
          Reset View
        </button>

        {/* Basemap Toggle */}
        <button
          className="btn btn-ghost btn-sm"
          onClick={() => setMapTheme(t => (t === 'dark' ? 'osm' : 'dark'))}
          style={{
            background: 'rgba(9, 16, 30, 0.88)',
            border: '1px solid var(--border)',
            backdropFilter: 'blur(8px)',
            padding: '5px 10px',
            fontSize: '0.7rem',
            color: 'var(--accent-cyan)',
          }}
        >
          <Layers size={12} />
          {mapTheme === 'dark' ? 'Dark Tactical' : 'OSM Standard'}
        </button>
      </div>

      {/* Bottom Left: Layer Filter Checkbox Pills & Legend */}
      {!compactMode && (
        <div
          style={{
            position: 'absolute',
            bottom: 14,
            left: 14,
            zIndex: 500,
            background: 'rgba(9, 16, 30, 0.92)',
            border: '1px solid var(--border)',
            borderRadius: 8,
            padding: '8px 12px',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
            boxShadow: 'var(--shadow)',
          }}
        >
          <div style={{ fontSize: '0.625rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)' }}>
            Spatial Layers & Toggles
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.7rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer', color: 'var(--text-secondary)' }}>
              <input
                type="checkbox"
                checked={activeLayers.hazards}
                onChange={e => setActiveLayers(l => ({ ...l, hazards: e.target.checked }))}
                style={{ accentColor: 'var(--accent-blue)' }}
              />
              <span>Hazard Zones</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer', color: 'var(--text-secondary)' }}>
              <input
                type="checkbox"
                checked={activeLayers.responders}
                onChange={e => setActiveLayers(l => ({ ...l, responders: e.target.checked }))}
                style={{ accentColor: 'var(--green)' }}
              />
              <span>Responders</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer', color: 'var(--text-secondary)' }}>
              <input
                type="checkbox"
                checked={activeLayers.facilities}
                onChange={e => setActiveLayers(l => ({ ...l, facilities: e.target.checked }))}
                style={{ accentColor: 'var(--accent-cyan)' }}
              />
              <span>Hospitals & Camps</span>
            </label>
          </div>
        </div>
      )}
    </div>
  );
}
