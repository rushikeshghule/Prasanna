import { NotificationsPanel } from "@/components/admin/system-panel";
import { getCampaigns, getCatalog } from "@/server/admin-store";

export const dynamic = "force-dynamic";

export default async function Page() {
  const [c, cat] = await Promise.all([getCampaigns(), getCatalog()]);
  return (
    <NotificationsPanel
      campaigns={c.campaigns}
      audienceSizes={c.audienceSizes}
      collections={cat.collections.map((x) => ({ slug: x.slug, name: x.name }))}
    />
  );
}
