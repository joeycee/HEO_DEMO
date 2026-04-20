export default function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-lg border border-white/10 bg-white/[0.04] p-4">
      <div className="aspect-[16/10] rounded-md bg-slate-800/80" />
      <div className="mt-5 h-5 w-3/4 rounded bg-slate-800/80" />
      <div className="mt-4 flex gap-2">
        <div className="h-7 w-24 rounded bg-slate-800/80" />
        <div className="h-7 w-20 rounded bg-slate-800/80" />
      </div>
      <div className="mt-5 grid gap-3">
        <div className="h-4 rounded bg-slate-800/70" />
        <div className="h-4 w-2/3 rounded bg-slate-800/70" />
      </div>
    </div>
  );
}
