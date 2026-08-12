import { and, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import {
  appUsers,
  designReports,
  designs,
  downloadLogs,
  recentViews,
  searchLogs,
  supportTickets,
} from "@/db/schema";
import { getUser } from "@/server/store";

export const dynamic = "force-dynamic";

type Payload = {
  type: "view" | "download" | "share" | "report" | "search" | "support" | "clear-recent";
  designCode?: string;
  quality?: string;
  watermarked?: boolean;
  reason?: string;
  note?: string;
  term?: string;
  results?: number;
  subject?: string;
  message?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Payload;
    const user = await getUser();
    const code = body.designCode;

    switch (body.type) {
      case "view": {
        if (!code) break;
        await db
          .delete(recentViews)
          .where(and(eq(recentViews.userId, user.id), eq(recentViews.designCode, code)));
        await db.insert(recentViews).values({ userId: user.id, designCode: code });
        await db
          .update(designs)
          .set({ views: sql`${designs.views} + 1` })
          .where(eq(designs.code, code));
        break;
      }
      case "download": {
        if (!code) break;
        await db.insert(downloadLogs).values({
          userId: user.id,
          designCode: code,
          quality: body.quality ?? "HD",
          watermarked: Boolean(body.watermarked),
        });
        await db
          .update(designs)
          .set({ downloads: sql`${designs.downloads} + 1` })
          .where(eq(designs.code, code));
        await db
          .update(appUsers)
          .set({ downloadsUsed: sql`${appUsers.downloadsUsed} + 1` })
          .where(eq(appUsers.id, user.id));
        break;
      }
      case "share": {
        if (!code) break;
        await db
          .update(designs)
          .set({ shares: sql`${designs.shares} + 1` })
          .where(eq(designs.code, code));
        break;
      }
      case "report": {
        if (!code) break;
        await db.insert(designReports).values({
          userId: user.id,
          designCode: code,
          reason: body.reason ?? "Other reason",
          note: body.note ?? null,
        });
        break;
      }
      case "search": {
        if (!body.term) break;
        await db.insert(searchLogs).values({
          userId: user.id,
          term: body.term,
          results: body.results ?? 0,
        });
        break;
      }
      case "support": {
        await db.insert(supportTickets).values({
          userId: user.id,
          subject: body.subject ?? "Support request",
          message: body.message ?? "",
        });
        break;
      }
      case "clear-recent": {
        await db.delete(recentViews).where(eq(recentViews.userId, user.id));
        break;
      }
      default:
        return Response.json({ error: "unknown_event" }, { status: 400 });
    }

    return Response.json({ ok: true });
  } catch (error) {
    console.error("event failed", error);
    return Response.json({ error: "event_failed" }, { status: 500 });
  }
}
