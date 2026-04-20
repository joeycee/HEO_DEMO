import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  Clock,
  Eye,
  Gauge,
  Heart,
  Mountain,
  Radio,
  ShieldAlert,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { getObjectById, toggleFavourite } from "../api/client";
import InlineAlert from "../components/InlineAlert";
import OrbitalLoader from "../components/OrbitalLoader";
import StatusBadge from "../components/StatusBadge";
import Toast from "../components/Toast";
import type { SpaceObject } from "../types";

const formatAltitude = (altitude: number) =>
  new Intl.NumberFormat("en", { maximumFractionDigits: 0 }).format(altitude);

const formatUpdated = (dateValue: string) =>
  new Intl.DateTimeFormat("en-NZ", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(dateValue));

export default function ObjectDetailPage() {
  const { objectId } = useParams();
  const requestRef = useRef(0);
  const [object, setObject] = useState<SpaceObject | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const loadObject = useCallback(async () => {
    if (!objectId) return;
    const requestId = requestRef.current + 1;
    requestRef.current = requestId;
    const controller = new AbortController();

    setLoading(true);
    setError(null);

    try {
      const response = await getObjectById(objectId, { signal: controller.signal });
      if (requestRef.current !== requestId) return;
      setObject(response.data);
    } catch (fetchError) {
      if (fetchError instanceof DOMException && fetchError.name === "AbortError") return;
      if (requestRef.current !== requestId) return;
      const message =
        fetchError instanceof Error ? fetchError.message : "Unable to load object.";
      setError(message);
    } finally {
      if (requestRef.current === requestId) {
        setLoading(false);
      }
    }
  }, [objectId]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadObject();
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
      requestRef.current += 1;
    };
  }, [loadObject]);

  useEffect(() => {
    if (!toast) return;

    const timeoutId = window.setTimeout(() => setToast(null), 2600);
    return () => window.clearTimeout(timeoutId);
  }, [toast]);

  const handleToggleFavourite = async () => {
    if (!object) return;

    const response = await toggleFavourite(object.id);
    setObject({ ...object, favourite: response.data.favourite });
    setToast(response.message ?? "Watchlist updated");
  };

  if (loading) {
    return (
      <div className="grid gap-5">
        <OrbitalLoader
          message="Retrieving satellite metadata, image history, and activity timeline."
          title="Loading object record"
        />
        <div className="grid gap-5 lg:grid-cols-[1fr_0.72fr]">
          <div className="aspect-[16/10] animate-pulse rounded-lg bg-slate-800/80" />
          <div className="min-h-96 animate-pulse rounded-lg bg-slate-800/80" />
        </div>
      </div>
    );
  }

  if (error || !object) {
    return (
      <div className="grid gap-5">
        <Link
          className="inline-flex w-fit items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-slate-200 transition hover:text-cyan-100"
          to="/dashboard"
        >
          <ArrowLeft size={16} />
          Back to dashboard
        </Link>
        <InlineAlert message={error ?? "Object not found."} onRetry={loadObject} />
      </div>
    );
  }

  const metadata = [
    { label: "Altitude", value: `${formatAltitude(object.altitude)} km`, icon: Mountain },
    { label: "Velocity", value: object.velocity, icon: Gauge },
    { label: "Inclination", value: object.inclination, icon: Radio },
    { label: "Last updated", value: formatUpdated(object.lastUpdated), icon: Clock },
    { label: "Owner", value: object.owner, icon: Eye },
    { label: "Telemetry health", value: `${object.telemetryHealth}%`, icon: ShieldAlert },
  ];

  return (
    <div className="grid gap-5">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <Link
          className="inline-flex w-fit items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-cyan-300/30 hover:text-cyan-100"
          to="/dashboard"
        >
          <ArrowLeft size={16} />
          Back
        </Link>

        <button
          className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold transition ${
            object.favourite
              ? "border-amber-200/35 bg-amber-300/12 text-amber-100"
              : "border-white/10 bg-white/[0.04] text-slate-200 hover:border-amber-200/35 hover:text-amber-100"
          }`}
          onClick={handleToggleFavourite}
          type="button"
        >
          <Heart fill={object.favourite ? "currentColor" : "none"} size={17} />
          {object.favourite ? "Watching" : "Add to watchlist"}
        </button>
      </div>

      <section className="grid gap-5 lg:grid-cols-[1fr_0.72fr]">
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="overflow-hidden rounded-lg border border-white/10 bg-white/[0.04] shadow-[0_0_46px_rgba(34,211,238,0.08)] backdrop-blur-xl"
          initial={{ opacity: 0, y: 12 }}
        >
          <div className="relative aspect-[16/10] overflow-hidden bg-slate-950">
            <img alt="" className="size-full object-cover" src={object.imageUrl} />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
            <div className="absolute bottom-5 left-5 right-5">
              <div className="flex flex-wrap gap-2">
                <StatusBadge value={object.status} variant="status" />
                <StatusBadge value={object.riskLevel} variant="risk" />
              </div>
              <h1 className="mt-4 text-3xl font-semibold text-white sm:text-5xl">
                {object.name}
              </h1>
            </div>
          </div>
          <div className="p-5">
            <p className="text-base leading-7 text-slate-300">{object.description}</p>
          </div>
        </motion.div>

        <aside className="grid gap-5">
          <div className="rounded-lg border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
            <h2 className="text-lg font-semibold text-white">Object metadata</h2>
            <dl className="mt-5 grid gap-3">
              {metadata.map((item) => (
                <div
                  className="flex items-center justify-between gap-4 rounded-lg border border-white/10 bg-slate-950/55 px-3 py-3"
                  key={item.label}
                >
                  <dt className="flex min-w-0 items-center gap-2 text-sm text-slate-400">
                    <item.icon className="shrink-0 text-cyan-200" size={16} />
                    {item.label}
                  </dt>
                  <dd className="text-right text-sm font-semibold text-slate-100">{item.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
            <h2 className="text-lg font-semibold text-white">Activity timeline</h2>
            <ol className="mt-5 grid gap-4">
              {object.timeline.map((event) => (
                <li className="relative border-l border-cyan-300/25 pl-4" key={event.id}>
                  <span className="absolute -left-[5px] top-1 size-2 rounded-full bg-cyan-200 shadow-[0_0_18px_rgba(34,211,238,0.75)]" />
                  <time className="text-xs font-bold uppercase tracking-[0.16em] text-cyan-200">
                    {event.timestamp}
                  </time>
                  <h3 className="mt-1 font-semibold text-white">{event.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-400">{event.description}</p>
                </li>
              ))}
            </ol>
          </div>
        </aside>
      </section>

      <section className="rounded-lg border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-lg font-semibold text-white">Latest images</h2>
            <p className="mt-1 text-sm text-slate-400">
              Recent visual records associated with this satellite track.
            </p>
          </div>
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-200">
            {object.imageHistory.length} captures
          </span>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {object.imageHistory.map((image) => (
            <article
              className="overflow-hidden rounded-lg border border-white/10 bg-slate-950/55"
              key={image.id}
            >
              <div className="aspect-[16/9] overflow-hidden bg-slate-900">
                <img
                  alt=""
                  className="size-full object-cover transition duration-500 hover:scale-105"
                  src={image.url}
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-white">{image.title}</h3>
                <p className="mt-1 text-sm text-slate-400">{image.capturedAt}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <AnimatePresence>{toast ? <Toast message={toast} /> : null}</AnimatePresence>
    </div>
  );
}
