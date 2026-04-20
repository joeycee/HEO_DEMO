import type { ObjectStatus, RiskLevel } from "../types";

type StatusBadgeProps = {
  value: ObjectStatus | RiskLevel;
  variant: "status" | "risk";
};

const statusStyles: Record<ObjectStatus, string> = {
  active: "border-emerald-300/30 bg-emerald-300/10 text-emerald-200",
  warning: "border-amber-300/30 bg-amber-300/10 text-amber-100",
  offline: "border-slate-400/30 bg-slate-400/10 text-slate-300",
};

const riskStyles: Record<RiskLevel, string> = {
  low: "border-cyan-300/30 bg-cyan-300/10 text-cyan-100",
  medium: "border-blue-300/30 bg-blue-300/10 text-blue-100",
  high: "border-amber-300/30 bg-amber-300/10 text-amber-100",
  critical: "border-rose-300/40 bg-rose-400/10 text-rose-100",
};

export default function StatusBadge({ value, variant }: StatusBadgeProps) {
  const styles =
    variant === "status"
      ? statusStyles[value as ObjectStatus]
      : riskStyles[value as RiskLevel];

  return (
    <span
      className={`inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-bold uppercase tracking-[0.14em] ${styles}`}
    >
      {value}
    </span>
  );
}
