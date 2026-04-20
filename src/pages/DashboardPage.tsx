import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, RefreshCw, Satellite } from "lucide-react";
import { Link } from "react-router-dom";
import { getDonkiSolarEvents, getObjects } from "../api/client";
import EmptyState from "../components/EmptyState";
import InlineAlert from "../components/InlineAlert";
import ObjectCard from "../components/ObjectCard";
import OrbitalLoader from "../components/OrbitalLoader";
import SearchFilterBar, { type StatusFilter } from "../components/SearchFilterBar";
import SkeletonCard from "../components/SkeletonCard";
import SolarEventBadge from "../components/SolarEventBadge";
import StatsRow from "../components/StatsRow";
import type { SolarEvent, SpaceObject } from "../types";

export default function DashboardPage() {
  const objectRequestRef = useRef(0);
  const [objects, setObjects] = useState<SpaceObject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [highRiskSolarEvents, setHighRiskSolarEvents] = useState<SolarEvent[]>([]);

  const loadObjects = useCallback(async () => {
    const requestId = objectRequestRef.current + 1;
    objectRequestRef.current = requestId;
    const controller = new AbortController();

    setLoading(true);
    setError(null);

    try {
      const response = await getObjects({ signal: controller.signal });
      if (objectRequestRef.current !== requestId) return;
      setObjects(response.data);
    } catch (fetchError) {
      if (fetchError instanceof DOMException && fetchError.name === "AbortError") return;
      if (objectRequestRef.current !== requestId) return;
      const message =
        fetchError instanceof Error
          ? fetchError.message
          : "Unexpected object service error.";
      setError(message);
    } finally {
      if (objectRequestRef.current === requestId) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadObjects();
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
      objectRequestRef.current += 1;
    };
  }, [loadObjects]);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    const loadSolarEvents = async () => {
      try {
        const response = await getDonkiSolarEvents({
          days: 14,
          limit: 12,
          signal: controller.signal,
        });
        if (!active) return;
        setHighRiskSolarEvents(response.data.filter((event) => event.risk === "high"));
        void getDonkiSolarEvents({
          days: 14,
          limit: 12,
          cache: "network",
          signal: controller.signal,
        }).then((freshResponse) => {
          if (active) {
            setHighRiskSolarEvents(
              freshResponse.data.filter((event) => event.risk === "high"),
            );
          }
        }).catch(() => undefined);
      } catch {
        if (active) setHighRiskSolarEvents([]);
      }
    };

    const timeoutId = window.setTimeout(() => {
      void loadSolarEvents();
    }, 0);

    return () => {
      active = false;
      controller.abort();
      window.clearTimeout(timeoutId);
    };
  }, []);

  const filteredObjects = useMemo(() => {
    const term = search.trim().toLowerCase();

    return objects.filter((object) => {
      const matchesStatus = status === "all" || object.status === status;
      const matchesSearch =
        !term ||
        object.name.toLowerCase().includes(term) ||
        object.category.toLowerCase().includes(term) ||
        object.owner.toLowerCase().includes(term);

      return matchesStatus && matchesSearch;
    });
  }, [objects, search, status]);

  return (
    <div className="grid gap-6">
      <section className="flex flex-col justify-between gap-4 rounded-lg border border-white/10 bg-white/[0.035] p-5 backdrop-blur-xl lg:flex-row lg:items-end">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-cyan-200">
            <Satellite size={16} />
            Live catalogue overview
          </div>
          <h1 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
            Space Object Dashboard
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">
            Monitor status, risk, altitude, and recent activity for high-value
            orbital objects through a lightweight typed API surface.
          </p>
        </div>

        <button
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-white/10 bg-slate-950/70 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-cyan-300/30 hover:text-cyan-100"
          onClick={loadObjects}
          type="button"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </section>

      <StatsRow objects={objects} />

      {highRiskSolarEvents.length > 0 ? (
        <section className="rounded-lg border border-rose-300/25 bg-rose-400/10 p-5">
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
            <div className="flex items-start gap-3">
              <span className="mt-1 grid size-10 shrink-0 place-items-center rounded-lg border border-rose-200/30 bg-rose-200/10 text-rose-100">
                <AlertTriangle size={20} />
              </span>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-lg font-semibold text-white">
                    High-risk solar event detected
                  </h2>
                  <SolarEventBadge value="high" variant="risk" />
                </div>
                <p className="mt-2 max-w-4xl text-sm leading-6 text-rose-50/80">
                  {highRiskSolarEvents[0].title} at{" "}
                  {new Intl.DateTimeFormat("en-NZ", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  }).format(new Date(highRiskSolarEvents[0].occurredAt))}
                  . {highRiskSolarEvents[0].satelliteEffect}
                </p>
              </div>
            </div>
            <Link
              className="inline-flex min-h-11 items-center justify-center rounded-lg border border-rose-200/30 bg-rose-100/10 px-4 py-2 text-sm font-semibold text-rose-50 transition hover:bg-rose-100/20"
              to="/solar-events"
            >
              View timeline
            </Link>
          </div>
        </section>
      ) : null}

      <SearchFilterBar
        onSearchChange={setSearch}
        onStatusChange={setStatus}
        search={search}
        status={status}
      />

      {error ? <InlineAlert message={error} onRetry={loadObjects} /> : null}

      {loading ? (
        <section className="grid gap-4">
          <OrbitalLoader
            message="Fetching object telemetry while the dashboard shell stays available."
            title="Syncing space object catalogue"
          />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }, (_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        </section>
      ) : null}

      {!loading && !error && filteredObjects.length === 0 ? (
        <EmptyState
          message="Adjust the search term or switch back to All status to see the full catalogue."
          title="No objects match the current filters"
        />
      ) : null}

      {!loading && !error && filteredObjects.length > 0 ? (
        <motion.section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3" layout>
          <AnimatePresence>
            {filteredObjects.map((object) => (
              <motion.div
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                initial={{ opacity: 0, scale: 0.98 }}
                key={object.id}
                layout
              >
                <ObjectCard object={object} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.section>
      ) : null}
    </div>
  );
}
