import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Globe2, Radio, Satellite, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getNasaSscObjects, getObjects } from "../api/client";
import GlobeScene from "../components/GlobeScene";
import InlineAlert from "../components/InlineAlert";
import OrbitalLoader from "../components/OrbitalLoader";
import SkeletonCard from "../components/SkeletonCard";
import StatusBadge from "../components/StatusBadge";
import type { SpaceObject } from "../types";

export default function GlobePage() {
  const navigate = useNavigate();
  const requestRef = useRef(0);
  const [objects, setObjects] = useState<SpaceObject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<"nasa" | "mock">("nasa");

  const loadObjects = useCallback(async () => {
    const requestId = requestRef.current + 1;
    requestRef.current = requestId;
    const controller = new AbortController();

    setLoading(true);
    setError(null);

    try {
      const response = await getNasaSscObjects({ signal: controller.signal });
      if (requestRef.current !== requestId) return;
      setObjects(response.data);
      setSource("nasa");
      setLoading(false);

      void getNasaSscObjects({
        signal: controller.signal,
        cache: "network",
      }).then((freshResponse) => {
        if (requestRef.current === requestId) {
          setObjects(freshResponse.data);
          setSource("nasa");
          setError(null);
        }
      }).catch(() => undefined);
    } catch (fetchError) {
      if (fetchError instanceof DOMException && fetchError.name === "AbortError") return;

      try {
        const fallback = await getObjects({ signal: controller.signal });
        if (requestRef.current !== requestId) return;
        setObjects(fallback.data);
        setSource("mock");
        const message =
          fetchError instanceof Error
            ? fetchError.message
            : "Unable to load NASA SSC live telemetry.";
        setError(`${message} Showing local demo objects instead.`);
      } catch (fallbackError) {
        if (fallbackError instanceof DOMException && fallbackError.name === "AbortError") return;
        if (requestRef.current !== requestId) return;
        setError("Unable to load live or local globe objects. Please retry.");
      }
    } finally {
      if (requestRef.current === requestId) {
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
      requestRef.current += 1;
    };
  }, [loadObjects]);

  const activeSignals = useMemo(
    () => objects.filter((object) => object.status === "active").length,
    [objects],
  );

  return (
    <div className="grid gap-5">
      <section className="flex flex-col justify-between gap-4 rounded-lg border border-cyan-300/15 bg-white/[0.035] p-5 backdrop-blur-xl lg:flex-row lg:items-end">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-cyan-200">
            <Globe2 size={16} />
            Orbital visualization
          </div>
          <h1 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
            Globe
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">
            Explore {source === "nasa" ? "live NASA SSC spacecraft" : "local demo objects"} in a futuristic Earth view. Every satellite marker
            is clickable and opens a dedicated detail record with imagery and events.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 text-center sm:min-w-96">
          <div className="rounded-lg border border-white/10 bg-slate-950/60 p-3">
            <Satellite className="mx-auto text-cyan-200" size={19} />
            <strong className="mt-2 block text-xl text-white">{objects.length}</strong>
            <span className="text-xs text-slate-500">Objects</span>
          </div>
          <div className="rounded-lg border border-white/10 bg-slate-950/60 p-3">
            <Radio className="mx-auto text-emerald-200" size={19} />
            <strong className="mt-2 block text-xl text-white">{activeSignals}</strong>
            <span className="text-xs text-slate-500">Active</span>
          </div>
          <div className="rounded-lg border border-white/10 bg-slate-950/60 p-3">
            <Zap className="mx-auto text-amber-200" size={19} />
            <strong className="mt-2 block text-xl text-white">
              {objects.filter((object) => object.riskLevel !== "low").length}
            </strong>
            <span className="text-xs text-slate-500">Watch</span>
          </div>
        </div>
      </section>

      {error ? <InlineAlert message={error} onRetry={loadObjects} /> : null}

      {loading ? (
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="grid min-h-[560px] content-center rounded-lg border border-white/10 bg-slate-900/70 p-5">
            <OrbitalLoader
              message="Loading live spacecraft positions from NASA SSC in the background."
              title="Acquiring orbital tracks"
            />
          </div>
          <div className="grid gap-4">
            <SkeletonCard />
            <SkeletonCard />
          </div>
        </div>
      ) : null}

      {!loading && !error ? (
        <section className="grid overflow-hidden rounded-lg border border-cyan-300/15 bg-slate-950/50 shadow-[0_0_80px_rgba(34,211,238,0.08)] backdrop-blur-xl lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="relative h-[560px] overflow-hidden lg:h-[636px]">
            <div className="absolute left-5 top-5 z-10 rounded-lg border border-cyan-300/20 bg-slate-950/70 px-4 py-3 text-sm text-cyan-100 backdrop-blur-xl">
              Click a satellite marker to inspect its record
            </div>
            <GlobeScene
              objects={objects}
              onSelect={(id) => navigate(`/satellites/${id}`)}
            />
          </div>

          <aside className="border-t border-white/10 bg-white/[0.03] p-4 lg:border-l lg:border-t-0">
              <h2 className="text-lg font-semibold text-white">Tracked satellites</h2>
              <p className="mt-1 text-sm text-slate-500">
                Source: {source === "nasa" ? "NASA Satellite Situation Center" : "Local fallback catalogue"}
              </p>
            <div className="mt-4 grid max-h-[560px] gap-3 overflow-y-auto pr-1">
              {objects.map((object) => (
                <button
                  className="rounded-lg border border-white/10 bg-slate-950/60 p-3 text-left transition hover:border-cyan-300/35 hover:bg-cyan-300/10"
                  key={object.id}
                  onClick={() => navigate(`/satellites/${object.id}`)}
                  type="button"
                >
                  <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
                    <div className="min-w-0">
                      <h3 className="break-words font-semibold text-white">{object.name}</h3>
                      <p className="mt-1 text-sm text-slate-500">
                        {object.globe.latitude.toFixed(1)} lat /{" "}
                        {object.globe.longitude.toFixed(1)} lon
                      </p>
                    </div>
                    <div className="sm:justify-self-end">
                      <StatusBadge value={object.status} variant="status" />
                    </div>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-400">
                    {object.category} at {object.altitude.toLocaleString()} km.
                  </p>
                </button>
              ))}
            </div>
          </aside>
        </section>
      ) : null}
    </div>
  );
}
