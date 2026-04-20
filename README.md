# Space Object Dashboard

A small full stack-style React and TypeScript demo for a frontend-focused aerospace role. It uses a typed mock API layer today, with the data and service boundaries shaped so the app can later swap to real space object, telemetry, or catalogue APIs without changing the UI surface.

## Tech Stack

- React, TypeScript, and Vite
- Tailwind CSS v4
- React Router
- lucide-react icons
- framer-motion animation
- Local mock API and mock object catalogue

## Features

- Login page with validation, fake token persistence, and protected routing
- Dark aerospace operations dashboard with glassmorphism cards and subtle glow
- Top stats for total objects, active objects, warnings, and updated today
- Search and status filters for All, Active, Warning, and Offline
- Responsive object cards with image thumbnails, badges, altitude, and last update
- Object detail view with metadata, activity timeline, watchlist toggle, and toast feedback
- Interactive Three.js Globe page with clickable satellite markers and orbit paths
- Live NASA Satellite Situation Center integration through a local Vite proxy
- NASA DONKI solar event timeline with heuristic satellite impact estimates
- localStorage cache for recent DONKI event responses with background refresh
- My Satellite operations page with health, imaging, orbit deviation, and task context
- Topbar page search that navigates across the main app sections
- async page loading with stale-response guards and orbital loading animation
- Loading skeletons, empty state, and retryable error state
- Typed API service for `login`, `getObjects`, `getObjectById`, and `toggleFavourite`

## File Structure

```text
src/
  api/
    client.ts
  components/
    EmptyState.tsx
    GlobeScene.tsx
    InlineAlert.tsx
    ObjectCard.tsx
    SearchFilterBar.tsx
    Sidebar.tsx
    SkeletonCard.tsx
    SolarEventBadge.tsx
    SolarEventTimeline.tsx
    StatsRow.tsx
    StatusBadge.tsx
    Toast.tsx
    Topbar.tsx
  data/
    spaceObjects.ts
  layout/
    AppLayout.tsx
  pages/
    DashboardPage.tsx
    GlobePage.tsx
    HowItWorksPage.tsx
    LoginPage.tsx
    MySatellitePage.tsx
    ObjectDetailPage.tsx
    SolarEventsPage.tsx
  types/
    index.ts
  App.tsx
  index.css
  main.tsx
```

## Run Locally

```bash
npm install
npm run dev
```

Open the local Vite URL shown in the terminal. The login form is prefilled with demo credentials, but any valid email and password with at least six characters will work.

## Demo Notes

The mock auth token is stored in localStorage as `space-object-dashboard-token`. Watchlist state is also persisted in localStorage.

The Globe page calls `/api/nasa/ssc/objects`, a Vite dev middleware endpoint that requests NASA SSC server-side. The Solar Events page calls `/api/nasa/donki/events`, which requests NASA DONKI event feeds server-side. Add `NASA_API=your_key` to `.env.local`; the key is not exposed to the browser.

DONKI solar-event responses are cached in localStorage for 10 minutes. Repeat visits render cached events quickly, then refresh from NASA in the background.

To demo the error state, run this in the browser console and refresh:

```js
localStorage.setItem("space-object-dashboard-force-error", "true");
```

Clear it with:

```js
localStorage.removeItem("space-object-dashboard-force-error");
```
