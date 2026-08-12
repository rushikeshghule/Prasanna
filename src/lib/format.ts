/** Framework-agnostic formatting helpers, safe to import from server or client. */

export function money(n: number) {
  return `₹${n.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
}

export function nice(n: number) {
  if (n >= 100000) return `${(n / 100000).toFixed(1)}L`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

export function when(iso: string | Date | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export function whenTime(iso: string | Date | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
}

export function statusTone(s: string) {
  if (["published", "success", "active", "resolved", "sent"].includes(s)) return "green";
  if (["draft", "pending", "scheduled", "grace"].includes(s)) return "amber";
  if (["failed", "archived", "blocked", "suspended", "refunded", "open", "deleted"].includes(s)) return "rose";
  if (["inactive", "cancelled", "none", "dismissed", "closed"].includes(s)) return "slate";
  return "slate";
}
