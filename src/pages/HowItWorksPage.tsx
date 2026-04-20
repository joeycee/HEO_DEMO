import {
  Boxes,
  Code2,
  DatabaseZap,
  Globe2,
  KeyRound,
  Layers3,
  Route,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

const architectureCards = [
  {
    title: "Frontend shell",
    icon: Layers3,
    body: "React, TypeScript, Vite, Tailwind, React Router, lucide-react, and framer-motion form the interactive operations dashboard.",
  },
  {
    title: "Typed API layer",
    icon: Code2,
    body: "The UI calls small service functions like login, getObjects, getObjectById, toggleFavourite, and getNasaSscObjects instead of fetching directly inside components.",
  },
  {
    title: "NASA proxies",
    icon: DatabaseZap,
    body: "Vite middleware reads NASA_API from .env.local, calls NASA SSC and DONKI server-side, then normalizes both responses for the React UI.",
  },
  {
    title: "3D globe",
    icon: Globe2,
    body: "Three.js renders a futuristic Earth, animated orbit paths, satellite markers, and click targets that route into satellite detail pages.",
  },
];

const buildSteps = [
  "Built a protected login flow with basic validation and fake localStorage auth.",
  "Created reusable dashboard components for stats, search, filters, badges, object cards, alerts, skeletons, and toast feedback.",
  "Defined TypeScript interfaces for auth responses, object data, risk levels, statuses, activity events, globe positions, and image history.",
  "Added local mock object data first so the UI could be polished before introducing a live external API.",
  "Added NASA SSC and DONKI server-side proxies in Vite so the browser never receives the API key.",
  "Mapped live NASA spacecraft positions into the existing SpaceObject model so the dashboard and detail pages can reuse the same components.",
  "Added DONKI solar-event timelines with heuristic satellite impact estimates and a high-risk dashboard alert.",
  "Cached DONKI responses in localStorage for fast repeat visits, then refresh the feed quietly in the background.",
  "Guarded API-backed pages against stale responses so route changes and repeated refreshes do not overwrite newer state.",
  "Added orbital loading animations so pages can render their shell while NASA and mock APIs resolve asynchronously.",
  "Lazy-loaded the Globe page so Three.js does not increase the initial dashboard bundle.",
  "Verified build, lint, and a Playwright smoke test that checks the globe canvas renders and satellite navigation works.",
];

const featureRows = [
  ["Auth", "Login saves a mock token, protected routes redirect unauthenticated users, logout clears the session."],
  ["Dashboard", "Local object catalogue supports loading, error, empty, search, status filters, stat cards, and responsive cards."],
  ["Globe", "Live NASA SSC objects are displayed around Earth with animated markers and orbit rings."],
  ["Solar Events", "NASA DONKI events load from localStorage first when fresh, then refresh from the network in the background."],
  ["Async loading", "API pages defer their initial load, ignore stale responses, and show orbital loaders while data is in flight."],
  ["Details", "Each object or satellite has metadata, timeline events, recent images, watchlist actions, and a back path."],
  ["Fallback", "If NASA SSC fails, the Globe page falls back to local demo objects; if DONKI fails, the event page shows a retryable alert."],
];

export default function HowItWorksPage() {
  return (
    <div className="grid gap-6">
      <section className="rounded-lg border border-white/10 bg-white/[0.035] p-5 backdrop-blur-xl">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-cyan-200">
          <Sparkles size={16} />
          Project walkthrough
        </div>
        <h1 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
          How This Web App Works
        </h1>
        <p className="mt-3 max-w-4xl text-sm leading-6 text-slate-400">
          This demo is structured like a frontend-focused aerospace operations tool:
          polished React UI first, typed data boundaries, realistic loading/error
          states, live NASA Satellite Situation Center positions, and NASA DONKI
          solar-weather events behind local server-side proxies.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {architectureCards.map((card) => (
          <article
            className="rounded-lg border border-white/10 bg-white/[0.045] p-5 shadow-[0_0_36px_rgba(34,211,238,0.06)] backdrop-blur-xl"
            key={card.title}
          >
            <span className="grid size-11 place-items-center rounded-lg border border-cyan-300/20 bg-cyan-300/10 text-cyan-100">
              <card.icon size={21} />
            </span>
            <h2 className="mt-4 text-lg font-semibold text-white">{card.title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">{card.body}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-5 lg:grid-cols-[0.92fr_1.08fr]">
        <article className="rounded-lg border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
          <div className="flex items-center gap-2 text-cyan-100">
            <Boxes size={19} />
            <h2 className="text-lg font-semibold text-white">What We Built</h2>
          </div>
          <ol className="mt-5 grid gap-3">
            {buildSteps.map((step, index) => (
              <li
                className="grid grid-cols-[32px_minmax(0,1fr)] gap-3 rounded-lg border border-white/10 bg-slate-950/55 p-3 text-sm leading-6 text-slate-300"
                key={step}
              >
                <span className="grid size-8 place-items-center rounded-lg border border-cyan-300/20 bg-cyan-300/10 text-xs font-bold text-cyan-100">
                  {index + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </article>

        <article className="rounded-lg border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
          <div className="flex items-center gap-2 text-cyan-100">
            <Route size={19} />
            <h2 className="text-lg font-semibold text-white">Runtime Flow</h2>
          </div>

          <div className="mt-5 grid gap-3">
            {featureRows.map(([label, body]) => (
              <div
                className="rounded-lg border border-white/10 bg-slate-950/55 p-4"
                key={label}
              >
                <h3 className="text-sm font-bold uppercase tracking-[0.16em] text-cyan-200">
                  {label}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">{body}</p>
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-lg border border-emerald-300/20 bg-emerald-300/10 p-4">
            <div className="flex items-center gap-2 text-emerald-100">
              <KeyRound size={18} />
              <h3 className="font-semibold">API key handling</h3>
            </div>
            <p className="mt-2 text-sm leading-6 text-emerald-50/80">
              `NASA_API` lives in `.env.local`. The React client calls the local
              `/api/nasa/ssc/objects` and `/api/nasa/donki/events` endpoints, and
              Vite middleware forwards the key to NASA from the server side.
            </p>
          </div>

          <div className="mt-5 rounded-lg border border-cyan-300/20 bg-cyan-300/10 p-4">
            <div className="flex items-center gap-2 text-cyan-100">
              <DatabaseZap size={18} />
              <h3 className="font-semibold">DONKI cache</h3>
            </div>
            <p className="mt-2 text-sm leading-6 text-cyan-50/80">
              Solar-event responses are cached in localStorage for 10 minutes. A
              repeat visit can render cached events immediately, while a fresh NASA
              request updates the timeline and dashboard alert in the background.
            </p>
          </div>
        </article>
      </section>

      <section className="rounded-lg border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
        <div className="flex items-center gap-2 text-cyan-100">
          <ShieldCheck size={19} />
          <h2 className="text-lg font-semibold text-white">Why This Works as a Product Demo</h2>
        </div>
        <p className="mt-3 max-w-5xl text-sm leading-6 text-slate-400">
          The project shows frontend fundamentals and product judgement at the same
          time: clean component boundaries, typed external data, thoughtful loading
          states, responsive layout, route-level code splitting, secure API-key
          handling, visual polish, and a live technical-data visualization that can
          be explained clearly to technical and non-technical stakeholders.
        </p>
      </section>
    </div>
  );
}
