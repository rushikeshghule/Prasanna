import { UsersPanel } from "@/components/admin/people-panel";
import { getUsers } from "@/server/admin-store";

export const dynamic = "force-dynamic";

export default async function Page() {
  const d = await getUsers();
  return <UsersPanel users={d.users} plans={d.plans} />;
}
