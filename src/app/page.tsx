import { PhoneApp } from "@/components/phone-app";
import { getBootstrap } from "@/server/store";

export const dynamic = "force-dynamic";

export default async function Page() {
  const data = await getBootstrap();
  return <PhoneApp data={data} />;
}
