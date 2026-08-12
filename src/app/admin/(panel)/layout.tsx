import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { Shell } from "@/components/admin/shell";
import { getAdminSession } from "@/lib/admin-auth";
import { ensureAdminSeeded } from "@/server/admin-store";

export const dynamic = "force-dynamic";

export const metadata = { title: "Admin — Prasanna Trends" };

export default async function PanelLayout({ children }: { children: ReactNode }) {
  await ensureAdminSeeded();
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  return <Shell admin={{ name: session.name, email: session.email }}>{children}</Shell>;
}
