import { DesignsPanel } from "@/components/admin/designs-panel";
import { getDesigns } from "@/server/admin-store";

export const dynamic = "force-dynamic";

export default async function Page({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const sp = await searchParams;
  const d = await getDesigns();
  return (
    <DesignsPanel
      designs={d.designs}
      categories={d.categories}
      subcategories={d.subcategories}
      collections={d.collections}
      plans={d.plans}
      initialStatus={sp.status}
    />
  );
}
