import { LocalizationPanel } from "@/components/admin/system-panel";
import { getLocalization } from "@/server/admin-store";

export const dynamic = "force-dynamic";

export default async function Page() {
  const d = await getLocalization();
  return (
    <LocalizationPanel
      languages={d.languages}
      missing={d.missing}
      totalStrings={d.totalStrings}
      categories={d.categories.map((c) => ({ slug: c.slug, name: c.name, nameHi: c.nameHi, nameMr: c.nameMr }))}
      collections={d.collections.map((c) => ({ slug: c.slug, name: c.name, nameHi: c.nameHi, nameMr: c.nameMr }))}
    />
  );
}
