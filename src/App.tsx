import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { authStorage } from "./api/client";
import AppLayout from "./layout/AppLayout";
import DashboardPage from "./pages/DashboardPage";
import HowItWorksPage from "./pages/HowItWorksPage";
import LoginPage from "./pages/LoginPage";
import MySatellitePage from "./pages/MySatellitePage";
import ObjectDetailPage from "./pages/ObjectDetailPage";
import SolarEventsPage from "./pages/SolarEventsPage";

const GlobePage = lazy(() => import("./pages/GlobePage"));

function ProtectedRoute() {
  const session = authStorage.getSession();

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return <AppLayout />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route
          path="/globe"
          element={
            <Suspense
              fallback={
                <div className="min-h-[560px] animate-pulse rounded-lg border border-white/10 bg-slate-900/70" />
              }
            >
              <GlobePage />
            </Suspense>
          }
        />
        <Route path="/solar-events" element={<SolarEventsPage />} />
        <Route path="/how-it-works" element={<HowItWorksPage />} />
        <Route path="/my-satellite" element={<MySatellitePage />} />
        <Route path="/objects/:objectId" element={<ObjectDetailPage />} />
        <Route path="/satellites/:objectId" element={<ObjectDetailPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
