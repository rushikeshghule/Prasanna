import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { appUsers, payments, plans, userNotifications } from "@/db/schema";
import { getUser } from "@/server/store";
import type { PaymentItem } from "@/lib/types";

export const dynamic = "force-dynamic";

type Payload = {
  action?: "purchase" | "cancel" | "reset";
  planCode?: string;
  method?: string;
  outcome?: "success" | "failed";
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Payload;
    const user = await getUser();
    const action = body.action ?? "purchase";

    if (action === "cancel") {
      await db.update(appUsers).set({ subStatus: "cancelled" }).where(eq(appUsers.id, user.id));
    } else if (action === "reset") {
      await db
        .update(appUsers)
        .set({
          subStatus: "none",
          planCode: null,
          subStartedAt: null,
          subExpiresAt: null,
          downloadsUsed: 0,
        })
        .where(eq(appUsers.id, user.id));
    } else {
      const planRows = await db.select().from(plans).where(eq(plans.code, body.planCode ?? ""));
      const plan = planRows[0];
      if (!plan) return Response.json({ error: "plan_not_found" }, { status: 404 });

      const amount = Number(plan.price);
      const tax = Math.round(amount * plan.taxPercent) / 100;
      const outcome = body.outcome ?? "success";
      const ref = `pay_${Math.random().toString(36).slice(2, 12)}`;
      const invoiceNo = `PT-INV-${2100 + Math.floor(Math.random() * 800)}`;

      await db.insert(payments).values({
        userId: user.id,
        planCode: plan.code,
        invoiceNo,
        amount: amount.toFixed(2),
        tax: tax.toFixed(2),
        total: (amount + tax).toFixed(2),
        method: body.method ?? "UPI",
        status: outcome,
        gatewayRef: ref,
      });

      if (outcome === "success") {
        const now = new Date();
        const expiry = new Date(now.getTime() + plan.durationDays * 86400 * 1000);
        await db
          .update(appUsers)
          .set({
            planCode: plan.code,
            subStatus: "active",
            subStartedAt: now,
            subExpiresAt: expiry,
            downloadsUsed: 0,
          })
          .where(eq(appUsers.id, user.id));

        await db.insert(userNotifications).values({
          userId: user.id,
          title: "Subscription activated 🎉",
          body: `${plan.name} is active till ${expiry.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}. Invoice ${invoiceNo} for ₹${(amount + tax).toFixed(0)} is ready.`,
          kind: "subscription",
          target: "screen:subscription",
        });
      } else {
        await db.insert(userNotifications).values({
          userId: user.id,
          title: "Payment failed",
          body: `We could not confirm your ₹${(amount + tax).toFixed(0)} payment (${ref}). No amount was captured — you can retry safely.`,
          kind: "payment",
          target: "screen:plans",
        });
      }
    }

    const updated = await getUser();
    const payRows = await db
      .select()
      .from(payments)
      .where(eq(payments.userId, updated.id))
      .orderBy(desc(payments.createdAt));
    const notifRows = await db
      .select()
      .from(userNotifications)
      .where(eq(userNotifications.userId, updated.id))
      .orderBy(desc(userNotifications.createdAt));

    const paymentItems: PaymentItem[] = payRows.map((p) => ({
      id: p.id,
      planCode: p.planCode,
      invoiceNo: p.invoiceNo,
      amount: Number(p.amount),
      tax: Number(p.tax),
      total: Number(p.total),
      method: p.method,
      status: p.status,
      gatewayRef: p.gatewayRef,
      createdAt: p.createdAt.toISOString(),
    }));

    return Response.json({
      ok: true,
      user: updated,
      payments: paymentItems,
      notifications: notifRows.map((n) => ({
        id: n.id,
        title: n.title,
        body: n.body,
        kind: n.kind,
        image: n.image,
        target: n.target,
        isRead: n.isRead,
        createdAt: n.createdAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error("subscribe failed", error);
    return Response.json({ error: "subscribe_failed" }, { status: 500 });
  }
}
