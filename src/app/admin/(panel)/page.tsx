import Link from "next/link";
import { getDashboard } from "@/server/admin-store";
import { Bar, Card, CardHead, I, Pill, Stat, Table, Td } from "@/components/admin/ui";
import { money, nice, statusTone, when } from "@/lib/format";
import { RangePicker, SimulateBtn } from "@/components/admin/dashboard-widgets";

export const dynamic = "force-dynamic";

export default async function DashboardPage({ searchParams }: { searchParams: Promise<{ range?: string }> }) {
  const sp = await searchParams;
  const days = Number(sp.range ?? 30) || 30;
  const d = await getDashboard(days);
  const t = d.totals;
  const maxRev = Math.max(1, ...d.revenueByDay.map((r) => r.amount));
  const maxViews = Math.max(1, ...d.catStats.map((c) => c.views));

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-[19px] font-semibold tracking-tight text-slate-900">Good to see you 👋</h2>
          <p className="mt-0.5 text-[12.5px] text-slate-500">
            Showing data for the last {days} days · {t.designs} designs live across {t.categories} categories
          </p>
        </div>
        <div className="flex items-center gap-2">
          <SimulateBtn />
          <RangePicker value={days} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Total users" value={nice(t.users)} sub={`+${t.newUsers} new in ${days}d`} icon="users" tone="blue" />
        <Stat label="Active subscriptions" value={t.activeSubs} sub={`${t.freeUsers} on free plan`} icon="crown" tone="amber" />
        <Stat label="Revenue" value={money(t.revenue)} sub={`${money(t.rangeRevenue)} in range`} icon="card" tone="green" />
        <Stat label="Design views" value={nice(t.views)} sub={`${nice(t.downloads)} downloads`} icon="eye" tone="violet" />
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Published designs" value={t.published} sub={`${t.drafts} drafts pending`} icon="image" />
        <Stat label="Shares" value={nice(t.shares)} sub={`${nice(t.favourites)} favourites`} icon="sparkle" />
        <Stat label="Payments" value={`${t.paymentsOk} ok`} sub={`${t.paymentsFail} failed / refunded`} icon="card" tone={t.paymentsFail ? "rose" : "green"} />
        <Stat label="Storage used" value={`${t.storageMb} MB`} sub="Cloud image bucket" icon="layers" />
      </div>

      {(t.openReports > 0 || t.openTickets > 0 || t.drafts > 0) && (
        <Card className="border-amber-200 bg-amber-50/60 p-4">
          <div className="flex flex-wrap items-center gap-4">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
              <I n="flag" c="h-4 w-4" />
            </span>
            <p className="text-[13px] font-semibold text-amber-900">Needs your attention</p>
            <div className="flex flex-wrap gap-2">
              {t.openReports > 0 ? (
                <Link href="/admin/content?tab=reports" className="rounded-full bg-white px-3 py-1 text-[11.5px] font-semibold text-amber-800 ring-1 ring-amber-200 hover:bg-amber-100">
                  {t.openReports} reported design{t.openReports > 1 ? "s" : ""}
                </Link>
              ) : null}
              {t.openTickets > 0 ? (
                <Link href="/admin/content?tab=tickets" className="rounded-full bg-white px-3 py-1 text-[11.5px] font-semibold text-amber-800 ring-1 ring-amber-200 hover:bg-amber-100">
                  {t.openTickets} support ticket{t.openTickets > 1 ? "s" : ""}
                </Link>
              ) : null}
              {t.drafts > 0 ? (
                <Link href="/admin/designs?status=draft" className="rounded-full bg-white px-3 py-1 text-[11.5px] font-semibold text-amber-800 ring-1 ring-amber-200 hover:bg-amber-100">
                  {t.drafts} unpublished draft{t.drafts > 1 ? "s" : ""}
                </Link>
              ) : null}
            </div>
          </div>
        </Card>
      )}

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHead title="Revenue" sub={`Daily collected amount over the last ${days} days`} />
          <div className="px-5 py-5">
            <div className="flex h-[168px] items-end gap-[3px]">
              {d.revenueByDay.map((r) => (
                <div key={r.date} className="group relative flex-1">
                  <div
                    className={`w-full rounded-t transition-colors ${r.amount > 0 ? "bg-amber-400 group-hover:bg-amber-500" : "bg-slate-100"}`}
                    style={{ height: `${Math.max(3, (r.amount / maxRev) * 160)}px` }}
                  />
                  {r.amount > 0 ? (
                    <span className="pointer-events-none absolute -top-7 left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded bg-slate-900 px-1.5 py-1 text-[10px] text-white group-hover:block">
                      {money(r.amount)}
                    </span>
                  ) : null}
                </div>
              ))}
            </div>
            <div className="mt-2 flex justify-between text-[10.5px] text-slate-400">
              <span>{when(d.revenueByDay[0]?.date)}</span>
              <span>Peak {money(maxRev)}</span>
              <span>Today</span>
            </div>
          </div>
        </Card>

        <Card>
          <CardHead title="Category engagement" sub="Views by category" />
          <div className="space-y-3.5 px-5 py-4">
            {d.catStats.map((c) => (
              <div key={c.slug}>
                <div className="mb-1 flex items-center justify-between text-[12px]">
                  <span className="font-medium text-slate-700">
                    {c.emoji} {c.name}
                  </span>
                  <span className="text-slate-500">{nice(c.views)}</span>
                </div>
                <Bar value={c.views} max={maxViews} tone={c.slug === "jewellery" ? "violet" : "amber"} />
                <p className="mt-1 text-[10.5px] text-slate-400">
                  {c.designs} designs · {nice(c.downloads)} downloads
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHead
            title="Most popular designs"
            sub="Ranked by views"
            action={<Link href="/admin/designs" className="text-[12px] font-semibold text-amber-700 hover:underline">View all</Link>}
          />
          <Table head={["Design", "Access", "Views", "Downloads"]}>
            {d.popularDesigns.map((x) => (
              <tr key={x.code} className="hover:bg-slate-50">
                <Td>
                  <div className="flex items-center gap-2.5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={x.thumb} alt="" className="h-9 w-9 rounded-md object-cover ring-1 ring-slate-200" />
                    <div className="min-w-0">
                      <p className="truncate text-[12.5px] font-medium text-slate-800">{x.title}</p>
                      <p className="text-[10.5px] text-slate-400">{x.code}</p>
                    </div>
                  </div>
                </Td>
                <Td>{x.isPremium ? <Pill tone="amber">Premium</Pill> : <Pill tone="green">Free</Pill>}</Td>
                <Td>{nice(x.views)}</Td>
                <Td>{x.downloads}</Td>
              </tr>
            ))}
          </Table>
        </Card>

        <Card>
          <CardHead
            title="Recent transactions"
            action={<Link href="/admin/billing?tab=payments" className="text-[12px] font-semibold text-amber-700 hover:underline">View all</Link>}
          />
          <Table head={["Invoice", "Plan", "Status", "Amount"]}>
            {d.recentPayments.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50">
                <Td>
                  <p className="font-medium text-slate-800">{p.invoiceNo}</p>
                  <p className="text-[10.5px] text-slate-400">{when(p.createdAt)}</p>
                </Td>
                <Td className="capitalize">{p.planCode.replace(/-/g, " ")}</Td>
                <Td>
                  <Pill tone={statusTone(p.status)}>{p.status}</Pill>
                </Td>
                <Td className="font-semibold">{money(Number(p.total))}</Td>
              </tr>
            ))}
          </Table>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHead title="Recently uploaded" sub="Latest designs published to the app" />
          <div className="flex gap-3 overflow-x-auto px-5 py-4">
            {d.recentDesigns.map((x) => (
              <div key={x.code} className="w-[104px] shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={x.thumb} alt="" className="h-[132px] w-full rounded-lg object-cover ring-1 ring-slate-200" />
                <p className="mt-1.5 truncate text-[11.5px] font-medium text-slate-700">{x.title}</p>
                <p className="text-[10px] text-slate-400">{when(x.publishedAt)}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHead title="Search insights" sub="What users are looking for" />
          {d.searchTerms.length === 0 ? (
            <p className="px-5 py-8 text-center text-[12px] text-slate-400">No searches recorded yet.</p>
          ) : (
            <Table head={["Term", "Searches", "No results"]}>
              {d.searchTerms.map((s) => (
                <tr key={s.term} className="hover:bg-slate-50">
                  <Td className="font-medium text-slate-800">{s.term}</Td>
                  <Td>{s.count}</Td>
                  <Td>{s.zero > 0 ? <Pill tone="rose">{s.zero} empty</Pill> : <Pill tone="green">ok</Pill>}</Td>
                </tr>
              ))}
            </Table>
          )}
        </Card>
      </div>
    </div>
  );
}
