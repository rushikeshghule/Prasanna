"use client";

import { useEffect, useState, useTransition, type ReactNode } from "react";

export { money, nice, when, whenTime, statusTone } from "@/lib/format";

/* ----------------------------- icons ----------------------------- */

const P: Record<string, string[]> = {
  grid: ["M4 4.5h6.5V11H4z", "M13.5 4.5H20V11h-6.5z", "M4 13.5h6.5V20H4z", "M13.5 13.5H20V20h-6.5z"],
  layers: ["m12 3.5 8 4.2-8 4.2-8-4.2z", "m4 12 8 4.2 8-4.2", "m4 16.2 8 4.2 8-4.2"],
  image: ["M3.5 5h17v14h-17z", "m5 16.5 4-4 3 3 3.5-3.5 3.5 3.5", "M8 9.2v.01"],
  users: ["M9 4.6a3.4 3.4 0 1 0 0 6.8 3.4 3.4 0 0 0 0-6.8z", "M2.6 20a6.4 6.4 0 0 1 12.8 0", "M16.5 5.2a3.4 3.4 0 0 1 0 6.6", "M17.5 14.2A6.4 6.4 0 0 1 21.4 20"],
  card: ["M3 6.5h18v11H3z", "M3 10.2h18", "M6.5 14h3"],
  sparkle: ["M12 3.4 13.9 9l5.6 1.9-5.6 1.9L12 18.4l-1.9-5.6L4.5 10.9 10.1 9z"],
  globe: ["M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z", "M3 12h18", "M12 3c3 3.6 3 14.4 0 18", "M12 3c-3 3.6-3 14.4 0 18"],
  bell: ["M6 9.5a6 6 0 1 1 12 0c0 3.8 1.5 5.2 1.5 5.2h-15S6 13.3 6 9.5z", "M10 18.2a2 2 0 0 0 4 0"],
  doc: ["M6 3.5h8l4 4V20.5H6z", "M14 3.5V8h4"],
  chart: ["M4 20V9", "M10 20V4", "M16 20v-7", "M3 20h18"],
  shield: ["M12 3.5 5 6v6c0 4.6 3 7.6 7 8.6 4-1 7-4 7-8.6V6z", "m9.4 12 1.9 1.9 3.4-3.6"],
  logout: ["M14.5 12H4", "m8 8-4 4 4 4", "M12.5 4.5H18a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2h-5.5"],
  plus: ["M12 5v14", "M5 12h14"],
  search: ["M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14z", "m20 20-3.6-3.6"],
  close: ["M6 6l12 12", "M18 6 6 18"],
  check: ["m5 12.5 4.5 4.5L19 7"],
  edit: ["M4 20h4L19 9l-4-4L4 16z", "m14.5 5.5 4 4"],
  trash: ["M5 7h14", "M9.5 7V4.8h5V7", "m6.8 7 1 13.2h8.4L17.2 7"],
  up: ["m5 15 7-7 7 7"],
  down: ["m5 9 7 7 7-7"],
  right: ["m9.5 5 7 7-7 7"],
  left: ["m14.5 5-7 7 7 7"],
  eye: ["M2.5 12S6 6.2 12 6.2 21.5 12 21.5 12 18 17.8 12 17.8 2.5 12 2.5 12z", "M12 9.6a2.4 2.4 0 1 0 0 4.8 2.4 2.4 0 0 0 0-4.8z"],
  download: ["M12 4v11", "m8 11 4 4 4-4", "M5 19h14"],
  crown: ["M4 17.5h16l1-9.5-5.2 3.2L12 4.5 8.2 11.2 3 8l1 9.5z"],
  refresh: ["M20 12a8 8 0 1 1-2.4-5.7", "M20 4.5v4h-4"],
  flag: ["M6 21V4", "M6 4h11l-2 3.6L17 11H6"],
  filter: ["M4 6h16", "M7 12h10", "M10 18h4"],
  clock: ["M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z", "M12 7v5.4l3.4 2"],
  send: ["m4 12 16-7-7 16-2.2-6.8z", "M10.8 14.2 20 5"],
  lock: ["M5.5 11.5h13v8.5h-13z", "M8.5 11.5V8a3.5 3.5 0 1 1 7 0v3.5"],
  external: ["M14 4h6v6", "M20 4 10 14", "M18 13.5V20H4V6h6.5"],
  menu: ["M4 7h16", "M4 12h16", "M4 17h16"],
  play: ["m8 5 11 7-11 7z"],
  mail: ["M3.5 6h17v12h-17z", "m3.9 7 8.1 5.6L20.1 7"],
};

export function I({ n, c = "h-4 w-4", w = 1.7 }: { n: string; c?: string; w?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" className={c} aria-hidden>
      {(P[n] ?? P.sparkle).map((d, i) => (
        <path key={i} d={d} />
      ))}
    </svg>
  );
}

