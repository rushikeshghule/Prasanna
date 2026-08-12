import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin-auth";
import { ensureAdminSeeded } from "@/server/admin-store";
import { LoginForm } from "./form";

export const dynamic = "force-dynamic";

export const metadata = { title: "Admin login — Prasanna Trends" };

export default async function AdminLoginPage() {
  await ensureAdminSeeded();
  const session = await getAdminSession();
  if (session) redirect("/admin");
  return <LoginForm />;
}
