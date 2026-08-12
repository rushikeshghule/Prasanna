import { eq } from "drizzle-orm";
import { db } from "@/db";
import { appUsers, userNotifications } from "@/db/schema";
import { getUser } from "@/server/store";

export const dynamic = "force-dynamic";

type Payload = {
  action: "profile" | "language" | "prefs" | "delete" | "restore" | "read-notifications";
  name?: string;
  email?: string;
  language?: string;
  pushEnabled?: boolean;
  promoEnabled?: boolean;
  emailEnabled?: boolean;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Payload;
    const user = await getUser();

    switch (body.action) {
      case "profile":
        await db
          .update(appUsers)
          .set({ name: body.name ?? user.name, email: body.email ?? user.email })
          .where(eq(appUsers.id, user.id));
        break;
      case "language":
        await db
          .update(appUsers)
          .set({ language: body.language ?? "en" })
          .where(eq(appUsers.id, user.id));
        break;
      case "prefs":
        await db
          .update(appUsers)
          .set({
            pushEnabled: body.pushEnabled ?? user.pushEnabled,
            promoEnabled: body.promoEnabled ?? user.promoEnabled,
            emailEnabled: body.emailEnabled ?? user.emailEnabled,
          })
          .where(eq(appUsers.id, user.id));
        break;
      case "delete":
        await db
          .update(appUsers)
          .set({ deletionRequested: true })
          .where(eq(appUsers.id, user.id));
        break;
      case "restore":
        await db
          .update(appUsers)
          .set({ deletionRequested: false })
          .where(eq(appUsers.id, user.id));
        break;
      case "read-notifications":
        await db
          .update(userNotifications)
          .set({ isRead: true })
          .where(eq(userNotifications.userId, user.id));
        break;
      default:
        return Response.json({ error: "unknown_action" }, { status: 400 });
    }

    const updated = await getUser();
    return Response.json({ ok: true, user: updated });
  } catch (error) {
    console.error("account update failed", error);
    return Response.json({ error: "account_failed" }, { status: 500 });
  }
}
