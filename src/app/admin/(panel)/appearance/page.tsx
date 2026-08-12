import { AppearancePanel } from "@/components/admin/system-panel";
import { getAppearance } from "@/server/admin-store";

export const dynamic = "force-dynamic";

export default async function Page() {
  const d = await getAppearance();
  return (
    <AppearancePanel
      banners={d.banners}
      sections={d.sections}
      categories={d.categories.map((c) => ({ slug: c.slug, name: c.name }))}
      collections={d.collections.map((c) => ({ slug: c.slug, name: c.name }))}
    />
  );
}
