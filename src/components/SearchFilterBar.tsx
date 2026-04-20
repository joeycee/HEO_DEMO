import { Search, SlidersHorizontal } from "lucide-react";
import type { ObjectStatus } from "../types";

export type StatusFilter = "all" | ObjectStatus;

type SearchFilterBarProps = {
  search: string;
  status: StatusFilter;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: StatusFilter) => void;
};

const filters: StatusFilter[] = ["all", "active", "warning", "offline"];

export default function SearchFilterBar({
  search,
  status,
  onSearchChange,
  onStatusChange,
}: SearchFilterBarProps) {
  return (
    <section className="flex flex-col gap-3 rounded-lg border border-white/10 bg-white/[0.04] p-3 backdrop-blur-xl lg:flex-row lg:items-center lg:justify-between">
      <label className="flex min-h-12 flex-1 items-center gap-3 rounded-lg border border-white/10 bg-slate-950/70 px-3 text-slate-300 focus-within:border-cyan-300/40">
        <Search className="shrink-0 text-cyan-200" size={18} />
        <input
          className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search object name, owner, or category"
          type="search"
          value={search}
        />
      </label>

      <div className="flex flex-wrap items-center gap-2">
        <span className="mr-1 hidden items-center gap-2 text-sm text-slate-400 sm:flex">
          <SlidersHorizontal size={16} />
          Status
        </span>
        {filters.map((filter) => {
          const active = status === filter;

          return (
            <button
              className={`rounded-lg border px-3 py-2 text-sm font-semibold capitalize transition ${
                active
                  ? "border-cyan-300/40 bg-cyan-300/12 text-cyan-100 shadow-[0_0_22px_rgba(34,211,238,0.12)]"
                  : "border-white/10 bg-white/[0.04] text-slate-400 hover:border-white/20 hover:text-white"
              }`}
              key={filter}
              onClick={() => onStatusChange(filter)}
              type="button"
            >
              {filter}
            </button>
          );
        })}
      </div>
    </section>
  );
}
