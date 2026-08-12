import { ContentPanel } from "@/components/admin/system-panel";
import { getContent } from "@/server/admin-store";

export const dynamic = "force-dynamic";

export default async function Page({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const sp = await searchParams;
  const d = await getContent();
  return (
    <ContentPanel
      faqs={d.faqs}
      legal={d.legal}
      settings={d.settings}
      reports={d.reports}
      tickets={d.tickets}
      initialTab={sp.tab}
    />
  );
}
