import { getBootstrap } from "@/server/store";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await getBootstrap();
    return Response.json(data);
  } catch (error) {
    console.error("bootstrap failed", error);
    return Response.json({ error: "bootstrap_failed" }, { status: 500 });
  }
}
