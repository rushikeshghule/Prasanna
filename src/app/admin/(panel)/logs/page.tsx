import { getLogs } from "@/server/admin-store";
import { Card, CardHead, I, Pill, Stat, Table, Td } from "@/components/admin/ui";
import { whenTime } from "@/lib/format";

export const dynamic = "force-dynamic";

const tone = (entity: string) =>
  ({ design: "violet", category: "blue", plan: "amber", user: "rose", payment: "green", session: "slate" })[entity] ?? "slate";

export default async function Page() {
  const { logs, logins } = await getLogs();
  const failed = logins.filter((l) => !l.ok).length;

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-[18px] font-semibold tracking-tight text-slate-900">Audit logs</h2>
        <p className="mt-0.5 text-[12.5px] text-slate-500">
          Every administrative change is recorded with the action, affected record, previous and new value, IP
          address and timestamp.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Logged actions" value={logs.length} icon="shield" tone="blue" />
        <Stat label="Login attempts" value={logins.length} sub={`${failed} failed`} icon="lock" tone={failed ? "amber" : "green"} />
        <Stat label="Content changes" value={logs.filter((l) => ["design", "category", "collection"].includes(l.entity)).length} icon="image" tone="violet" />
        <Stat label="Billing changes" value={logs.filter((l) => ["plan", "payment", "user"].includes(l.entity)).length} icon="card" tone="amber" />
      </div>

      <Card>
        <CardHead title="Activity trail" sub="Newest first · retained for 12 months" />
        {logs.length === 0 ? (
          <p className="px-5 py-10 text-center text-[12px] text-slate-400">No activity recorded yet.</p>
        ) : (
          <Table head={["When", "Admin", "Action", "Record", "Change", "IP"]}>
            {logs.map((l) => (
              <tr key={l.id} className="hover:bg-slate-50">
                <Td className="whitespace-nowrap text-[11.5px] text-slate-500">{whenTime(l.createdAt)}</Td>
                <Td className="whitespace-nowrap font-medium text-slate-800">{l.adminName}</Td>
                <Td>
                  <div className="flex items-center gap-2">
                    <Pill tone={tone(l.entity)}>{l.entity}</Pill>
                    <span className="text-[12.5px] text-slate-700">{l.action}</span>
                  </div>
                </Td>
                <Td className="max-w-[180px] truncate font-mono text-[11px] text-slate-500">{l.entityRef ?? "—"}</Td>
                <Td className="max-w-[240px] text-[11px] text-slate-500">
                  {l.before ? <span className="text-rose-600 line-through">{l.before.slice(0, 60)}</span> : null}
                  {l.before && l.after ? " → " : null}
                  {l.after ? <span className="text-emerald-700">{l.after.slice(0, 60)}</span> : null}
                  {!l.before && !l.after ? "—" : null}
                </Td>
                <Td className="whitespace-nowrap font-mono text-[11px] text-slate-400">{l.ip ?? "—"}</Td>
              </tr>
            ))}
          </Table>
        )}
      </Card>

      <Card>
        <CardHead title="Admin login history" sub="Successful and failed sign-in attempts" />
        <Table head={["When", "Email", "Device", "IP", "Result"]}>
          {logins.map((l) => (
            <tr key={l.id} className="hover:bg-slate-50">
              <Td className="whitespace-nowrap text-[11.5px] text-slate-500">{whenTime(l.createdAt)}</Td>
              <Td className="font-medium text-slate-800">{l.email}</Td>
              <Td className="text-[11.5px] text-slate-500">{l.device ?? "—"}</Td>
              <Td className="font-mono text-[11px] text-slate-400">{l.ip ?? "—"}</Td>
              <Td>
                {l.ok ? (
                  <Pill tone="green">
                    <I n="check" c="h-2.5 w-2.5" /> success
                  </Pill>
                ) : (
                  <Pill tone="rose">failed</Pill>
                )}
              </Td>
            </tr>
          ))}
        </Table>
      </Card>
    </div>
  );
}
