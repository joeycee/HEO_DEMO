import {
  Activity,
  BatteryCharging,
  Camera,
  Gauge,
  MapPinned,
  Radio,
  Satellite,
  ShieldCheck,
  Sparkles,
  ThermometerSun,
} from "lucide-react";

const satelliteStats = [
  {
    label: "Health",
    value: "96%",
    detail: "Nominal bus and payload status",
    icon: ShieldCheck,
  },
  {
    label: "Orbit deviation",
    value: "0.42 km",
    detail: "Inside station-keeping tolerance",
    icon: MapPinned,
  },
  {
    label: "Last imaged",
    value: "12 min ago",
    detail: "South Pacific optical pass",
    icon: Camera,
  },
  {
    label: "Battery",
    value: "88%",
    detail: "Charging on sunlit arc",
    icon: BatteryCharging,
  },
];

const telemetryRows = [
  ["Current altitude", "548 km"],
  ["Ground track", "Aotearoa / South Pacific"],
  ["Downlink window", "21:40 NZST, 8 min"],
  ["Thermal range", "18.4 C to 31.2 C"],
  ["Attitude mode", "Nadir pointing"],
  ["Signal strength", "-72 dBm"],
];

const timeline = [
  {
    time: "10:42 NZST",
    title: "Image packet received",
    body: "Cloud-filtered coastline capture stored with 98.7% packet completeness.",
  },
  {
    time: "10:28 NZST",
    title: "Orbit fit refreshed",
    body: "Deviation dropped from 0.61 km to 0.42 km after latest tracking update.",
  },
  {
    time: "09:55 NZST",
    title: "Payload calibration",
    body: "Star tracker alignment and sensor gain checks completed nominally.",
  },
];

const tasks = [
  "Review next imaging target before uplink",
  "Confirm downlink handover with Auckland ground station",
  "Keep watching orbit deviation after the next two passes",
];

export default function MySatellitePage() {
  return (
    <div className="grid gap-6">
      <section className="overflow-hidden rounded-lg border border-white/10 bg-white/[0.035] backdrop-blur-xl">
        <div className="grid gap-6 p-5 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-center">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-cyan-200">
              <Satellite size={16} />
              Personal asset monitor
            </div>
            <h1 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
              My Satellite
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">
              A friendly operations view for Starling Cube-9, focused on health,
              imaging freshness, orbit deviation, downlink readiness, and next
              actions.
            </p>
          </div>

          <div className="rounded-lg border border-cyan-300/20 bg-cyan-300/10 p-4">
            <div className="flex items-center gap-3">
              <span className="grid size-12 place-items-center rounded-lg border border-cyan-200/25 bg-slate-950/55 text-cyan-100">
                <Sparkles size={22} />
              </span>
              <div>
                <p className="text-sm text-cyan-100/80">Current recommendation</p>
                <h2 className="font-semibold text-white">Proceed with next pass</h2>
              </div>
            </div>
            <p className="mt-3 text-sm leading-6 text-cyan-50/85">
              Health is strong, orbit deviation is low, and the downlink queue is
              below the warning threshold.
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {satelliteStats.map((stat) => (
          <article
            className="rounded-lg border border-white/10 bg-white/[0.045] p-4 shadow-[0_0_36px_rgba(34,211,238,0.06)] backdrop-blur-xl"
            key={stat.label}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm text-slate-400">{stat.label}</p>
                <strong className="mt-2 block text-3xl font-semibold text-white">
                  {stat.value}
                </strong>
              </div>
              <span className="grid size-11 place-items-center rounded-lg border border-cyan-300/20 bg-cyan-300/10 text-cyan-100">
                <stat.icon size={21} />
              </span>
            </div>
            <p className="mt-3 text-sm text-slate-500">{stat.detail}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-5 lg:grid-cols-[0.86fr_1.14fr]">
        <article className="rounded-lg border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
          <div className="flex items-center gap-2 text-cyan-100">
            <Gauge size={19} />
            <h2 className="text-lg font-semibold text-white">Live telemetry</h2>
          </div>
          <dl className="mt-5 grid gap-3">
            {telemetryRows.map(([label, value]) => (
              <div
                className="flex items-center justify-between gap-4 rounded-lg border border-white/10 bg-slate-950/55 px-3 py-3"
                key={label}
              >
                <dt className="text-sm text-slate-400">{label}</dt>
                <dd className="text-right text-sm font-semibold text-slate-100">{value}</dd>
              </div>
            ))}
          </dl>
        </article>

        <article className="rounded-lg border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
          <div className="flex items-center gap-2 text-cyan-100">
            <Activity size={19} />
            <h2 className="text-lg font-semibold text-white">Recent activity</h2>
          </div>
          <ol className="mt-5 grid gap-4">
            {timeline.map((event) => (
              <li className="relative border-l border-cyan-300/25 pl-4" key={event.title}>
                <span className="absolute -left-[5px] top-1 size-2 rounded-full bg-cyan-200 shadow-[0_0_18px_rgba(34,211,238,0.75)]" />
                <time className="text-xs font-bold uppercase tracking-[0.16em] text-cyan-200">
                  {event.time}
                </time>
                <h3 className="mt-1 font-semibold text-white">{event.title}</h3>
                <p className="mt-1 text-sm leading-6 text-slate-400">{event.body}</p>
              </li>
            ))}
          </ol>
        </article>
      </section>

      <section className="grid gap-5 lg:grid-cols-3">
        <article className="rounded-lg border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl lg:col-span-2">
          <div className="flex items-center gap-2 text-cyan-100">
            <Camera size={19} />
            <h2 className="text-lg font-semibold text-white">Last image preview</h2>
          </div>
          <div className="mt-5 overflow-hidden rounded-lg border border-white/10 bg-slate-950/55">
            <img
              alt=""
              className="aspect-[16/8] w-full object-cover"
              src="https://images.unsplash.com/photo-1446776858070-70c3d5ed6758?auto=format&fit=crop&w=1400&q=80"
            />
            <div className="p-4">
              <h3 className="font-semibold text-white">South Pacific coastal track</h3>
              <p className="mt-1 text-sm leading-6 text-slate-400">
                Captured 12 minutes ago. Image quality is clear, cloud cover is
                moderate, and the coastline edge-detection score is 91%.
              </p>
            </div>
          </div>
        </article>

        <article className="rounded-lg border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
          <div className="flex items-center gap-2 text-cyan-100">
            <Radio size={19} />
            <h2 className="text-lg font-semibold text-white">Next actions</h2>
          </div>
          <ul className="mt-5 grid gap-3">
            {tasks.map((task) => (
              <li
                className="rounded-lg border border-white/10 bg-slate-950/55 p-3 text-sm leading-6 text-slate-300"
                key={task}
              >
                {task}
              </li>
            ))}
          </ul>
          <div className="mt-5 rounded-lg border border-amber-300/20 bg-amber-300/10 p-4">
            <div className="flex items-center gap-2 text-amber-100">
              <ThermometerSun size={18} />
              <h3 className="font-semibold">Thermal note</h3>
            </div>
            <p className="mt-2 text-sm leading-6 text-amber-50/80">
              One payload bay is trending warm, but it remains 6.8 C below the
              caution threshold.
            </p>
          </div>
        </article>
      </section>
    </div>
  );
}
