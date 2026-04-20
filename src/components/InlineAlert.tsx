import { AlertTriangle } from "lucide-react";

type InlineAlertProps = {
  message: string;
  onRetry?: () => void;
};

export default function InlineAlert({ message, onRetry }: InlineAlertProps) {
  return (
    <div className="flex flex-col gap-4 rounded-lg border border-rose-300/25 bg-rose-400/10 p-5 text-rose-50 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 shrink-0" size={20} />
        <div>
          <h2 className="font-semibold">Telemetry fetch failed</h2>
          <p className="mt-1 text-sm text-rose-100/80">{message}</p>
        </div>
      </div>
      {onRetry ? (
        <button
          className="rounded-lg border border-rose-200/30 bg-rose-100/10 px-4 py-2 text-sm font-semibold text-rose-50 transition hover:bg-rose-100/20"
          onClick={onRetry}
          type="button"
        >
          Retry
        </button>
      ) : null}
    </div>
  );
}
