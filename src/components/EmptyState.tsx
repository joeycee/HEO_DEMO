import { SearchX } from "lucide-react";

type EmptyStateProps = {
  title: string;
  message: string;
};

export default function EmptyState({ title, message }: EmptyStateProps) {
  return (
    <div className="rounded-lg border border-dashed border-white/15 bg-white/[0.03] px-6 py-14 text-center">
      <SearchX className="mx-auto text-slate-500" size={38} />
      <h2 className="mt-4 text-xl font-semibold text-white">{title}</h2>
      <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-400">{message}</p>
    </div>
  );
}
