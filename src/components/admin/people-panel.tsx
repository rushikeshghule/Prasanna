"use client";

import { useMemo, useState, useTransition } from "react";
import {
  ActionBtn, Area, Btn, Card, CardHead, Check, Drawer, Empty, Field, I, Pill, SearchBox, Select,
  Stat, Table, Td, money, nice, statusTone, when, whenTime,
} from "./ui";
import { grantPlan, processDeletion, recheckPayment, refundPayment, revokePlan, savePlan, togglePlan, updateUserStatus } from "@/app/admin/actions";

type U = {
  id: number; name: string; phone: string; email: string | null; avatar: string | null; status: string;
  language: string; planCode: string | null; subStatus: string; subExpiresAt: string | null;
  downloadsUsed: number; deletionRequested: boolean; createdAt: string; spend: number; txns: number; downloads: number;
};

export function UsersPanel({ users, plans }: { users: U[]; plans: { code: string; name: string; durationDays: number }[] }) {
  const [q, setQ] = useState("");
  const [seg, setSeg] = useState("all");
  const [open, setOpen] = useState<U | null>(null);

  const rows = useMemo(
    () => users.filter((u) => {
      if (seg === "premium" && u.subStatus !== "active") return false;
      if (seg === "free" && u.subStatus === "active") return false;
      if (seg === "blocked" && !["blocked", "suspended"].includes(u.status)) return false;
      if (seg === "deletion" && !u.deletionRequested) return false;
      if (q && ![u.name, u.phone, u.email ?? ""].join(" ").toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    }),
    [q, seg, users],
  );

  const csv = () => {
    const head = "Name,Phone,Email,Status,Plan,Subscription,Expiry,Downloads,Spend\n";
    const body = rows.map((u) => [u.name, u.phone, u.email ?? "", u.status, u.planCode ?? "free", u.subStatus, u.subExpiresAt ?? "", u.downloads, u.spend].join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([head + body], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url; a.download = "prasanna-users.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Total users" value={users.length} icon="users" tone="blue" />
        <Stat label="Premium" value={users.filter((u) => u.subStatus === "active").length} icon="crown" tone="amber" />
        <Stat label="Blocked / suspended" value={users.filter((u) => ["blocked", "suspended"].includes(u.status)).length} icon="shield" tone="rose" />
        <Stat label="Deletion requests" value={users.filter((u) => u.deletionRequested).length} icon="trash" tone="rose" />
      </div>

      <Card>
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 p-3">
          <div className="w-56"><SearchBox value={q} onChange={setQ} placeholder="Name, phone, email…" /></div>
          <div className="w-44"><Select label="" value={seg} onChange={setSeg} options={[
            { value: "all", label: "All users" }, { value: "premium", label: "Premium only" },
            { value: "free", label: "Free only" }, { value: "blocked", label: "Blocked" }, { value: "deletion", label: "Deletion requested" },
          ]} /></div>
          <Btn variant="outline" className="ml-auto" onClick={csv}><I n="download" c="h-3.5 w-3.5" /> Export CSV</Btn>
        </div>

        {rows.length === 0 ? (
          <Empty title="No users match" icon="users" />
        ) : (
          <Table head={["User", "Subscription", "Activity", "Spend", "Joined", "Status", ""]}>
            {rows.map((u) => (
              <tr key={u.id} className="hover:bg-slate-50">
                <Td>
                  <div className="flex items-center gap-2.5">
                    {u.avatar ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={u.avatar} alt="" className="h-9 w-9 rounded-full object-cover ring-1 ring-slate-200" />
                    ) : (
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-200 text-[11px] font-bold text-slate-600">{u.name.slice(0, 2).toUpperCase()}</span>
                    )}
                    <div className="min-w-0">
                      <p className="truncate font-medium text-slate-800">{u.name}</p>
                      <p className="text-[10.5px] text-slate-400">{u.phone} · {u.language.toUpperCase()}</p>
                    </div>
                  </div>
                </Td>
                <Td>
                  {u.subStatus === "active" ? (
                    <>
                      <Pill tone="amber">{plans.find((p) => p.code === u.planCode)?.name ?? u.planCode}</Pill>
                      <p className="mt-1 text-[10.5px] text-slate-400">till {when(u.subExpiresAt)}</p>
                    </>
                  ) : (
                    <Pill tone={statusTone(u.subStatus)}>{u.subStatus === "none" ? "Free" : u.subStatus}</Pill>
                  )}
                </Td>
                <Td className="text-[11.5px] text-slate-500">{u.downloads} downloads<br /><span className="text-slate-400">{u.txns} transactions</span></Td>
                <Td className="font-semibold">{money(u.spend)}</Td>
                <Td className="text-[11.5px] text-slate-500">{when(u.createdAt)}</Td>
                <Td>
                  <div className="flex flex-wrap gap-1">
                    <Pill tone={statusTone(u.status)}>{u.status}</Pill>
                    {u.deletionRequested ? <Pill tone="rose">Deletion</Pill> : null}
                  </div>
                </Td>
                <Td><div className="flex justify-end"><Btn size="sm" variant="outline" onClick={() => setOpen(u)}>Manage</Btn></div></Td>
              </tr>
            ))}
          </Table>
        )}
      </Card>

      {open ? <UserDrawer user={open} plans={plans} onClose={() => setOpen(null)} /> : null}
    </div>
  );
}

function UserDrawer({ user, plans, onClose }: { user: U; plans: { code: string; name: string; durationDays: number }[]; onClose: () => void }) {
  const [plan, setPlan] = useState(plans[0]?.code ?? "");
  const [days, setDays] = useState(String(plans[0]?.durationDays ?? 30));
  const [pending, start] = useTransition();

  return (
    <Drawer open onClose={onClose} title={user.name} sub={`${user.phone} · joined ${when(user.createdAt)}`}>
      <div className="space-y-5">
        <div className="grid grid-cols-3 gap-2.5">
          {[["Downloads", user.downloads], ["Transactions", user.txns], ["Lifetime", money(user.spend)]].map(([l, v]) => (
            <div key={l as string} className="rounded-lg bg-slate-50 p-3 text-center ring-1 ring-inset ring-slate-200">
              <p className="text-[16px] font-semibold text-slate-900">{v as string}</p>
              <p className="text-[10.5px] text-slate-500">{l as string}</p>
            </div>
          ))}
        </div>

        <div className="rounded-lg border border-slate-200 p-4">
          <p className="text-[12.5px] font-semibold text-slate-800">Subscription</p>
          <p className="mt-1 text-[11.5px] text-slate-500">
            {user.subStatus === "active" ? `${plans.find((p) => p.code === user.planCode)?.name} active till ${when(user.subExpiresAt)}` : "No active subscription"}
          </p>
          <div className="mt-3 grid grid-cols-2 gap-2.5">
            <Select label="Grant / extend plan" value={plan} onChange={(v) => { setPlan(v); setDays(String(plans.find((p) => p.code === v)?.durationDays ?? 30)); }} options={plans.map((p) => ({ value: p.code, label: p.name }))} />
            <Field label="Days" value={days} onChange={setDays} type="number" />
          </div>
          <div className="mt-3 flex gap-2">
            <Btn variant="primary" size="sm" disabled={pending} onClick={() => start(async () => { await grantPlan(user.id, plan, Number(days) || 30); onClose(); })}>
              <I n="crown" c="h-3.5 w-3.5" /> Grant complimentary
            </Btn>
            {user.subStatus === "active" ? (
              <ActionBtn action={async () => { await revokePlan(user.id); onClose(); }} variant="danger" confirm="Revoke this subscription?">Revoke</ActionBtn>
            ) : null}
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 p-4">
          <p className="text-[12.5px] font-semibold text-slate-800">Account status</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {["active", "suspended", "blocked"].map((s) => (
              <ActionBtn key={s} action={async () => { await updateUserStatus(user.id, s); onClose(); }} variant={user.status === s ? "dark" : "outline"}>
                {s}
              </ActionBtn>
            ))}
          </div>
        </div>

        {user.deletionRequested ? (
          <div className="rounded-lg border border-rose-200 bg-rose-50 p-4">
            <p className="text-[12.5px] font-semibold text-rose-800">Account deletion requested</p>
            <p className="mt-1 text-[11.5px] text-rose-700">Approving anonymises the profile and revokes sessions. Invoices are retained as required by law.</p>
            <div className="mt-3 flex gap-2">
              <ActionBtn action={async () => { await processDeletion(user.id, true); onClose(); }} variant="danger" confirm="Anonymise this account permanently?">Approve deletion</ActionBtn>
              <ActionBtn action={async () => { await processDeletion(user.id, false); onClose(); }} variant="outline">Reject</ActionBtn>
            </div>
          </div>
        ) : null}
      </div>
    </Drawer>
  );
}

/* ----------------------------- billing ----------------------------- */

type P = {
  id: number; code: string; name: string; description: string; price: number; mrp: number | null;
  taxPercent: number; durationDays: number; durationLabel: string; benefits: string[]; includedCategories: string[];
  downloadLimit: number; quality: string; trialDays: number; isPopular: boolean; isActive: boolean; displayOrder: number;
  subscribers: number; revenue: number;
};
type Pay = { id: number; userName: string; planCode: string; invoiceNo: string; amount: number; tax: number; total: number; method: string; status: string; gatewayRef: string; createdAt: string };

export function BillingPanel({ plans, payments, categories, initialTab }: { plans: P[]; payments: Pay[]; categories: { slug: string; name: string }[]; initialTab?: string }) {
  const [tab, setTab] = useState(initialTab === "payments" ? "payments" : "plans");
  const [edit, setEdit] = useState<P | "new" | null>(null);
  const [filter, setFilter] = useState("all");

  const rows = payments.filter((p) => filter === "all" || p.status === filter);
  const revenue = payments.filter((p) => p.status === "success").reduce((a, b) => a + b.total, 0);
  const csv = () => {
    const head = "Invoice,User,Plan,Amount,Tax,Total,Method,Status,Reference,Date\n";
    const body = rows.map((p) => [p.invoiceNo, p.userName, p.planCode, p.amount, p.tax, p.total, p.method, p.status, p.gatewayRef, p.createdAt].join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([head + body], { type: "text/csv" }));
    const a = document.createElement("a"); a.href = url; a.download = "prasanna-payments.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Total revenue" value={money(revenue)} icon="card" tone="green" />
        <Stat label="Active plans" value={plans.filter((p) => p.isActive).length} sub={`${plans.length} total`} icon="crown" tone="amber" />
        <Stat label="Subscribers" value={plans.reduce((a, b) => a + b.subscribers, 0)} icon="users" tone="blue" />
        <Stat label="Failed / refunded" value={payments.filter((p) => p.status !== "success").length} icon="refresh" tone="rose" />
      </div>

      <div className="flex items-center justify-between">
        <div className="inline-flex rounded-lg border border-slate-300 bg-white p-0.5">
          {[["plans", "Plans"], ["payments", "Payments"]].map(([k, l]) => (
            <button key={k} type="button" onClick={() => setTab(k)} className={`rounded-md px-3.5 py-1.5 text-[12.5px] font-semibold transition ${tab === k ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"}`}>{l}</button>
          ))}
        </div>
        {tab === "plans" ? <Btn variant="dark" onClick={() => setEdit("new")}><I n="plus" c="h-3.5 w-3.5" /> New plan</Btn> : <Btn variant="outline" onClick={csv}><I n="download" c="h-3.5 w-3.5" /> Export CSV</Btn>}
      </div>

      {tab === "plans" ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {plans.map((p) => (
            <Card key={p.id} className={`p-5 ${p.isPopular ? "ring-2 ring-amber-400" : ""}`}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[15px] font-semibold text-slate-900">{p.name}</p>
                  <p className="mt-0.5 font-mono text-[10.5px] text-slate-400">{p.code}</p>
                </div>
                <div className="flex gap-1">
                  {p.isPopular ? <Pill tone="amber">Popular</Pill> : null}
                  <Pill tone={p.isActive ? "green" : "slate"}>{p.isActive ? "Active" : "Off"}</Pill>
                </div>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-[26px] font-semibold tracking-tight text-slate-900">{money(p.price)}</span>
                {p.mrp ? <span className="text-[13px] text-slate-400 line-through">{money(p.mrp)}</span> : null}
                <span className="text-[12px] text-slate-500">/ {p.durationLabel}</span>
              </div>
              <p className="mt-2 text-[12px] text-slate-500">{p.description}</p>
              <ul className="mt-3 space-y-1">
                {p.benefits.slice(0, 4).map((b) => (
                  <li key={b} className="flex items-start gap-1.5 text-[11.5px] text-slate-600"><I n="check" c="mt-0.5 h-3 w-3 shrink-0 text-emerald-600" w={3} />{b}</li>
                ))}
              </ul>
              <div className="mt-3 flex flex-wrap gap-1">
                {p.includedCategories.map((c) => <Pill key={c} tone="blue">{categories.find((x) => x.slug === c)?.name ?? c}</Pill>)}
                <Pill>{p.downloadLimit} downloads</Pill>
                <Pill>{p.quality}</Pill>
                {p.trialDays > 0 ? <Pill tone="green">{p.trialDays}d trial</Pill> : null}
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                <div className="text-[11.5px] text-slate-500">{p.subscribers} subscribers · {money(p.revenue)}</div>
                <div className="flex gap-1.5">
                  <ActionBtn action={() => togglePlan(p.id)} variant="ghost"><I n="eye" c="h-3.5 w-3.5" /></ActionBtn>
                  <Btn size="sm" variant="outline" onClick={() => setEdit(p)}><I n="edit" c="h-3.5 w-3.5" /> Edit</Btn>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <div className="flex gap-2 border-b border-slate-200 p-3">
            {["all", "success", "failed", "refunded"].map((s) => (
              <button key={s} type="button" onClick={() => setFilter(s)} className={`rounded-full px-3 py-1.5 text-[12px] font-semibold capitalize transition ${filter === s ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>{s}</button>
            ))}
          </div>
          {rows.length === 0 ? <Empty title="No transactions" icon="card" /> : (
            <Table head={["Invoice", "User", "Plan", "Method", "Amount", "Status", ""]}>
              {rows.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50">
                  <Td><p className="font-medium text-slate-800">{p.invoiceNo}</p><p className="font-mono text-[10px] text-slate-400">{p.gatewayRef}</p></Td>
                  <Td>{p.userName}<br /><span className="text-[10.5px] text-slate-400">{whenTime(p.createdAt)}</span></Td>
                  <Td className="capitalize">{p.planCode.replace(/-/g, " ")}</Td>
                  <Td className="text-[11.5px] text-slate-500">{p.method}</Td>
                  <Td><span className="font-semibold">{money(p.total)}</span><br /><span className="text-[10px] text-slate-400">incl. {money(p.tax)} GST</span></Td>
                  <Td><Pill tone={statusTone(p.status)}>{p.status}</Pill></Td>
                  <Td>
                    <div className="flex justify-end gap-1.5">
                      {p.status === "success" ? <ActionBtn action={() => refundPayment(p.id)} variant="danger" confirm={`Refund ${money(p.total)}?`}>Refund</ActionBtn> : null}
                      {p.status !== "success" && p.status !== "refunded" ? <ActionBtn action={() => recheckPayment(p.id)} variant="outline"><I n="refresh" c="h-3.5 w-3.5" /> Recheck</ActionBtn> : null}
                    </div>
                  </Td>
                </tr>
              ))}
            </Table>
          )}
        </Card>
      )}

      {edit ? <PlanDrawer value={edit} categories={categories} onClose={() => setEdit(null)} /> : null}
    </div>
  );
}

function PlanDrawer({ value, categories, onClose }: { value: P | "new"; categories: { slug: string; name: string }[]; onClose: () => void }) {
  const isNew = value === "new";
  const p = isNew ? null : value;
  const [f, setF] = useState({
    code: p?.code ?? "", name: p?.name ?? "", description: p?.description ?? "",
    price: String(p?.price ?? 100), mrp: String(p?.mrp ?? ""), taxPercent: String(p?.taxPercent ?? 18),
    durationDays: String(p?.durationDays ?? 30), durationLabel: p?.durationLabel ?? "1 month",
    downloadLimit: String(p?.downloadLimit ?? 60), quality: p?.quality ?? "HD", trialDays: String(p?.trialDays ?? 0),
    displayOrder: String(p?.displayOrder ?? 4),
  });
  const [benefits, setBenefits] = useState((p?.benefits ?? []).join("\n"));
  const [cats, setCats] = useState<string[]>(p?.includedCategories ?? categories.map((c) => c.slug));
  const [popular, setPopular] = useState(p?.isPopular ?? false);
  const [active, setActive] = useState(p?.isActive ?? true);
  const [pending, start] = useTransition();
  const s = (k: keyof typeof f, v: string) => setF((x) => ({ ...x, [k]: v }));

  return (
    <Drawer open onClose={onClose} title={isNew ? "New subscription plan" : `Edit ${p?.name}`} sub="Pricing, access rules and limits"
      footer={<>
        <Btn variant="outline" onClick={onClose}>Cancel</Btn>
        <Btn variant="primary" disabled={pending || !f.name} onClick={() => start(async () => {
          await savePlan({
            id: p?.id, code: f.code || f.name.toLowerCase().replace(/\s+/g, "-"), name: f.name, description: f.description,
            price: Number(f.price) || 0, mrp: f.mrp ? Number(f.mrp) : null, taxPercent: Number(f.taxPercent) || 0,
            durationDays: Number(f.durationDays) || 30, durationLabel: f.durationLabel,
            benefits: benefits.split("\n").map((b) => b.trim()).filter(Boolean),
            includedCategories: cats, downloadLimit: Number(f.downloadLimit) || 0, quality: f.quality,
            trialDays: Number(f.trialDays) || 0, isPopular: popular, isActive: active, displayOrder: Number(f.displayOrder) || 0,
          });
          onClose();
        })}>{pending ? "Saving…" : "Save plan"}</Btn>
      </>}>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Plan name" value={f.name} onChange={(v) => s("name", v)} />
          <Field label="Plan code" value={f.code} onChange={(v) => s("code", v)} />
        </div>
        <Field label="Description" value={f.description} onChange={(v) => s("description", v)} />
        <div className="grid grid-cols-3 gap-3">
          <Field label="Price (₹)" value={f.price} onChange={(v) => s("price", v)} type="number" />
          <Field label="Strike-through MRP" value={f.mrp} onChange={(v) => s("mrp", v)} type="number" />
          <Field label="GST %" value={f.taxPercent} onChange={(v) => s("taxPercent", v)} type="number" />
          <Field label="Duration (days)" value={f.durationDays} onChange={(v) => s("durationDays", v)} type="number" />
          <Field label="Duration label" value={f.durationLabel} onChange={(v) => s("durationLabel", v)} />
          <Field label="Free trial (days)" value={f.trialDays} onChange={(v) => s("trialDays", v)} type="number" />
          <Field label="Download limit" value={f.downloadLimit} onChange={(v) => s("downloadLimit", v)} type="number" />
          <Select label="Max quality" value={f.quality} onChange={(v) => s("quality", v)} options={["Standard", "HD", "Ultra HD"].map((x) => ({ value: x, label: x }))} />
          <Field label="Display order" value={f.displayOrder} onChange={(v) => s("displayOrder", v)} type="number" />
        </div>
        <Area label="Benefits (one per line)" value={benefits} onChange={setBenefits} rows={5} />
        <div>
          <p className="mb-2 text-[11.5px] font-medium text-slate-600">Included categories</p>
          <div className="space-y-2">
            {categories.map((c) => (
              <Check key={c.slug} label={c.name} checked={cats.includes(c.slug)} onChange={(v) => setCats((x) => (v ? [...x, c.slug] : x.filter((y) => y !== c.slug)))} />
            ))}
          </div>
        </div>
        <Check label="Mark as most popular" checked={popular} onChange={setPopular} />
        <Check label="Plan is active and purchasable" checked={active} onChange={setActive} />
      </div>
    </Drawer>
  );
}
