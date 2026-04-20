import { useMemo, useState } from "react";
import { BookOpenText, Gauge, Globe2, LogOut, Radar, Satellite, Search, SunMedium } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { authStorage } from "../api/client";

const pageTargets = [
  {
    label: "Dashboard",
    path: "/dashboard",
    description: "Object catalogue, status cards, alerts",
    icon: Gauge,
    keywords: "home overview objects stats",
  },
  {
    label: "Globe",
    path: "/globe",
    description: "Live NASA satellite positions",
    icon: Globe2,
    keywords: "earth map orbit satellites world",
  },
  {
    label: "Solar Events",
    path: "/solar-events",
    description: "NASA DONKI timeline and satellite impact estimates",
    icon: SunMedium,
    keywords: "donki flare cme storm sun space weather",
  },
  {
    label: "How it works",
    path: "/how-it-works",
    description: "Architecture and data flow summary",
    icon: BookOpenText,
    keywords: "docs explanation architecture code",
  },
  {
    label: "My Satellite",
    path: "/my-satellite",
    description: "Personal satellite health and imaging view",
    icon: Satellite,
    keywords: "health image deviation orbit telemetry",
  },
];

export default function Topbar() {
  const navigate = useNavigate();
  const session = authStorage.getSession();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    authStorage.clearSession();
    navigate("/login", { replace: true });
  };

  const filteredTargets = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return pageTargets;

    return pageTargets.filter((target) =>
      `${target.label} ${target.description} ${target.keywords}`
        .toLowerCase()
        .includes(term),
    );
  }, [query]);

  const goToTarget = (path: string) => {
    navigate(path);
    setQuery("");
    setOpen(false);
  };

  const handleSearchSubmit = () => {
    const [firstTarget] = filteredTargets;
    if (firstTarget) {
      goToTarget(firstTarget.path);
    }
  };

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/70 px-4 py-3 backdrop-blur-xl sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <img
            alt="HEO"
            className="hidden h-7 w-20 object-contain sm:block lg:hidden"
            src="/HEO_blue.png"
          />
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">
              <Radar size={15} />
              Orbital awareness console
            </div>
            <p className="mt-1 truncate text-sm text-slate-400">
              Signed in as {session?.user.email ?? "operator@example.com"}
            </p>
          </div>
        </div>

        <div className="relative hidden min-w-80 md:block">
          <label className="flex min-h-10 items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 text-slate-400 focus-within:border-cyan-300/35">
            <Search className="shrink-0" size={16} />
            <input
              className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
              onBlur={() => window.setTimeout(() => setOpen(false), 140)}
              onChange={(event) => {
                setQuery(event.target.value);
                setOpen(true);
              }}
              onFocus={() => setOpen(true)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  handleSearchSubmit();
                }
              }}
              placeholder="Search pages..."
              type="search"
              value={query}
            />
          </label>

          {open ? (
            <div className="absolute left-0 right-0 top-12 z-50 overflow-hidden rounded-lg border border-white/10 bg-slate-950/95 shadow-2xl backdrop-blur-xl">
              {filteredTargets.length > 0 ? (
                filteredTargets.map((target) => (
                  <button
                    className="flex w-full items-start gap-3 border-b border-white/5 px-3 py-3 text-left transition last:border-b-0 hover:bg-cyan-300/10"
                    key={target.path}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => goToTarget(target.path)}
                    type="button"
                  >
                    <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg border border-cyan-300/20 bg-cyan-300/10 text-cyan-100">
                      <target.icon size={16} />
                    </span>
                    <span className="min-w-0">
                      <span className="block font-semibold text-white">{target.label}</span>
                      <span className="mt-0.5 block text-sm text-slate-400">
                        {target.description}
                      </span>
                    </span>
                  </button>
                ))
              ) : (
                <div className="px-3 py-4 text-sm text-slate-400">No pages found.</div>
              )}
            </div>
          ) : null}
        </div>

        <button
          className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-sm font-semibold text-slate-200 transition hover:border-rose-300/30 hover:bg-rose-400/10 hover:text-rose-100"
          onClick={handleLogout}
          type="button"
        >
          <LogOut size={16} />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}