/* ----------------------------- primitives ----------------------------- */

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(16,24,40,0.05)] ${className}`}>{children}</div>;
}

export function CardHead({ title, sub, action }: { title: string; sub?: string; action?: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-3.5">
      <div className="min-w-0">
        <h3 className="text-[14px] font-semibold text-slate-900">{title}</h3>
        {sub ? <p className="mt-0.5 text-[12px] text-slate-500">{sub}</p> : null}
      </div>
      {action}
    </div>
  );
}

export function Btn({
  children,
  onClick,
  variant = "primary",
  size = "md",
  type = "button",
  disabled,
  className = "",
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "ghost" | "outline" | "danger" | "dark";
  size?: "sm" | "md";
  type?: "button" | "submit";
  disabled?: boolean;
  className?: string;
}) {
  const styles = {
    primary: "bg-amber-500 text-white hover:bg-amber-600 border-transparent",
    dark: "bg-slate-900 text-white hover:bg-slate-800 border-transparent",
    outline: "bg-white text-slate-700 border-slate-300 hover:bg-slate-50",
    ghost: "bg-transparent text-slate-600 border-transparent hover:bg-slate-100",
    danger: "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100",
  }[variant];
  const pad = size === "sm" ? "px-2.5 py-1.5 text-[12px]" : "px-3.5 py-2 text-[13px]";
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg border font-semibold transition-colors disabled:opacity-50 ${styles} ${pad} ${className}`}
    >
      {children}
    </button>
  );
}

/** Wraps a server action in a transition + pending state. */
export function ActionBtn({
  children,
  action,
  variant = "outline",
  size = "sm",
  confirm,
  className = "",
}: {
  children: ReactNode;
  action: () => Promise<void>;
  variant?: "primary" | "ghost" | "outline" | "danger" | "dark";
  size?: "sm" | "md";
  confirm?: string;
  className?: string;
}) {
  const [pending, start] = useTransition();
  return (
    <Btn
      variant={variant}
      size={size}
      disabled={pending}
      className={className}
      onClick={() => {
        if (confirm && !window.confirm(confirm)) return;
        start(async () => {
          await action();
        });
      }}
    >
      {pending ? <span className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" /> : null}
      {children}
    </Btn>
  );
}

export function Pill({ tone = "slate", children }: { tone?: string; children: ReactNode }) {
  const map: Record<string, string> = {
    slate: "bg-slate-100 text-slate-700 ring-slate-200",
    green: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    amber: "bg-amber-50 text-amber-700 ring-amber-200",
    rose: "bg-rose-50 text-rose-700 ring-rose-200",
    blue: "bg-sky-50 text-sky-700 ring-sky-200",
    violet: "bg-violet-50 text-violet-700 ring-violet-200",
  };
  return <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10.5px] font-semibold ring-1 ring-inset ${map[tone] ?? map.slate}`}>{children}</span>;
}

export function Stat({ label, value, sub, tone = "slate", icon }: { label: string; value: string | number; sub?: string; tone?: string; icon?: string }) {
  const ring: Record<string, string> = {
    slate: "bg-slate-100 text-slate-600",
    amber: "bg-amber-100 text-amber-700",
    green: "bg-emerald-100 text-emerald-700",
    rose: "bg-rose-100 text-rose-700",
    blue: "bg-sky-100 text-sky-700",
    violet: "bg-violet-100 text-violet-700",
  };
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between">
        <p className="text-[11.5px] font-medium text-slate-500">{label}</p>
        {icon ? <span className={`flex h-7 w-7 items-center justify-center rounded-lg ${ring[tone] ?? ring.slate}`}><I n={icon} c="h-3.5 w-3.5" /></span> : null}
      </div>
      <p className="mt-2 text-[24px] font-semibold leading-none tracking-tight text-slate-900">{value}</p>
      {sub ? <p className="mt-1.5 text-[11px] text-slate-500">{sub}</p> : null}
    </Card>
  );
}

export function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  hint,
}: {
  label: string;
  value: string | number;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11.5px] font-medium text-slate-600">{label}</span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-[13px] text-slate-900 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
      />
      {hint ? <span className="mt-1 block text-[10.5px] text-slate-400">{hint}</span> : null}
    </label>
  );
}

export function Area({ label, value, onChange, rows = 3, hint }: { label: string; value: string; onChange: (v: string) => void; rows?: number; hint?: string }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11.5px] font-medium text-slate-600">{label}</span>
      <textarea
        value={value}
        rows={rows}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-[13px] text-slate-900 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
      />
      {hint ? <span className="mt-1 block text-[10.5px] text-slate-400">{hint}</span> : null}
    </label>
  );
}

export function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11.5px] font-medium text-slate-600">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-[13px] text-slate-900 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function Check({ label, checked, onChange, hint }: { label: string; checked: boolean; onChange: (v: boolean) => void; hint?: string }) {
  return (
    <button type="button" onClick={() => onChange(!checked)} className="flex w-full items-start gap-2.5 rounded-lg border border-slate-200 px-3 py-2 text-left transition hover:bg-slate-50">
      <span className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border ${checked ? "border-amber-500 bg-amber-500 text-white" : "border-slate-300 bg-white"}`}>
        {checked ? <I n="check" c="h-2.5 w-2.5" w={3.4} /> : null}
      </span>
      <span className="min-w-0">
        <span className="block text-[12.5px] font-medium text-slate-800">{label}</span>
        {hint ? <span className="block text-[10.5px] text-slate-500">{hint}</span> : null}
      </span>
    </button>
  );
}

