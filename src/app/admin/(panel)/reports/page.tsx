import { getReports } from "@/server/admin-store";
import { Bar, Card, CardHead, Pill, Stat, Table, Td } from "@/components/admin/ui";
import { money, nice } from "@/lib/format";
import { ExportBtn, RangeLinks } from "@/components/admin/report-widgets";

export const dynamic = "force-dynamic";

export default async function Page({ searchParams }: { searchParams: Promise<{ range?: string }> }) {
  const sp = await searchParams;
  const days = Number(sp.range ?? 30) || 30;
  const d = await getReports(days);
  const t = d.totals;
  const maxCol = Math.max(1, ...d.collectionStats.map((c) => c.views));
  const maxSub = Math.max(1, ...d.subStats.map((c) => c.views));
  const successRate = Math.round((t.paymentsOk / Math.max(1, t.paymentsOk + t.paymentsFail)) * 100);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-[18px] font-semibold tracking-tight text-slate-900">Reports & analytics</h2>
          <p className="mt-0.5 text-[12.5px] text-slate-500">Engagement, revenue and content performance for the last {days} days</p>
        </div>
        <div className="flex items-center gap-2">
          <ExportBtn rows={d.collectionStats} name="collection-report" />
          <RangeLinks value={days} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        <Stat label="Registrations" value={t.newUsers} sub={`${t.users} lifetime`} icon="users" tone="blue" />
        <Stat label="Subscriptions" value={t.activeSubs} sub={`${t.expiredSubs} expired`} icon="crown" tone="amber" />
        <Stat label="Revenue" value={money(t.rangeRevenue)} sub={`${money(t.revenue)} lifetime`} icon="card" tone="green" />
        <Stat label="Payment success" value={`${successRate}%`} sub={`${t.paymentsFail} failures`} icon="chart" tone={successRate > 80 ? "green" : "rose"} />
        <Stat label="Downloads" value={nice(t.downloads)} sub={`${nice(t.shares)} shares`} icon="download" tone="violet" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHead title="Collection engagement" sub="Views, downloads and saves per collection" />
          <div className="max-h-[420px] overflow-y-auto">
            <Table head={["Collection", "Designs", "Views", "Downloads", "Saves"]}>
              {d.collectionStats.map((c) => (
                <tr key={c.name} className="hover:bg-slate-50">
                  <Td>
                    <p className="font-medium text-slate-800">{c.name}</p>
                    <div className="mt-1 w-40"><Bar value={c.views} max={maxCol} /></div>
                  </Td>
                  <Td>{c.designs}</Td>
                  <Td className="font-semibold">{nice(c.views)}</Td>
                  <Td>{c.downloads}</Td>
                  <Td>{c.favourites}</Td>
                </tr>
              ))}
            </Table>
          </div>
        </Card>

        <Card>
          <CardHead title="Subcategory engagement" sub="Where users spend their time" />
          <div className="max-h-[420px] overflow-y-auto">
            <Table head={["Subcategory", "Designs", "Views"]}>
              {d.subStats.map((s) => (
                <tr key={s.name} className="hover:bg-slate-50">
                  <Td>
                    <p className="font-medium text-slate-800">{s.name}</p>
                    <div className="mt-1 w-40"><Bar value={s.views} max={maxSub} tone="violet" /></div>
                  </Td>
                  <Td>{s.designs}</Td>
                  <Td className="font-semibold">{nice(s.views)}</Td>
                </tr>
              ))}
            </Table>
          </div>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHead title="Revenue by day" />
          <div className="px-5 py-5">
            <div className="flex h-[150px] items-end gap-[3px]">
              {d.revenueByDay.map((r) => {
                const max = Math.max(1, ...d.revenueByDay.map((x) => x.amount));
                return (
                  <div key={r.date} className="group relative flex-1">
                    <div className={`w-full rounded-t ${r.amount > 0 ? "bg-emerald-400 group-hover:bg-emerald-500" : "bg-slate-100"}`} style={{ height: `${Math.max(3, (r.amount / max) * 140)}px` }} />
                  </div>
                );
              })}
            </div>
          </div>
        </Card>

        <Card>
          <CardHead title="Searches with no results" sub="Content gaps to fill" />
          {d.searchTerms.filter((s) => s.zero > 0).length === 0 ? (
            <p className="px-5 py-10 text-center text-[12px] text-slate-400">Every search returned results 🎉</p>
          ) : (
            <div className="space-y-2 p-4">
              {d.searchTerms.filter((s) => s.zero > 0).map((s) => (
                <div key={s.term} className="flex items-center justify-between rounded-lg bg-rose-50 px-3 py-2 ring-1 ring-inset ring-rose-100">
                  <span className="text-[12.5px] font-medium text-rose-900">{s.term}</span>
                  <Pill tone="rose">{s.zero} empty</Pill>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <Card>
        <CardHead title="Category performance" />
        <Table head={["Category", "Designs", "Views", "Downloads", "Share of views"]}>
          {d.catStats.map((c) => (
            <tr key={c.slug} className="hover:bg-slate-50">
              <Td className="font-medium text-slate-800">{c.emoji} {c.name}</Td>
              <Td>{c.designs}</Td>
              <Td>{nice(c.views)}</Td>
              <Td>{nice(c.downloads)}</Td>
              <Td><div className="w-40"><Bar value={c.views} max={Math.max(1, t.views)} /></div></Td>
            </tr>
          ))}
        </Table>
      </Card>
    </div>
  );
}
