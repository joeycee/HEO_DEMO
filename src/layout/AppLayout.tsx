import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-[#040711] text-slate-100">
      <div className="fixed inset-0 -z-10 bg-[linear-gradient(rgba(94,234,212,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(94,234,212,0.035)_1px,transparent_1px)] bg-[size:44px_44px]" />
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(20,184,166,0.16),transparent_36%),linear-gradient(135deg,#050816_0%,#08111f_48%,#03040a_100%)]" />

      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar />
          <main className="mx-auto w-full max-w-7xl flex-1 px-4 pb-8 pt-5 sm:px-6 lg:px-8">
            <Outlet />
          </main>
          <footer className="border-t border-white/10 px-4 py-5 text-center text-xs leading-6 text-slate-500 sm:px-6 lg:px-8">
            This is an independent concept demo. I am not claiming to be HEO or
            representing HEO; this is only a demonstration of my abilities to show
            the team at HEO.
          </footer>
        </div>
      </div>
    </div>
  );
}
