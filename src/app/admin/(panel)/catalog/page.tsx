import { CatalogPanel } from "@/components/admin/catalog-panel";
import { getCatalog } from "@/server/admin-store";

export const dynamic = "force-dynamic";

export default async function Page() {
  const d = await getCatalog();
  return <CatalogPanel categories={d.categories} subcategories={d.subcategories} collections={d.collections} />;
}
