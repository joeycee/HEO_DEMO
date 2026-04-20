import { Clock, Gauge, Mountain, Star } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import StatusBadge from "./StatusBadge";
import type { SpaceObject } from "../types";

type ObjectCardProps = {
  object: SpaceObject;
};

const formatAltitude = (altitude: number) =>
  new Intl.NumberFormat("en", { maximumFractionDigits: 0 }).format(altitude);

const formatUpdated = (dateValue: string) =>
  new Intl.DateTimeFormat("en-NZ", {
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    month: "short",
  }).format(new Date(dateValue));

export default function ObjectCard({ object }: ObjectCardProps) {
  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ duration: 0.18 }}
      className="group overflow-hidden rounded-lg border border-white/10 bg-white/[0.045] shadow-[0_0_36px_rgba(34,211,238,0.06)] backdrop-blur-xl"
    >
      <Link className="block h-full focus:outline-none" to={`/objects/${object.id}`}>
        <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
          <img
            alt=""
            className="size-full object-cover opacity-80 transition duration-500 group-hover:scale-105 group-hover:opacity-100"
            loading="lazy"
            src={object.imageUrl}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/10 to-transparent" />
          {object.favourite ? (
            <span className="absolute right-3 top-3 grid size-9 place-items-center rounded-lg border border-amber-200/30 bg-amber-300/10 text-amber-100">
              <Star fill="currentColor" size={16} />
            </span>
          ) : null}
        </div>

        <div className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 className="truncate text-lg font-semibold text-white">{object.name}</h2>
              <p className="mt-1 text-sm text-slate-400">{object.category}</p>
            </div>
            <Gauge className="shrink-0 text-cyan-200" size={20} />
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <StatusBadge value={object.status} variant="status" />
            <StatusBadge value={object.riskLevel} variant="risk" />
          </div>

          <dl className="mt-5 grid gap-3 text-sm text-slate-300">
            <div className="flex items-center justify-between gap-3">
              <dt className="flex items-center gap-2 text-slate-500">
                <Mountain size={15} />
                Altitude
              </dt>
              <dd className="font-semibold text-slate-100">{formatAltitude(object.altitude)} km</dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="flex items-center gap-2 text-slate-500">
                <Clock size={15} />
                Updated
              </dt>
              <dd className="font-semibold text-slate-100">{formatUpdated(object.lastUpdated)}</dd>
            </div>
          </dl>
        </div>
      </Link>
    </motion.article>
  );
}
