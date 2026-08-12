"use client";

import { useActionState, useState } from "react";
import { loginAction } from "../actions";
import { I } from "@/components/admin/ui";

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, null);
  const [email, setEmail] = useState("admin@prasannatrends.in");
  const [password, setPassword] = useState("admin123");
  const [show, setShow] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* brand side */}
      <div className="relative hidden w-[46%] flex-col justify-between overflow-hidden bg-[#150f1d] p-10 lg:flex">
        <div className="pointer-events-none absolute -left-24 top-10 h-80 w-80 rounded-full bg-amber-500/20 blur-[110px]" />
        <div className="pointer-events-none absolute -right-16 bottom-0 h-80 w-80 rounded-full bg-rose-500/15 blur-[120px]" />

        <div className="relative flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#2a1f33] to-[#120c19] ring-1 ring-amber-400/40">
            <span className="bg-gradient-to-br from-[#f6e6bb] to-[#c99b3f] bg-clip-text text-[15px] font-bold text-transparent">PT</span>
          </span>
          <div>
            <p className="text-[16px] font-semibold text-white">Prasanna Trends</p>
            <p className="text-[10.5px] uppercase tracking-[0.2em] text-amber-400/70">Admin panel</p>
          </div>
        </div>

        <div className="relative">
          <h2 className="max-w-sm font-serif text-[30px] font-semibold leading-tight text-white">
            Run the entire app from one place.
          </h2>
          <p className="mt-3 max-w-md text-[13px] leading-relaxed text-white/50">
            Categories, designs, subscription plans, banners, languages, notifications and reports — every change
            reaches the mobile app instantly, with no new release.
          </p>
          <div className="mt-7 grid max-w-md grid-cols-2 gap-3">
            {[
              ["Dynamic catalogue", "Categories → collections → designs"],
              ["Premium control", "Watermarks, plans, download limits"],
              ["Payments & refunds", "Reconcile every transaction"],
              ["Audit trail", "Who changed what, and when"],
            ].map(([t, s]) => (
              <div key={t} className="rounded-xl bg-white/5 p-3 ring-1 ring-inset ring-white/10">
                <p className="text-[12px] font-semibold text-white">{t}</p>
                <p className="mt-0.5 text-[10.5px] leading-snug text-white/45">{s}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-[10.5px] text-white/30">© {new Date().getFullYear()} Prasanna Trends · Pune, India</p>
      </div>

      {/* form side */}
      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-[380px]">
          <div className="mb-7 lg:hidden">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#150f1d] ring-1 ring-amber-400/40">
              <span className="bg-gradient-to-br from-[#f6e6bb] to-[#c99b3f] bg-clip-text text-[15px] font-bold text-transparent">PT</span>
            </span>
          </div>

          <h1 className="text-[22px] font-semibold tracking-tight text-slate-900">Sign in to admin</h1>
          <p className="mt-1.5 text-[13px] text-slate-500">Use your administrator credentials to continue.</p>

          <form action={action} className="mt-7 space-y-3.5">
            <label className="block">
              <span className="mb-1 block text-[12px] font-medium text-slate-700">Email address</span>
              <input
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="username"
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-[13.5px] outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-[12px] font-medium text-slate-700">Password</span>
              <span className="relative block">
                <input
                  name="password"
                  type={show ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 pr-10 text-[13.5px] outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                />
                <button
                  type="button"
                  onClick={() => setShow((s) => !s)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1.5 text-slate-400 hover:text-slate-700"
                >
                  <I n="eye" />
                </button>
              </span>
            </label>

            {state?.error ? (
              <p className="flex items-start gap-2 rounded-lg bg-rose-50 px-3 py-2 text-[12px] text-rose-700 ring-1 ring-inset ring-rose-200">
                <I n="close" c="mt-0.5 h-3.5 w-3.5 shrink-0" />
                {state.error}
              </p>
            ) : null}

            <div className="flex items-center justify-between pt-0.5">
              <label className="flex items-center gap-2 text-[12px] text-slate-600">
                <input type="checkbox" defaultChecked className="h-3.5 w-3.5 rounded border-slate-300 accent-amber-500" />
                Keep me signed in
              </label>
              <button type="button" className="text-[12px] font-semibold text-amber-700 hover:underline">
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={pending}
              className="mt-1 flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 py-2.5 text-[13.5px] font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
            >
              {pending ? <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" /> : <I n="lock" c="h-4 w-4" />}
              {pending ? "Verifying…" : "Sign in"}
            </button>
          </form>

          <div className="mt-5 rounded-lg border border-dashed border-slate-300 bg-white p-3.5">
            <p className="text-[11.5px] font-semibold text-slate-700">Demo credentials</p>
            <p className="mt-1 font-mono text-[11.5px] text-slate-500">admin@prasannatrends.in</p>
            <p className="font-mono text-[11.5px] text-slate-500">admin123</p>
          </div>

          <p className="mt-5 flex items-start gap-2 text-[10.5px] leading-relaxed text-slate-400">
            <I n="shield" c="mt-0.5 h-3.5 w-3.5 shrink-0" />
            Sessions expire after 8 hours. All login attempts, successful or failed, are recorded with IP and
            device in the audit log.
          </p>
        </div>
      </div>
    </div>
  );
}
