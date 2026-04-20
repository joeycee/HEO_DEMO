import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AlertTriangle, RefreshCw, SunMedium, Zap } from "lucide-react";
import { getDonkiSolarEvents } from "../api/client";
import EmptyState from "../components/EmptyState";
import InlineAlert from "../components/InlineAlert";
import OrbitalLoader from "../components/OrbitalLoader";
import SkeletonCard from "../components/SkeletonCard";
import SolarEventBadge from "../components/SolarEventBadge";
import SolarEventTimeline from "../components/SolarEventTimeline";
import type { SolarEvent } from "../types";

export default function SolarEventsPage() {
  const requestRef = useRef(0);
  const [events, setEvents] = useState<SolarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(24);

  const loadEvents = useCallback(async () => {
    const requestId = requestRef.current + 1;
    requestRef.current = requestId;
    const controller = new AbortController();

    setLoading(true);
    setError(null);

    try {
      const response = await getDonkiSolarEvents({
        days: 30,
        limit: 60,
        signal: controller.signal,
      });
      if (requestRef.current !== requestId) return;
      setEvents(response.data);
      setVisibleCount(24);
      setLoading(false);

      void getDonkiSolarEvents({
        days: 30,
        limit: 60,
        cache: "network",
        signal: controller.signal,
      }).then((freshResponse) => {
        if (requestRef.current === requestId) {
          setEvents(freshResponse.data);
          setVisibleCount((current) => Math.min(current, freshResponse.data.length));
        }
      }).catch(() => undefined);
    } catch (fetchError) {
      if (fetchError instanceof DOMException && fetchError.name === "AbortError") return;
      if (requestRef.current !== requestId) return;
      const message =
        fetchError instanceof Error
          ? fetchError.message
          : "Unable to load NASA DONKI solar events.";
      setError(message);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadEvents();
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
      requestRef.current += 1;
    };
  }, [loadEvents]);

  const highRiskEvents = useMemo(
    () => events.filter((event) => event.risk === "high"),
    [events],
  );

  const eventCounts = useMemo(
    () => ({
      total: events.length,
      high: highRiskEvents.length,
      cme: events.filter((event) => event.type === "CME").length,
    }),
    [events, highRiskEvents.length],
  );

  const visibleEvents = events.slice(0, visibleCount);

  return (
    <div className="grid gap-6">
      <section className="flex flex-col justify-between gap-4 rounded-lg border border-white/10 bg-white/[0.035] p-5 backdrop-blur-xl lg:flex-row lg:items-end">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-cyan-200">
            <SunMedium size={16} />
            NASA DONKI space weather
          </div>
          <h1 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
            Solar Events
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">
            Recent solar flares, coronal mass ejections, geomagnetic storms, and
            radiation notifications from NASA DONKI, with operational impact
            estimates for Earth-orbiting satellites.
          </p>
        </div>

        <button
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-white/10 bg-slate-950/70 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-cyan-300/30 hover:text-cyan-100"
          onClick={loadEvents}
          type="button"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </section>

      <section className="grid gap-3 md:grid-cols-3">
        {[
          { label: "Total events", value: eventCounts.total, icon: SunMedium },
          { label: "High risk", value: eventCounts.high, icon: AlertTriangle },
          { label: "CME records", value: eventCounts.cme, icon: Zap },
        ].map((stat) => (
          <article
            className="rounded-lg border border-white/10 bg-white/[0.045] p-4 backdrop-blur-xl"
            key={stat.label}
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm text-slate-400">{stat.label}</p>
                <strong className="mt-2 block text-3xl font-semibold text-white">
                  {stat.value}
                </strong>
              </div>
              <span className="grid size-11 place-items-center rounded-lg border border-cyan-300/20 bg-cyan-300/10 text-cyan-100">
                <stat.icon size={21} />
              </span>
            </div>
          </article>
        ))}
      </section>

      {error ? <InlineAlert message={error} onRetry={loadEvents} /> : null}

      {loading ? (
        <section className="rounded-lg border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
          <OrbitalLoader
            message="The page shell is ready while NASA DONKI events load in the background."
            title="Loading solar event feed"
          />
          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 3 }, (_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        </section>
      ) : null}

      {!loading && !error && events.length === 0 ? (
        <EmptyState
          message="NASA DONKI did not return solar-weather events for the current 30-day window."
          title="No recent solar events found"
        />
      ) : null}

      {!loading && !error && highRiskEvents.length > 0 ? (
        <section className="rounded-lg border border-rose-300/25 bg-rose-400/10 p-5">
          <div className="flex flex-wrap items-center gap-3">
            <AlertTriangle className="text-rose-100" size={20} />
            <h2 className="text-lg font-semibold text-white">High-risk events detected</h2>
            <SolarEventBadge value="high" variant="risk" />
          </div>
          <p className="mt-2 text-sm leading-6 text-rose-50/80">
            These are heuristic risk estimates based on DONKI event strength, not
            official operational warnings.
          </p>
          <div className="mt-5">
            <SolarEventTimeline events={highRiskEvents.slice(0, 4)} compact />
          </div>
        </section>
      ) : null}

      {!loading && !error && events.length > 0 ? (
        <section className="rounded-lg border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
          <h2 className="text-lg font-semibold text-white">Event timeline</h2>
          <p className="mt-1 text-sm text-slate-400">
            Ordered by occurrence time from most recent to oldest.
          </p>
          <div className="mt-5 border-l border-cyan-300/20 pl-4">
            <SolarEventTimeline events={visibleEvents} />
          </div>
          {visibleCount < events.length ? (
            <div className="mt-5 flex justify-center">
              <button
                className="rounded-lg border border-cyan-300/25 bg-cyan-300/10 px-4 py-2 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-300/15"
                onClick={() => setVisibleCount((current) => Math.min(events.length, current + 24))}
                type="button"
              >
                View more events
              </button>
            </div>
          ) : null}
        </section>
      ) : null}
    </div>
  );
}
