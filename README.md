# DisasterAI — AI for Disaster Resilience & Community Safety

**Prepare Smarter. Respond Faster. Recover Better.**

---

## 🚀 How to Run the Prototype

```bash
cd C:\Users\eshac\.gemini\antigravity\scratch\disasterai
node .\node_modules\vite\bin\vite.js dev
```

Then open: **http://localhost:5173**  
*(Or preview the pre-built bundle on **http://localhost:4173**)*

---

## 🗺️ Final Master Upgrades — Real Geographic Map & AI Decision System

1. **Real Interactive Leaflet & OpenStreetMap Basemap**
   - True geographic basemap centered on **Pune & Maharashtra** (`[18.82, 73.95]`).
   - Default **Dark Tactical Basemap** (CartoDB Dark Matter, derived from OpenStreetMap) matching the command-center theme.
   - Instant toggle to **Standard OpenStreetMap** via top-right control.
   - Interactive smooth zoom, pan, focus animations (`flyTo([lat, lng])`), and layer filters.

2. **Geocoded Disaster Overlays & Markers**
   - **Incidents**: Realistic coordinates for Pune Flood (`18.5204, 73.8567`), Raigad Landslide (`18.2346, 73.4442`), Haveli Medical (`18.4529, 73.8652`), Nashik Fire (`19.9975, 73.7898`), and Mumbai Flood (`19.0657, 72.8797`).
   - **Hazard Zones**: Geographic circles with dashed borders for critical sectors (Pune Inundation Zone, Raigad Slope Instability, Nashik MIDC Fire Perimeter, Konkan Squall Belt).
   - **Responders**: Distinct status markers for NDRF Team Alpha, SDRF, Medical units (`🟢 Available` vs `🔵 Deployed`).
   - **Safe Facilities**: `🏥 Hospitals` (Sassoon, KEM, Raigad Civil) and `🏠 Shelters` (Warje Camp, Haveli Relief Base) with bed capacities.

3. **Click-to-Focus Command Center Workflow**
   - Click any incident marker or hazard zone on the real map:
     - Map smoothly pans and focuses to the exact location.
     - Right panel presents focused incident card with AI Risk Score (`87/100`), evaluation factors, and immediate action buttons:
       - **VIEW INCIDENT** (opens deep-dive modal)
       - **DISPATCH NEAREST RESPONDER** (deploys unit live).

4. **▶ Run Disaster Simulation**
   - One-click live hackathon demonstration button:
     - **Phase 1**: Flash surge detected in Mula-Mutha river basin.
     - **Phase 2**: Water level rises +1.8m, hazard circle expands and turns red (`CRITICAL`).
     - **Phase 3**: Citizen SOS reports surge, AI Risk Score jumps to `96/100`.
     - **Phase 4**: Tactical match auto-dispatches NDRF Team Alpha (marker updates live to `DEPLOYED`).

5. **Integrated Citizen-to-Dispatch AI Flow (Emergency & Community)**
   - Click **"+ Submit Community Report"** to test field SOS reports.
   - Automated AI triage produces:
     - Priority: `CRITICAL / HIGH`
     - Risk Score: `92/100`
     - Ground Rationale & Recommended Tactical Action
     - One-click **Dispatch Recommended Responder**.

6. **Recovery & Community Resilience Intelligence**
   - Dynamic **Recovery Priority Score** for community zones (e.g. Zone C: `94/100 — CRITICAL NEED`).
   - 4 factor progress bars + zone-adaptive AI recovery recommendations.
   - One-click **Allocate Priority Supplies** updating the live resource inventory.

7. **Disaster Response Cycle Pipeline**
   - Unified header banner across all modules:
     `Detect Danger → Community Signals → AI Prioritization → Dispatch Action → Recovery & Resilience`.

---

## 📺 2–3 Minute Hackathon Video Demo Script

### 1. Command Center (0:00 - 0:45)
- Open the application. Highlight the **Real Geographic Map** focused on Maharashtra.
- Switch between **Dark Tactical** and **OSM Standard** in the top right.
- Click the **Pune Flood** marker on the map:
  - Map smoothly zooms into Pune.
  - Review the focused incident card (Affected: 1,240, SOS Reports: 17, Responders: 3).
  - Note the AI Risk Score (`87/100`) and AI Recommendation.
- Click **"▶ Run Disaster Simulation"**:
  - Live progression ribbon advances through phases 1 to 4.
  - Pune hazard circle expands and escalates to **CRITICAL**.
  - Risk score recalculates to `96/100`.
  - NDRF Team Alpha auto-deploys with live status update.

### 2. Disaster Risk Intelligence (0:45 - 1:25)
- Navigate to **Disaster Risk Intelligence**.
- Select **Flood** → observe Pune and Mumbai flood polygons.
- Select **Landslide** → observe Raigad hill slope hazard overlay.
- Point out how the AI Risk Assessment panel dynamically adapts to each hazard.

### 3. Emergency & Community Intelligence (1:25 - 2:10)
- Navigate to **Emergency & Community Intelligence**.
- Click **"+ Submit Community Report"** and select the Sinhagad Road flood scenario.
- Watch the animated AI multi-signal analysis produce **AI Analysis Complete**:
  `Priority: CRITICAL · Risk Score: 92/100`.
- Click **"Dispatch Recommended Responder"** to deploy NDRF Team Alpha (`AVAILABLE → DEPLOYED`).

### 4. Recovery & Community Resilience (2:10 - 2:45)
- Navigate to **Recovery & Community Resilience**.
- Select **Zone C (Coastal Mumbai, 34% recovery)**.
- Highlight **Recovery Priority Score: 94/100 — CRITICAL NEED**.
- Review the AI recommended actions for water and shelter relief.
- Click **"Allocate Priority Supplies"** to update live relief buffers.

### 5. Closing (2:45 - 3:00)
- Return to Command Center.
- Close on tagline: *"Prepare Smarter. Respond Faster. Recover Better."*

---
*Prototype simulation — not live emergency data.*
