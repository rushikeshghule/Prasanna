import { and, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { designs, favorites } from "@/db/schema";
import { getUser } from "@/server/store";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { designCode?: string; folder?: string };
    const designCode = body.designCode;
    if (!designCode) return Response.json({ error: "designCode_required" }, { status: 400 });

    const user = await getUser();
    const existing = await db
      .select()
      .from(favorites)
      .where(and(eq(favorites.userId, user.id), eq(favorites.designCode, designCode)));

    if (existing.length > 0) {
      await db
        .delete(favorites)
        .where(and(eq(favorites.userId, user.id), eq(favorites.designCode, designCode)));
      await db
        .update(designs)
        .set({ favourites: sql`greatest(${designs.favourites} - 1, 0)` })
        .where(eq(designs.code, designCode));
      return Response.json({ ok: true, favourited: false });
    }

    await db.insert(favorites).values({
      userId: user.id,
      designCode,
      folder: body.folder ?? "All favourites",
    });
    await db
      .update(designs)
      .set({ favourites: sql`${designs.favourites} + 1` })
      .where(eq(designs.code, designCode));
    return Response.json({ ok: true, favourited: true });
  } catch (error) {
    console.error("favorite failed", error);
    return Response.json({ error: "favorite_failed" }, { status: 500 });
  }
}