export function Drawer({ open, onClose, title, sub, children, footer, wide }: { open: boolean; onClose: () => void; title: string; sub?: string; children: ReactNode; footer?: ReactNode; wide?: boolean }) {
  useEffect(() => {
    if (!open) return;
    const h = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button type="button" aria-label="Close" onClick={onClose} className="absolute inset-0 bg-slate-900/40 backdrop-blur-[1px]" />
      <div className={`relative flex h-full w-full flex-col bg-white shadow-2xl ${wide ? "max-w-3xl" : "max-w-lg"}`} style={{ animation: "drawerIn .24s cubic-bezier(.22,1,.36,1)" }}>
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4">
          <div>
            <h3 className="text-[15px] font-semibold text-slate-900">{title}</h3>
            {sub ? <p className="mt-0.5 text-[12px] text-slate-500">{sub}</p> : null}
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700">
            <I n="close" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-5">{children}</div>
        {footer ? <div className="flex items-center justify-end gap-2 border-t border-slate-200 bg-slate-50 px-5 py-3.5">{footer}</div> : null}
      </div>
      <style>{`@keyframes drawerIn{from{transform:translateX(24px);opacity:.4}to{transform:translateX(0);opacity:1}}`}</style>
    </div>
  );
}

export function Table({ head, children }: { head: string[]; children: ReactNode }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px] border-collapse text-left">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50/70">
            {head.map((h) => (
              <th key={h} className="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">{children}</tbody>
      </table>
    </div>
  );
}

export function Td({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <td className={`px-4 py-3 align-middle text-[12.5px] text-slate-700 ${className}`}>{children}</td>;
}

export function Tabs({ tabs, value, onChange }: { tabs: { key: string; label: string; count?: number }[]; value: string; onChange: (k: string) => void }) {
  return (
    <div className="flex gap-1 overflow-x-auto border-b border-slate-200">
      {tabs.map((t) => (
        <button
          key={t.key}
          type="button"
          onClick={() => onChange(t.key)}
          className={`relative shrink-0 px-3.5 py-2.5 text-[13px] font-semibold transition-colors ${value === t.key ? "text-amber-700" : "text-slate-500 hover:text-slate-800"}`}
        >
          {t.label}
          {t.count !== undefined ? <span className="ml-1.5 rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-600">{t.count}</span> : null}
          {value === t.key ? <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-amber-500" /> : null}
        </button>
      ))}
    </div>
  );
}

export function SearchBox({ value, onChange, placeholder = "Search…" }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div className="relative">
      <I n="search" c="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-[13px] outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
      />
    </div>
  );
}

export function Empty({ title, sub, icon = "sparkle" }: { title: string; sub?: string; icon?: string }) {
  return (
    <div className="flex flex-col items-center px-6 py-14 text-center">
      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
        <I n={icon} c="h-5 w-5" />
      </span>
      <p className="mt-3 text-[14px] font-semibold text-slate-800">{title}</p>
      {sub ? <p className="mt-1 max-w-sm text-[12px] text-slate-500">{sub}</p> : null}
    </div>
  );
}

export function Bar({ value, max, tone = "amber" }: { value: number; max: number; tone?: string }) {
  const pct = max > 0 ? Math.max(2, Math.round((value / max) * 100)) : 0;
  const c: Record<string, string> = { amber: "bg-amber-500", green: "bg-emerald-500", blue: "bg-sky-500", violet: "bg-violet-500" };
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
      <div className={`h-full rounded-full ${c[tone] ?? c.amber}`} style={{ width: `${pct}%` }} />
    </div>
  );
}

export function useToast() {
  const [msg, setMsg] = useState<string | null>(null);
  useEffect(() => {
    if (!msg) return;
    const t = window.setTimeout(() => setMsg(null), 2600);
    return () => window.clearTimeout(t);
  }, [msg]);
  const node = msg ? (
    <div className="fixed bottom-6 left-1/2 z-[60] -translate-x-1/2 rounded-lg bg-slate-900 px-4 py-2.5 text-[12.5px] font-medium text-white shadow-xl">{msg}</div>
  ) : null;
  return { toast: setMsg, node };
}
