import { Satellite } from "lucide-react";

type OrbitalLoaderProps = {
  title: string;
  message: string;
  compact?: boolean;
};

export default function OrbitalLoader({
  title,
  message,
  compact = false,
}: OrbitalLoaderProps) {
  return (
    <div
      className={`rounded-lg border border-cyan-300/15 bg-white/[0.04] backdrop-blur-xl ${
        compact ? "p-4" : "p-5"
      }`}
    >
      <div className="flex items-center gap-4">
        <div className="relative grid size-14 shrink-0 place-items-center">
          <span className="absolute inset-0 rounded-full border border-cyan-300/20" />
          <span className="absolute inset-1 animate-spin rounded-full border border-transparent border-t-cyan-200 border-r-cyan-300/60" />
          <span className="absolute inset-3 animate-pulse rounded-full bg-cyan-300/15 shadow-[0_0_28px_rgba(34,211,238,0.28)]" />
          <Satellite className="relative text-cyan-100" size={20} />
        </div>
        <div className="min-w-0">
          <h2 className="font-semibold text-white">{title}</h2>
          <p className="mt-1 text-sm leading-6 text-slate-400">{message}</p>
        </div>
      </div>
    </div>
  );
}
