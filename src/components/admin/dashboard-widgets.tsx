"use client";

import { useRouter } from "next/navigation";
import { ActionBtn, I } from "./ui";
import { simulateTraffic } from "@/app/admin/actions";

const RANGES = [7, 30, 90];

export function RangePicker({ value }: { value: number }) {
  const router = useRouter();
  return (
    <div className="inline-flex rounded-lg border border-slate-300 bg-white p-0.5">
      {RANGES.map((r) => (
        <button
          key={r}
          type="button"
          onClick={() => router.push(`/admin?range=${r}`)}
          className={`rounded-md px-3 py-1.5 text-[12px] font-semibold transition ${
            value === r ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          {r}d
        </button>
      ))}
    </div>
  );
}

export function SimulateBtn() {
  return (
    <ActionBtn action={simulateTraffic} variant="outline" size="md">
      <I n="refresh" c="h-3.5 w-3.5" />
      Simulate traffic
    </ActionBtn>
  );
}
