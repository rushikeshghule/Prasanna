"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useTransition, type ReactNode } from "react";
import { I } from "./ui";
import { logoutAction } from "@/app/admin/actions";

const NAV = [
  { group: "Overview", items: [{ href: "/admin", label: "Dashboard", icon: "grid" }] },
  {
    group: "Content",
    items: [
      { href: "/admin/catalog", label: "Categories", icon: "layers" },
      { href: "/admin/designs", label: "Designs", icon: "image" },
      { href: "/admin/appearance", label: "Home & banners", icon: "sparkle" },
      { href: "/admin/localization", label: "Languages", icon: "globe" },
    ],
  },
  {
    group: "Commerce",
    items: [
      { href: "/admin/users", label: "Users", icon: "users" },
      { href: "/admin/billing", label: "Plans & payments", icon: "card" },
    ],
  },
  {
    group: "Engage",
    items: [
      { href: "/admin/notifications", label: "Notifications", icon: "bell" },
      { href: "/admin/content", label: "Content & support", icon: "doc" },
    ],
  },
  {
    group: "Insights",
    items: [
      { href: "/admin/reports", label: "Reports", icon: "chart" },
      { href: "/admin/logs", label: "Audit logs", icon: "shield" },
    ],
  },
];

export function Shell({ admin, children }: { admin: { name: string; email: string }; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Sidebar open={open} onClose={() => setOpen(false)} admin={admin} />
      <div className="lg:pl-[248px]">
        <TopBar onMenu={() => setOpen(true)} admin={admin} />
        <main className="mx-auto max-w-[1400px] px-4 py-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}

function Sidebar({ open, onClose, admin }: { open: boolean; onClose: () => void; admin: { name: string; email: string } }) {
  const path = usePathname();
  return (
    <>
      {open ? <button type="button" aria-label="Close menu" onClick={onClose} className="fixed inset-0 z-40 bg-slate-900/40 lg:hidden" /> : null}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[248px] flex-col bg-[#150f1d] transition-transform lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center gap-2.5 px-5 py-5">
          <span className="relative flex h-9 w-9 items-center justify-center rounded-[10px] bg-gradient-to-br from-[#2a1f33] to-[#120c19] ring-1 ring-amber-400/40">
            <span className="bg-gradient-to-br from-[#f6e6bb] to-[#c99b3f] bg-clip-text text-[13px] font-bold text-transparent">PT</span>
          </span>
          <div className="min-w-0">
            <p className="truncate text-[13.5px] font-semibold text-white">Prasanna Trends</p>
            <p className="text-[10px] uppercase tracking-[0.18em] text-amber-400/70">Admin panel</p>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 pb-4">
          {NAV.map((g) => (
            <div key={g.group} className="mb-4">
              <p className="px-2.5 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-white/30">{g.group}</p>
              {g.items.map((item) => {
                const active = item.href === "/admin" ? path === "/admin" : path.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={`mb-0.5 flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium transition-colors ${
                      active ? "bg-amber-400/15 text-amber-200 ring-1 ring-inset ring-amber-400/25" : "text-white/60 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <I n={item.icon} c="h-4 w-4 shrink-0" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="border-t border-white/10 p-3">
          <Link
            href="/"
            target="_blank"
            className="mb-2 flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[12.5px] font-medium text-white/60 transition hover:bg-white/5 hover:text-white"
          >
            <I n="external" c="h-4 w-4" />
            Open mobile app
          </Link>
          <div className="flex items-center gap-2.5 rounded-lg bg-white/5 px-2.5 py-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-400/20 text-[11px] font-bold text-amber-200">
              {admin.name.slice(0, 2).toUpperCase()}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[12px] font-semibold text-white">{admin.name}</p>
              <p className="truncate text-[10px] text-white/40">{admin.email}</p>
            </div>
            <LogoutBtn />
          </div>
        </div>
      </aside>
    </>
  );
}

function LogoutBtn() {
  const [pending, start] = useTransition();
  return (
    <button
      type="button"
      title="Log out"
      disabled={pending}
      onClick={() => start(async () => void (await logoutAction()))}
      className="rounded-md p-1.5 text-white/40 transition hover:bg-white/10 hover:text-rose-300"
    >
      <I n="logout" c="h-4 w-4" />
    </button>
  );
}

function TopBar({ onMenu, admin }: { onMenu: () => void; admin: { name: string } }) {
  const path = usePathname();
  const label =
    NAV.flatMap((g) => g.items).find((i) => (i.href === "/admin" ? path === "/admin" : path.startsWith(i.href)))?.label ?? "Dashboard";
  return (
    <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-slate-200 bg-white/85 px-4 py-3 backdrop-blur lg:px-8">
      <button type="button" onClick={onMenu} className="rounded-lg p-1.5 text-slate-600 hover:bg-slate-100 lg:hidden">
        <I n="menu" c="h-5 w-5" />
      </button>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] text-slate-400">Prasanna Trends / Admin</p>
        <h1 className="truncate text-[16px] font-semibold leading-tight text-slate-900">{label}</h1>
      </div>
      <span className="hidden items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-200 sm:inline-flex">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
        Live
      </span>
      <span className="hidden text-[12px] text-slate-500 md:block">{admin.name}</span>
    </header>
  );
}
