import type { SolarEventRisk, SolarEventType } from "../types";

type SolarEventBadgeProps = {
  value: SolarEventRisk | SolarEventType;
  variant: "risk" | "type";
};

const riskStyles: Record<SolarEventRisk, string> = {
  low: "border-cyan-300/30 bg-cyan-300/10 text-cyan-100",
  medium: "border-amber-300/30 bg-amber-300/10 text-amber-100",
  high: "border-rose-300/40 bg-rose-400/10 text-rose-100",
};

const typeStyles: Record<SolarEventType, string> = {
  FLR: "border-yellow-300/30 bg-yellow-300/10 text-yellow-100",
  CME: "border-orange-300/30 bg-orange-300/10 text-orange-100",
  GST: "border-purple-300/30 bg-purple-300/10 text-purple-100",
  SEP: "border-rose-300/30 bg-rose-300/10 text-rose-100",
  RBE: "border-blue-300/30 bg-blue-300/10 text-blue-100",
  HSS: "border-emerald-300/30 bg-emerald-300/10 text-emerald-100",
  Notification: "border-slate-300/30 bg-slate-300/10 text-slate-200",
};

export default function SolarEventBadge({ value, variant }: SolarEventBadgeProps) {
  const styles =
    variant === "risk"
      ? riskStyles[value as SolarEventRisk]
      : typeStyles[value as SolarEventType];

  return (
    <span
      className={`inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-bold uppercase tracking-[0.14em] ${styles}`}
    >
      {value}
    </span>
  );
}
