"use client";

import { useRouter } from "next/navigation";
import { Btn, I } from "./ui";

export function RangeLinks({ value }: { value: number }) {
  const router = useRouter();
  return (
    <div className="inline-flex rounded-lg border border-slate-300 bg-white p-0.5">
      {[7, 30, 90].map((r) => (
        <button
          key={r}
          type="button"
          onClick={() => router.push(`/admin/reports?range=${r}`)}
          className={`rounded-md px-3 py-1.5 text-[12px] font-semibold transition ${value === r ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"}`}
        >
          {r} days
        </button>
      ))}
    </div>
  );
}

export function ExportBtn({ rows, name }: { rows: Record<string, string | number>[]; name: string }) {
  const download = () => {
    if (rows.length === 0) return;
    const head = Object.keys(rows[0]).join(",");
    const body = rows.map((r) => Object.values(r).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([`${head}\n${body}`], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `${name}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };
  return (
    <Btn variant="outline" onClick={download}>
      <I n="download" c="h-3.5 w-3.5" /> Export CSV
    </Btn>
  );
}
