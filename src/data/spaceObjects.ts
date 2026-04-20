import type { SpaceObject } from "../types";

export const spaceObjects: SpaceObject[] = [
  {
    id: "heo-aurora-17",
    name: "Aurora-17 Relay",
    status: "active",
    altitude: 35786,
    lastUpdated: "2026-04-20T09:42:00+12:00",
    riskLevel: "low",
    imageUrl:
      "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=900&q=80",
    imageHistory: [
      {
        id: "img-a17-1",
        title: "Pacific relay window",
        capturedAt: "2026-04-20 09:36 NZST",
        url: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=900&q=80",
      },
      {
        id: "img-a17-2",
        title: "Geostationary limb track",
        capturedAt: "2026-04-19 22:11 NZST",
        url: "https://images.unsplash.com/photo-1454789548928-9efd52dc4031?auto=format&fit=crop&w=900&q=80",
      },
    ],
    description:
      "Geostationary communications platform relaying high-priority orbital traffic across the Pacific corridor.",
    category: "Communications satellite",
    velocity: "3.07 km/s",
    inclination: "0.04 deg",
    owner: "HEO Operations",
    telemetryHealth: 98,
    favourite: true,
    globe: { latitude: -11.4, longitude: 171.8, orbitalRadius: 3.24 },
    timeline: [
      {
        id: "evt-a17-1",
        timestamp: "09:42 NZST",
        title: "Telemetry refresh",
        description: "Battery temperature and attitude control channels nominal.",
      },
      {
        id: "evt-a17-2",
        timestamp: "07:15 NZST",
        title: "Station keeping burn",
        description: "East-west correction completed inside expected delta-v.",
      },
      {
        id: "evt-a17-3",
        timestamp: "Yesterday",
        title: "Optical pass indexed",
        description: "New imagery packet added to the object record.",
      },
    ],
  },
  {
    id: "kepler-debris-402",
    name: "Kepler Debris 402",
    status: "warning",
    altitude: 692,
    lastUpdated: "2026-04-20T08:58:00+12:00",
    riskLevel: "high",
    imageUrl:
      "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=900&q=80",
    imageHistory: [
      {
        id: "img-k402-1",
        title: "Debris track exposure",
        capturedAt: "2026-04-20 08:56 NZST",
        url: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=900&q=80",
      },
      {
        id: "img-k402-2",
        title: "Conjunction corridor",
        capturedAt: "2026-04-20 06:28 NZST",
        url: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",
      },
    ],
    description:
      "Tracked debris fragment with elevated conjunction probability during the next two low Earth orbit passes.",
    category: "Tracked debris",
    velocity: "7.61 km/s",
    inclination: "98.7 deg",
    owner: "Catalogued object",
    telemetryHealth: 61,
    favourite: false,
    globe: { latitude: 37.2, longitude: -122.4, orbitalRadius: 2.34 },
    timeline: [
      {
        id: "evt-k402-1",
        timestamp: "08:58 NZST",
        title: "Risk model updated",
        description: "Conjunction score increased after latest orbit determination.",
      },
      {
        id: "evt-k402-2",
        timestamp: "06:30 NZST",
        title: "Observation acquired",
        description: "Short-arc optical track processed by the mock API pipeline.",
      },
    ],
  },
  {
    id: "sentinel-polaris",
    name: "Sentinel Polaris",
    status: "active",
    altitude: 824,
    lastUpdated: "2026-04-20T10:04:00+12:00",
    riskLevel: "medium",
    imageUrl:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=900&q=80",
    imageHistory: [
      {
        id: "img-sp-1",
        title: "Polar imaging pass",
        capturedAt: "2026-04-20 10:02 NZST",
        url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=900&q=80",
      },
      {
        id: "img-sp-2",
        title: "Southern ocean swath",
        capturedAt: "2026-04-20 03:41 NZST",
        url: "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?auto=format&fit=crop&w=900&q=80",
      },
    ],
    description:
      "Earth observation asset delivering polar-region image sets for environmental and infrastructure monitoring.",
    category: "Earth observation",
    velocity: "7.47 km/s",
    inclination: "97.8 deg",
    owner: "Sentinel Group",
    telemetryHealth: 91,
    favourite: false,
    globe: { latitude: 68.5, longitude: 24.2, orbitalRadius: 2.38 },
    timeline: [
      {
        id: "evt-sp-1",
        timestamp: "10:04 NZST",
        title: "Payload window complete",
        description: "Imagery pass concluded with expected downlink queue size.",
      },
      {
        id: "evt-sp-2",
        timestamp: "05:46 NZST",
        title: "Attitude trim",
        description: "Reaction wheel load balanced before high-latitude capture.",
      },
    ],
  },
  {
    id: "matariki-station",
    name: "Matariki Station Node",
    status: "offline",
    altitude: 421,
    lastUpdated: "2026-04-19T21:18:00+12:00",
    riskLevel: "critical",
    imageUrl:
      "https://images.unsplash.com/photo-1517976487492-5750f3195933?auto=format&fit=crop&w=900&q=80",
    imageHistory: [
      {
        id: "img-ms-1",
        title: "Docking node silhouette",
        capturedAt: "2026-04-19 21:16 NZST",
        url: "https://images.unsplash.com/photo-1517976487492-5750f3195933?auto=format&fit=crop&w=900&q=80",
      },
      {
        id: "img-ms-2",
        title: "Safe-mode thermal pass",
        capturedAt: "2026-04-19 18:04 NZST",
        url: "https://images.unsplash.com/photo-1457364887197-9150188c107b?auto=format&fit=crop&w=900&q=80",
      },
    ],
    description:
      "Experimental docking node currently in safe mode after a planned maintenance simulation.",
    category: "Orbital platform",
    velocity: "7.66 km/s",
    inclination: "51.6 deg",
    owner: "Research consortium",
    telemetryHealth: 24,
    favourite: false,
    globe: { latitude: -2.7, longitude: 88.6, orbitalRadius: 2.32 },
    timeline: [
      {
        id: "evt-ms-1",
        timestamp: "Yesterday",
        title: "Safe mode entered",
        description: "Primary communications paused while simulated fault handling runs.",
      },
      {
        id: "evt-ms-2",
        timestamp: "Yesterday",
        title: "Maintenance script started",
        description: "Thermal loop validation began on the secondary controller.",
      },
    ],
  },
  {
    id: "titan-lens",
    name: "Titan Lens Array",
    status: "warning",
    altitude: 20200,
    lastUpdated: "2026-04-20T07:37:00+12:00",
    riskLevel: "medium",
    imageUrl:
      "https://images.unsplash.com/photo-1543722530-d2c3201371e7?auto=format&fit=crop&w=900&q=80",
    imageHistory: [
      {
        id: "img-tl-1",
        title: "Navigation array flare",
        capturedAt: "2026-04-20 07:35 NZST",
        url: "https://images.unsplash.com/photo-1543722530-d2c3201371e7?auto=format&fit=crop&w=900&q=80",
      },
      {
        id: "img-tl-2",
        title: "Optical channel check",
        capturedAt: "2026-04-20 02:59 NZST",
        url: "https://images.unsplash.com/photo-1537420327992-d6e192287183?auto=format&fit=crop&w=900&q=80",
      },
    ],
    description:
      "Navigation augmentation array showing intermittent sensor drift in one optical channel.",
    category: "Navigation satellite",
    velocity: "3.88 km/s",
    inclination: "55.1 deg",
    owner: "AstraNav",
    telemetryHealth: 73,
    favourite: true,
    globe: { latitude: 18.9, longitude: -45.2, orbitalRadius: 2.82 },
    timeline: [
      {
        id: "evt-tl-1",
        timestamp: "07:37 NZST",
        title: "Sensor drift flagged",
        description: "Channel C deviation persisted for two consecutive samples.",
      },
      {
        id: "evt-tl-2",
        timestamp: "03:12 NZST",
        title: "Clock sync",
        description: "Timing package synchronized against the ground reference.",
      },
    ],
  },
  {
    id: "starling-cube-9",
    name: "Starling Cube-9",
    status: "active",
    altitude: 548,
    lastUpdated: "2026-04-20T10:21:00+12:00",
    riskLevel: "low",
    imageUrl:
      "https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?auto=format&fit=crop&w=900&q=80",
    imageHistory: [
      {
        id: "img-sc9-1",
        title: "CubeSat downlink pass",
        capturedAt: "2026-04-20 10:18 NZST",
        url: "https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?auto=format&fit=crop&w=900&q=80",
      },
      {
        id: "img-sc9-2",
        title: "Ocean route capture",
        capturedAt: "2026-04-20 04:52 NZST",
        url: "https://images.unsplash.com/photo-1446776858070-70c3d5ed6758?auto=format&fit=crop&w=900&q=80",
      },
    ],
    description:
      "Compact technology demonstrator running synthetic aperture imaging experiments over ocean routes.",
    category: "CubeSat",
    velocity: "7.59 km/s",
    inclination: "53.0 deg",
    owner: "Starling Labs",
    telemetryHealth: 96,
    favourite: false,
    globe: { latitude: -41.3, longitude: 174.8, orbitalRadius: 2.33 },
    timeline: [
      {
        id: "evt-sc9-1",
        timestamp: "10:21 NZST",
        title: "Downlink complete",
        description: "Experiment packet delivered with no checksum warnings.",
      },
      {
        id: "evt-sc9-2",
        timestamp: "04:55 NZST",
        title: "Tasking accepted",
        description: "Next imaging target uploaded to the mock operations queue.",
      },
    ],
  },
];
