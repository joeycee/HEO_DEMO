import { BookOpenText, Gauge, Globe2, Satellite, SunMedium } from "lucide-react";
import { NavLink } from "react-router-dom";

const navItems = [
  { label: "Dashboard", icon: Gauge, to: "/dashboard" },
  { label: "Globe", icon: Globe2, to: "/globe" },
  { label: "Solar Events", icon: SunMedium, to: "/solar-events" },
  { label: "How it works", icon: BookOpenText, to: "/how-it-works" },
  { label: "My Satellite", icon: Satellite, to: "/my-satellite" },
];

export default function Sidebar() {
  return (
    <aside className="hidden w-72 shrink-0 border-r border-white/10 bg-slate-950/70 px-5 py-6 backdrop-blur-xl lg:block">
      <NavLink to="/dashboard" className="flex items-center gap-3">
        <span className="grid h-12 w-28 place-items-center rounded-lg border border-cyan-300/20 bg-white/[0.03] px-3 shadow-[0_0_24px_rgba(34,211,238,0.12)]">
          <img
            alt="HEO"
            className="max-h-8 w-full object-contain"
            src="/HEO_blue.png"
          />
        </span>
        <span>
          <span className="block text-sm font-semibold uppercase tracking-[0.22em] text-cyan-200">
            Ops
          </span>
          <span className="block text-lg font-semibold text-white">Space Objects</span>
        </span>
      </NavLink>

      <nav className="mt-10 grid gap-2">
        {navItems.map((item) => (
          <NavLink
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg border px-3 py-3 text-sm font-medium transition ${
                isActive
                  ? "border-cyan-300/25 bg-cyan-300/10 text-cyan-100"
                  : "border-transparent text-slate-400 hover:border-cyan-300/20 hover:bg-white/5 hover:text-slate-100"
              }`
            }
            key={item.label}
            to={item.to}
          >
            <item.icon size={18} />
            {item.label}
          </NavLink>
        ))}
      </nav>

    </aside>
  );
}
