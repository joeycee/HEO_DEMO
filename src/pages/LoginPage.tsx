import type { FormEvent } from "react";
import { useState } from "react";
import { LockKeyhole, Mail, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { Navigate, useNavigate } from "react-router-dom";
import { authStorage, login } from "../api/client";
import LoginEarth from "../components/LoginEarth";

type LoginErrors = {
  email?: string;
  password?: string;
  form?: string;
};

const validate = (email: string, password: string): LoginErrors => {
  const errors: LoginErrors = {};

  if (!email.trim()) {
    errors.email = "Email is required.";
  } else if (!email.includes("@")) {
    errors.email = "Enter a valid email address.";
  }

  if (!password) {
    errors.password = "Password is required.";
  } else if (password.length < 6) {
    errors.password = "Password must be at least 6 characters.";
  }

  return errors;
};

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("operator@heo.example");
  const [password, setPassword] = useState("mission1");
  const [errors, setErrors] = useState<LoginErrors>({});
  const [loading, setLoading] = useState(false);

  if (authStorage.getSession()) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validate(email, password);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) return;

    setLoading(true);

    try {
      await login({ email, password });
      navigate("/dashboard", { replace: true });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Login failed. Try again.";
      setErrors({ form: message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-[#030611] px-4 py-10 text-slate-100">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(125,211,252,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(125,211,252,0.045)_1px,transparent_1px)] bg-[size:46px_46px]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(20,184,166,0.18),transparent_38%),linear-gradient(135deg,#050816_0%,#07101d_56%,#02030a_100%)]" />
      <LoginEarth />

      <motion.section
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 grid w-full max-w-5xl overflow-hidden rounded-lg border border-white/10 bg-slate-950/68 shadow-[0_0_70px_rgba(34,211,238,0.12)] backdrop-blur-2xl lg:grid-cols-[1.05fr_0.95fr]"
        initial={{ opacity: 0, y: 18 }}
        transition={{ duration: 0.32 }}
      >
        <div className="border-b border-white/10 p-8 sm:p-10 lg:border-b-0 lg:border-r">
          <div className="flex items-center gap-3">
            <span className="grid h-14 w-36 place-items-center rounded-lg border border-cyan-300/25 bg-white/[0.04] px-3 shadow-[0_0_26px_rgba(34,211,238,0.12)]">
              <img
                alt="HEO"
                className="max-h-9 w-full object-contain"
                src="/HEO_blue.png"
              />
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-cyan-200">
                Space Object Dashboard
              </p>
              <h1 className="text-3xl font-semibold text-white sm:text-4xl">
                Mission console login
              </h1>
            </div>
          </div>

          <p className="mt-7 max-w-xl text-base leading-7 text-slate-300">
            A polished React and TypeScript demo for browsing orbital objects,
            reviewing risk signals, and saving watchlist items through a typed
            mock API layer.
          </p>

          <div className="mt-8 grid gap-3 text-sm text-slate-300">
            {[
              "React Router protected routes",
              "Mock API ready to replace with live services",
              "Skeleton, empty, and error states included",
            ].map((item) => (
              <div className="flex items-center gap-3" key={item}>
                <ShieldCheck className="text-emerald-200" size={18} />
                {item}
              </div>
            ))}
          </div>
        </div>

        <form className="p-8 sm:p-10" onSubmit={handleSubmit}>
          <div>
            <h2 className="text-2xl font-semibold text-white">Operator access</h2>
            <p className="mt-2 text-sm text-slate-400">
              Use the default credentials or enter any valid email and 6+
              character password.
            </p>
          </div>

          <div className="mt-8 grid gap-5">
            <label className="grid gap-2">
              <span className="text-sm font-semibold text-slate-300">Email</span>
              <span className="flex min-h-12 items-center gap-3 rounded-lg border border-white/10 bg-white/[0.04] px-3 focus-within:border-cyan-300/40">
                <Mail className="text-cyan-200" size={18} />
                <input
                  className="min-w-0 flex-1 bg-transparent text-white outline-none placeholder:text-slate-500"
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="operator@heo.example"
                  type="email"
                  value={email}
                />
              </span>
              {errors.email ? <span className="text-sm text-rose-200">{errors.email}</span> : null}
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-semibold text-slate-300">Password</span>
              <span className="flex min-h-12 items-center gap-3 rounded-lg border border-white/10 bg-white/[0.04] px-3 focus-within:border-cyan-300/40">
                <LockKeyhole className="text-cyan-200" size={18} />
                <input
                  className="min-w-0 flex-1 bg-transparent text-white outline-none placeholder:text-slate-500"
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="6+ characters"
                  type="password"
                  value={password}
                />
              </span>
              {errors.password ? (
                <span className="text-sm text-rose-200">{errors.password}</span>
              ) : null}
            </label>
          </div>

          {errors.form ? (
            <p className="mt-5 rounded-lg border border-rose-300/25 bg-rose-400/10 px-3 py-2 text-sm text-rose-100">
              {errors.form}
            </p>
          ) : null}

          <button
            className="mt-7 min-h-12 w-full rounded-lg border border-cyan-300/35 bg-cyan-300/15 px-4 py-3 font-semibold text-cyan-50 shadow-[0_0_30px_rgba(34,211,238,0.12)] transition hover:bg-cyan-300/20 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={loading}
            type="submit"
          >
            {loading ? "Authenticating..." : "Enter dashboard"}
          </button>
        </form>
      </motion.section>
    </main>
  );
}
