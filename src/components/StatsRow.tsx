import { Activity, AlertTriangle, CalendarCheck, Satellite } from "lucide-react";
import { motion } from "framer-motion";
import type { SpaceObject } from "../types";

type StatsRowProps = {
  objects: SpaceObject[];
};

const isUpdatedToday = (dateValue: string) => {
  const updated = new Date(dateValue);
  const now = new Date();

  return updated.toDateString() === now.toDateString();
};

export default function StatsRow({ objects }: StatsRowProps) {
  const stats = [
    {
      label: "Total objects",
      value: objects.length,
      icon: Satellite,
      accent: "text-cyan-200",
    },
    {
      label: "Active",
      value: objects.filter((object) => object.status === "active").length,
      icon: Activity,
      accent: "text-emerald-200",
    },
    {
      label: "Warnings",
      value: objects.filter((object) => object.status === "warning").length,
      icon: AlertTriangle,
      accent: "text-amber-200",
    },
    {
      label: "Updated today",
      value: objects.filter((object) => isUpdatedToday(object.lastUpdated)).length,
      icon: CalendarCheck,
      accent: "text-blue-200",
    },
  ];

  return (
    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat, index) => (
        <motion.article
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg border border-white/10 bg-white/[0.045] p-4 shadow-[0_0_40px_rgba(34,211,238,0.08)] backdrop-blur-xl"
          initial={{ opacity: 0, y: 12 }}
          key={stat.label}
          transition={{ delay: index * 0.05, duration: 0.25 }}
        >
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm text-slate-400">{stat.label}</p>
              <strong className="mt-2 block text-3xl font-semibold text-white">
                {stat.value}
              </strong>
            </div>
            <span
              className={`grid size-11 place-items-center rounded-lg border border-white/10 bg-slate-950/70 ${stat.accent}`}
            >
              <stat.icon size={21} />
            </span>
          </div>
        </motion.article>
      ))}
    </section>
  );
}
