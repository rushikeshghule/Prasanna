import { BillingPanel } from "@/components/admin/people-panel";
import { getBilling, getCatalog } from "@/server/admin-store";

export const dynamic = "force-dynamic";

export default async function Page({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const sp = await searchParams;
  const [b, c] = await Promise.all([getBilling(), getCatalog()]);
  return (
    <BillingPanel
      plans={b.plans}
      payments={b.payments}
      categories={c.categories.map((x) => ({ slug: x.slug, name: x.name }))}
      initialTab={sp.tab}
    />
  );
}
