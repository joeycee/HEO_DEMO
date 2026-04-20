import { ExternalLink } from "lucide-react";
import SolarEventBadge from "./SolarEventBadge";
import type { SolarEvent } from "../types";

type SolarEventTimelineProps = {
  events: SolarEvent[];
  compact?: boolean;
};

const formatDateTime = (dateValue: string) =>
  new Intl.DateTimeFormat("en-NZ", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(dateValue));

export default function SolarEventTimeline({
  events,
  compact = false,
}: SolarEventTimelineProps) {
  return (
    <ol className="grid gap-4">
      {events.map((event) => (
        <li
          className="relative rounded-lg border border-white/10 bg-slate-950/55 p-4 pl-6"
          key={event.id}
        >
          <span className="absolute left-0 top-5 size-2 -translate-x-1/2 rounded-full bg-cyan-200 shadow-[0_0_18px_rgba(34,211,238,0.75)]" />
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
            <div className="min-w-0">
              <time className="text-xs font-bold uppercase tracking-[0.16em] text-cyan-200">
                {formatDateTime(event.occurredAt)}
              </time>
              <h3 className="mt-2 text-lg font-semibold text-white">{event.title}</h3>
              <p className="mt-1 text-sm text-slate-500">{event.source}</p>
            </div>
            <div className="flex flex-wrap gap-2 sm:justify-end">
              <SolarEventBadge value={event.type} variant="type" />
              <SolarEventBadge value={event.risk} variant="risk" />
            </div>
          </div>

          <div className="mt-4 grid gap-3">
            <p className="text-sm leading-6 text-slate-300">{event.summary}</p>
            <div className="rounded-lg border border-cyan-300/15 bg-cyan-300/10 p-3">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-cyan-200">
                Estimated satellite effect
              </p>
              <p className="mt-2 text-sm leading-6 text-cyan-50/85">
                {event.satelliteEffect}
              </p>
            </div>
          </div>

          {!compact ? (
            <div className="mt-4 flex flex-col justify-between gap-3 border-t border-white/10 pt-4 sm:flex-row sm:items-center">
              <p className="text-sm text-slate-400">
                <span className="font-semibold text-slate-200">{event.metricLabel}:</span>{" "}
                {event.metricValue}
              </p>
              {event.link ? (
                <a
                  className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-100 transition hover:text-cyan-50"
                  href={event.link}
                  rel="noreferrer"
                  target="_blank"
                >
                  NASA record
                  <ExternalLink size={15} />
                </a>
              ) : null}
            </div>
          ) : null}
        </li>
      ))}
    </ol>
  );
}
