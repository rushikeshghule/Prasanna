"use server";

import { and, eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/db";
import {
  adminLogins,
  adminUsers,
  appSettings,
  appUsers,
  banners,
  campaigns,
  categories,
  collections,
  designReports,
  designs,
  faqs,
  homeSections,
  languages,
  legalPages,
  payments,
  plans,
  subcategories,
  supportTickets,
  userNotifications,
} from "@/db/schema";
import {
  clearAdminCookie,
  getAdminSession,
  hashPassword,
  requestMeta,
  setAdminCookie,
} from "@/lib/admin-auth";
import { ensureAdminSeeded, logAudit } from "@/server/admin-store";

async function requireAdmin() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  return session;
}

function refresh() {
  revalidatePath("/admin", "layout");
  revalidatePath("/");
}

/* ----------------------------- auth ----------------------------- */

export async function loginAction(_prev: { error?: string } | null, formData: FormData) {
  await ensureAdminSeeded();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const { ip, device } = await requestMeta();

  const rows = await db.select().from(adminUsers).where(eq(adminUsers.email, email));
  const admin = rows[0];
  const ok = Boolean(admin) && admin.password === hashPassword(password);

  await db.insert(adminLogins).values({ email: email || "(blank)", ok, ip, device });

  if (!ok) {
    return { error: "Incorrect email or password. Try admin@prasannatrends.in / admin123" };
  }

  await db.update(adminUsers).set({ lastLoginAt: new Date() }).where(eq(adminUsers.id, admin.id));
  await setAdminCookie({ email: admin.email, name: admin.name, issuedAt: Date.now() });
  await logAudit(admin.name, "Admin login", "session", admin.email);
  redirect("/admin");
}

export async function logoutAction() {
  const session = await getAdminSession();
  if (session) await logAudit(session.name, "Admin logout", "session", session.email);
  await clearAdminCookie();
  redirect("/admin/login");
}

/* ----------------------------- catalog ----------------------------- */

export type CategoryInput = {
  id?: number;
  slug: string;
  name: string;
  nameHi?: string;
  nameMr?: string;
  emoji: string;
  tagline?: string;
  cover: string;
  accent: string;
  displayOrder: number;
  isFeatured: boolean;
  isActive: boolean;
  comingSoon: boolean;
};

export async function saveCategory(input: CategoryInput) {
  const a = await requireAdmin();
  const values = {
    slug: input.slug,
    name: input.name,
    nameHi: input.nameHi || null,
    nameMr: input.nameMr || null,
    emoji: input.emoji || "✨",
    tagline: input.tagline || null,
    cover: input.cover,
    accent: input.accent,
    displayOrder: input.displayOrder,
    isFeatured: input.isFeatured,
    isActive: input.isActive,
    comingSoon: input.comingSoon,
  };
  if (input.id) {
    const before = (await db.select().from(categories).where(eq(categories.id, input.id)))[0];
    await db.update(categories).set(values).where(eq(categories.id, input.id));
    await logAudit(a.name, "Updated category", "category", input.slug, before?.name, values.name);
  } else {
    await db.insert(categories).values(values);
    await logAudit(a.name, "Created category", "category", input.slug, null, values.name);
  }
  refresh();
}

export async function toggleCategory(id: number, field: "isActive" | "isFeatured" | "comingSoon") {
  const a = await requireAdmin();
  const row = (await db.select().from(categories).where(eq(categories.id, id)))[0];
  if (!row) return;
  const next = !row[field];
  await db.update(categories).set({ [field]: next }).where(eq(categories.id, id));
  await logAudit(a.name, `Category ${field} → ${next}`, "category", row.slug, String(row[field]), String(next));
  refresh();
}

export async function deleteCategory(id: number) {
  const a = await requireAdmin();
  const row = (await db.select().from(categories).where(eq(categories.id, id)))[0];
  if (!row) return;
  await db.update(categories).set({ isActive: false }).where(eq(categories.id, id));
  await logAudit(a.name, "Archived category (soft delete)", "category", row.slug, "active", "archived");
  refresh();
}

export async function saveSubcategory(input: {
  id?: number;
  slug: string;
  categorySlug: string;
  name: string;
  nameHi?: string;
  nameMr?: string;
  cover: string;
  displayOrder: number;
  isActive: boolean;
}) {
  const a = await requireAdmin();
  const values = {
    slug: input.slug,
    categorySlug: input.categorySlug,
    name: input.name,
    nameHi: input.nameHi || null,
    nameMr: input.nameMr || null,
    cover: input.cover,
    displayOrder: input.displayOrder,
    isActive: input.isActive,
  };
  if (input.id) {
    await db.update(subcategories).set(values).where(eq(subcategories.id, input.id));
    await logAudit(a.name, "Updated subcategory", "subcategory", input.slug);
  } else {
    await db.insert(subcategories).values(values);
    await logAudit(a.name, "Created subcategory", "subcategory", input.slug);
  }
  refresh();
}

export async function saveCollection(input: {
  id?: number;
  slug: string;
  categorySlug: string;
  subcategorySlug: string;
  name: string;
  nameHi?: string;
  nameMr?: string;
  cover: string;
  blurb?: string;
  isFeatured: boolean;
  displayOrder: number;
}) {
  const a = await requireAdmin();
  const values = {
    slug: input.slug,
    categorySlug: input.categorySlug,
    subcategorySlug: input.subcategorySlug,
    name: input.name,
    nameHi: input.nameHi || null,
    nameMr: input.nameMr || null,
    cover: input.cover,
    blurb: input.blurb || null,
    isFeatured: input.isFeatured,
    displayOrder: input.displayOrder,
  };
  if (input.id) {
    await db.update(collections).set(values).where(eq(collections.id, input.id));
    await logAudit(a.name, "Updated collection", "collection", input.slug);
  } else {
    await db.insert(collections).values(values);
    await logAudit(a.name, "Created collection", "collection", input.slug);
  }
  refresh();
}

export async function toggleCollectionFeatured(id: number) {
  const a = await requireAdmin();
  const row = (await db.select().from(collections).where(eq(collections.id, id)))[0];
  if (!row) return;
  await db.update(collections).set({ isFeatured: !row.isFeatured }).where(eq(collections.id, id));
  await logAudit(a.name, `Collection featured → ${!row.isFeatured}`, "collection", row.slug);
  refresh();
}

/* ----------------------------- designs ----------------------------- */

export type DesignInput = {
  id?: number;
  code: string;
  title: string;
  titleHi?: string | null;
  titleMr?: string | null;
  description: string;
  categorySlug: string;
  subcategorySlug: string;
  collectionSlug: string;
  image: string;
  thumb: string;
  isPremium: boolean;
  requiredPlan?: string | null;
  allowDownload: boolean;
  allowShare: boolean;
  watermark: boolean;
  colour: string;
  style: string;
  material: string;
  occasion: string;
  gender: string;
  tags: string[];
  status: string;
  isFeatured: boolean;
  isTrending: boolean;
};

export async function saveDesign(input: DesignInput) {
  const a = await requireAdmin();
  const values = {
    code: input.code,
    title: input.title,
    titleHi: input.titleHi || null,
    titleMr: input.titleMr || null,
    description: input.description,
    categorySlug: input.categorySlug,
    subcategorySlug: input.subcategorySlug,
    collectionSlug: input.collectionSlug,
    image: input.image,
    thumb: input.thumb || input.image,
    isPremium: input.isPremium,
    requiredPlan: input.isPremium ? input.requiredPlan || "basic-monthly" : null,
    allowDownload: input.allowDownload,
    allowShare: input.allowShare,
    watermark: input.watermark,
    colour: input.colour,
    style: input.style,
    material: input.material,
    occasion: input.occasion,
    gender: input.gender,
    tags: input.tags,
    status: input.status,
    isFeatured: input.isFeatured,
    isTrending: input.isTrending,
  };
  if (input.id) {
    const before = (await db.select().from(designs).where(eq(designs.id, input.id)))[0];
    await db.update(designs).set(values).where(eq(designs.id, input.id));
    await logAudit(
      a.name,
      "Updated design",
      "design",
      input.code,
      { status: before?.status, premium: before?.isPremium },
      { status: values.status, premium: values.isPremium },
    );
  } else {
    await db.insert(designs).values({ ...values, publishedAt: new Date() });
    await logAudit(a.name, "Uploaded design", "design", input.code, null, values.status);
  }
  refresh();
}

export async function bulkDesignAction(codes: string[], action: string) {
  const a = await requireAdmin();
  if (codes.length === 0) return;
  const patch: Record<string, unknown> = {};
  if (action === "publish") patch.status = "published";
  if (action === "draft") patch.status = "draft";
  if (action === "archive") patch.status = "archived";
  if (action === "inactive") patch.status = "inactive";
  if (action === "premium") {
    patch.isPremium = true;
    patch.requiredPlan = "basic-monthly";
    patch.watermark = true;
  }
  if (action === "free") {
    patch.isPremium = false;
    patch.requiredPlan = null;
    patch.watermark = false;
  }
  if (action === "feature") patch.isFeatured = true;
  if (action === "unfeature") patch.isFeatured = false;
  if (Object.keys(patch).length === 0) return;

  for (const code of codes) {
    await db.update(designs).set(patch).where(eq(designs.code, code));
  }
  await logAudit(a.name, `Bulk action “${action}” on ${codes.length} designs`, "design", codes.join(", ").slice(0, 200), null, JSON.stringify(patch));
  refresh();
}

/* ----------------------------- users ----------------------------- */

export async function updateUserStatus(id: number, status: string) {
  const a = await requireAdmin();
  const before = (await db.select().from(appUsers).where(eq(appUsers.id, id)))[0];
  await db.update(appUsers).set({ status }).where(eq(appUsers.id, id));
  await logAudit(a.name, `User ${status}`, "user", before?.phone, before?.status, status);
  refresh();
}

export async function grantPlan(id: number, planCode: string, days: number) {
  const a = await requireAdmin();
  const plan = (await db.select().from(plans).where(eq(plans.code, planCode)))[0];
  if (!plan) return;
  const user = (await db.select().from(appUsers).where(eq(appUsers.id, id)))[0];
  const base = user?.subExpiresAt && user.subExpiresAt > new Date() ? user.subExpiresAt : new Date();
  const expiry = new Date(base.getTime() + days * 86400 * 1000);
  await db
    .update(appUsers)
    .set({ planCode, subStatus: "active", subStartedAt: user?.subStartedAt ?? new Date(), subExpiresAt: expiry })
    .where(eq(appUsers.id, id));
  await db.insert(userNotifications).values({
    userId: id,
    title: "Subscription updated by our team",
    body: `${plan.name} is active till ${expiry.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}.`,
    kind: "subscription",
    target: "screen:subscription",
  });
  await logAudit(a.name, `Manual subscription: ${plan.name} +${days}d`, "user", user?.phone, user?.subStatus, "active");
  refresh();
}

export async function revokePlan(id: number) {
  const a = await requireAdmin();
  const user = (await db.select().from(appUsers).where(eq(appUsers.id, id)))[0];
  await db
    .update(appUsers)
    .set({ planCode: null, subStatus: "none", subStartedAt: null, subExpiresAt: null })
    .where(eq(appUsers.id, id));
  await logAudit(a.name, "Revoked subscription", "user", user?.phone, user?.subStatus, "none");
  refresh();
}

export async function processDeletion(id: number, approve: boolean) {
  const a = await requireAdmin();
  const user = (await db.select().from(appUsers).where(eq(appUsers.id, id)))[0];
  if (approve) {
    await db
      .update(appUsers)
      .set({ name: "Deleted user", email: null, avatar: null, status: "deleted", deletionRequested: false })
      .where(eq(appUsers.id, id));
    await logAudit(a.name, "Processed account deletion (anonymised)", "user", user?.phone, user?.name, "Deleted user");
  } else {
    await db.update(appUsers).set({ deletionRequested: false }).where(eq(appUsers.id, id));
    await logAudit(a.name, "Rejected deletion request", "user", user?.phone);
  }
  refresh();
}

/* ----------------------------- billing ----------------------------- */

export async function savePlan(input: {
  id?: number;
  code: string;
  name: string;
  description: string;
  price: number;
  mrp?: number | null;
  taxPercent: number;
  durationDays: number;
  durationLabel: string;
  benefits: string[];
  includedCategories: string[];
  downloadLimit: number;
  quality: string;
  trialDays: number;
  isPopular: boolean;
  isActive: boolean;
  displayOrder: number;
}) {
  const a = await requireAdmin();
  const values = {
    code: input.code,
    name: input.name,
    description: input.description,
    price: input.price.toFixed(2),
    mrp: input.mrp ? input.mrp.toFixed(2) : null,
    taxPercent: input.taxPercent,
    durationDays: input.durationDays,
    durationLabel: input.durationLabel,
    benefits: input.benefits,
    includedCategories: input.includedCategories,
    downloadLimit: input.downloadLimit,
    quality: input.quality,
    trialDays: input.trialDays,
    isPopular: input.isPopular,
    isActive: input.isActive,
    displayOrder: input.displayOrder,
  };
  if (input.id) {
    const before = (await db.select().from(plans).where(eq(plans.id, input.id)))[0];
    await db.update(plans).set(values).where(eq(plans.id, input.id));
    await logAudit(a.name, "Updated plan", "plan", input.code, `₹${before?.price}`, `₹${values.price}`);
  } else {
    await db.insert(plans).values(values);
    await logAudit(a.name, "Created plan", "plan", input.code, null, `₹${values.price}`);
  }
  refresh();
}

export async function togglePlan(id: number) {
  const a = await requireAdmin();
  const row = (await db.select().from(plans).where(eq(plans.id, id)))[0];
  if (!row) return;
  await db.update(plans).set({ isActive: !row.isActive }).where(eq(plans.id, id));
  await logAudit(a.name, `Plan ${!row.isActive ? "activated" : "deactivated"}`, "plan", row.code);
  refresh();
}

export async function refundPayment(id: number) {
  const a = await requireAdmin();
  const row = (await db.select().from(payments).where(eq(payments.id, id)))[0];
  if (!row) return;
  await db.update(payments).set({ status: "refunded" }).where(eq(payments.id, id));
  await logAudit(a.name, `Refund issued ₹${row.total}`, "payment", row.invoiceNo, row.status, "refunded");
  refresh();
}

export async function recheckPayment(id: number) {
  const a = await requireAdmin();
  const row = (await db.select().from(payments).where(eq(payments.id, id)))[0];
  if (!row) return;
  await logAudit(a.name, "Re-checked payment with gateway", "payment", row.invoiceNo, row.status, row.status);
  refresh();
}

/* ----------------------------- appearance ----------------------------- */

export async function saveBanner(input: {
  id?: number;
  title: string;
  titleHi?: string;
  subtitle: string;
  image: string;
  cta: string;
  target: string;
  tone: string;
  displayOrder: number;
  isActive: boolean;
}) {
  const a = await requireAdmin();
  const values = {
    title: input.title,
    titleHi: input.titleHi || null,
    subtitle: input.subtitle,
    image: input.image,
    cta: input.cta,
    target: input.target,
    tone: input.tone,
    displayOrder: input.displayOrder,
    isActive: input.isActive,
  };
  if (input.id) {
    await db.update(banners).set(values).where(eq(banners.id, input.id));
    await logAudit(a.name, "Updated banner", "banner", input.title);
  } else {
    await db.insert(banners).values(values);
    await logAudit(a.name, "Created banner", "banner", input.title);
  }
  refresh();
}

export async function toggleBanner(id: number) {
  const a = await requireAdmin();
  const row = (await db.select().from(banners).where(eq(banners.id, id)))[0];
  if (!row) return;
  await db.update(banners).set({ isActive: !row.isActive }).where(eq(banners.id, id));
  await logAudit(a.name, `Banner ${!row.isActive ? "activated" : "paused"}`, "banner", row.title);
  refresh();
}

export async function deleteBanner(id: number) {
  const a = await requireAdmin();
  const row = (await db.select().from(banners).where(eq(banners.id, id)))[0];
  await db.delete(banners).where(eq(banners.id, id));
  await logAudit(a.name, "Deleted banner", "banner", row?.title);
  refresh();
}

export async function updateSection(key: string, patch: { title?: string; isVisible?: boolean; displayOrder?: number }) {
  const a = await requireAdmin();
  const row = (await db.select().from(homeSections).where(eq(homeSections.key, key)))[0];
  await db.update(homeSections).set(patch).where(eq(homeSections.key, key));
  await logAudit(a.name, "Updated home section", "section", key, JSON.stringify({ title: row?.title, visible: row?.isVisible, order: row?.displayOrder }), JSON.stringify(patch));
  refresh();
}

export async function moveSection(key: string, dir: -1 | 1) {
  const a = await requireAdmin();
  const rows = await db.select().from(homeSections).orderBy(homeSections.displayOrder);
  const idx = rows.findIndex((r) => r.key === key);
  const swap = idx + dir;
  if (idx < 0 || swap < 0 || swap >= rows.length) return;
  await db.update(homeSections).set({ displayOrder: rows[swap].displayOrder }).where(eq(homeSections.key, rows[idx].key));
  await db.update(homeSections).set({ displayOrder: rows[idx].displayOrder }).where(eq(homeSections.key, rows[swap].key));
  await logAudit(a.name, `Reordered home section ${dir < 0 ? "up" : "down"}`, "section", key);
  refresh();
}

/* ----------------------------- localization ----------------------------- */

export async function saveLanguage(input: {
  id?: number;
  code: string;
  name: string;
  nativeName: string;
  completion: number;
  isActive: boolean;
}) {
  const a = await requireAdmin();
  const values = { code: input.code, name: input.name, nativeName: input.nativeName, completion: input.completion, isActive: input.isActive };
  if (input.id) {
    await db.update(languages).set(values).where(eq(languages.id, input.id));
    await logAudit(a.name, "Updated language", "language", input.code);
  } else {
    await db.insert(languages).values(values);
    await logAudit(a.name, "Added language", "language", input.code);
  }
  refresh();
}

export async function toggleLanguage(id: number) {
  const a = await requireAdmin();
  const row = (await db.select().from(languages).where(eq(languages.id, id)))[0];
  if (!row || row.isDefault) return;
  await db.update(languages).set({ isActive: !row.isActive }).where(eq(languages.id, id));
  await logAudit(a.name, `Language ${!row.isActive ? "activated" : "deactivated"}`, "language", row.code);
  refresh();
}

export async function setDefaultLanguage(id: number) {
  const a = await requireAdmin();
  const row = (await db.select().from(languages).where(eq(languages.id, id)))[0];
  if (!row) return;
  await db.update(languages).set({ isDefault: false });
  await db.update(languages).set({ isDefault: true, isActive: true }).where(eq(languages.id, id));
  await db.update(appSettings).set({ value: row.code }).where(eq(appSettings.key, "defaultLanguage"));
  await logAudit(a.name, "Changed default language", "language", row.code);
  refresh();
}

export async function saveTranslation(entity: "category" | "collection" | "design", slug: string, hi: string, mr: string) {
  const a = await requireAdmin();
  if (entity === "category") {
    await db.update(categories).set({ nameHi: hi || null, nameMr: mr || null }).where(eq(categories.slug, slug));
  } else if (entity === "collection") {
    await db.update(collections).set({ nameHi: hi || null, nameMr: mr || null }).where(eq(collections.slug, slug));
  } else {
    await db.update(designs).set({ titleHi: hi || null, titleMr: mr || null }).where(eq(designs.code, slug));
  }
  await logAudit(a.name, "Saved translation", entity, slug, null, `hi: ${hi} / mr: ${mr}`);
  refresh();
}

/* ----------------------------- notifications ----------------------------- */

export async function sendCampaign(input: {
  title: string;
  body: string;
  audience: string;
  language: string;
  image?: string;
  target?: string;
  schedule?: string;
}) {
  const a = await requireAdmin();
  const all = await db.select().from(appUsers);
  const recipients = all.filter((u) => {
    if (input.audience === "premium") return u.subStatus === "active";
    if (input.audience === "free") return u.subStatus !== "active";
    if (input.audience === "expired") return ["expired", "cancelled"].includes(u.subStatus);
    return true;
  });
  const scheduled = Boolean(input.schedule);

  await db.insert(campaigns).values({
    title: input.title,
    body: input.body,
    audience: input.audience,
    language: input.language,
    image: input.image || null,
    target: input.target || null,
    status: scheduled ? "scheduled" : "sent",
    scheduledAt: input.schedule ? new Date(input.schedule) : null,
    sentCount: scheduled ? 0 : recipients.length,
    openCount: 0,
    clickCount: 0,
  });

  if (!scheduled) {
    for (const u of recipients) {
      await db.insert(userNotifications).values({
        userId: u.id,
        title: input.title,
        body: input.body,
        kind: "content",
        image: input.image || null,
        target: input.target || null,
      });
    }
  }

  await logAudit(a.name, scheduled ? "Scheduled notification" : `Sent notification to ${recipients.length} users`, "campaign", input.title);
  refresh();
}

export async function deleteCampaign(id: number) {
  const a = await requireAdmin();
  const row = (await db.select().from(campaigns).where(eq(campaigns.id, id)))[0];
  await db.delete(campaigns).where(eq(campaigns.id, id));
  await logAudit(a.name, "Deleted campaign", "campaign", row?.title);
  refresh();
}

/* ----------------------------- content ----------------------------- */

export async function saveFaq(input: { id?: number; question: string; answer: string; topic: string; displayOrder: number }) {
  const a = await requireAdmin();
  const values = { question: input.question, answer: input.answer, topic: input.topic, displayOrder: input.displayOrder };
  if (input.id) {
    await db.update(faqs).set(values).where(eq(faqs.id, input.id));
    await logAudit(a.name, "Updated FAQ", "faq", input.question.slice(0, 60));
  } else {
    await db.insert(faqs).values(values);
    await logAudit(a.name, "Created FAQ", "faq", input.question.slice(0, 60));
  }
  refresh();
}

export async function deleteFaq(id: number) {
  const a = await requireAdmin();
  const row = (await db.select().from(faqs).where(eq(faqs.id, id)))[0];
  await db.delete(faqs).where(eq(faqs.id, id));
  await logAudit(a.name, "Deleted FAQ", "faq", row?.question.slice(0, 60));
  refresh();
}

export async function saveLegal(slug: string, title: string, body: string) {
  const a = await requireAdmin();
  const paragraphs = body.split("\n").map((p) => p.trim()).filter(Boolean);
  await db.update(legalPages).set({ title, body: paragraphs, updatedAt: new Date() }).where(eq(legalPages.slug, slug));
  await logAudit(a.name, "Updated legal page", "legal", slug, null, `${paragraphs.length} paragraphs`);
  refresh();
}

export async function saveSettings(entries: { key: string; value: string }[]) {
  const a = await requireAdmin();
  for (const e of entries) {
    await db
      .insert(appSettings)
      .values({ key: e.key, value: e.value })
      .onConflictDoUpdate({ target: appSettings.key, set: { value: e.value } });
  }
  await logAudit(a.name, "Updated app settings", "settings", entries.map((e) => e.key).join(", "), null, JSON.stringify(entries));
  refresh();
}

export async function resolveReport(id: number, action: "resolved" | "dismissed" | "unpublish") {
  const a = await requireAdmin();
  const row = (await db.select().from(designReports).where(eq(designReports.id, id)))[0];
  if (!row) return;
  if (action === "unpublish") {
    await db.update(designs).set({ status: "inactive" }).where(eq(designs.code, row.designCode));
    await db.update(designReports).set({ status: "resolved" }).where(eq(designReports.id, id));
    await logAudit(a.name, "Unpublished reported design", "design", row.designCode, "published", "inactive");
  } else {
    await db.update(designReports).set({ status: action }).where(eq(designReports.id, id));
    await logAudit(a.name, `Report ${action}`, "report", row.designCode);
  }
  refresh();
}

export async function closeTicket(id: number) {
  const a = await requireAdmin();
  const row = (await db.select().from(supportTickets).where(eq(supportTickets.id, id)))[0];
  await db.update(supportTickets).set({ status: "closed" }).where(eq(supportTickets.id, id));
  await logAudit(a.name, "Closed support ticket", "ticket", row?.subject);
  refresh();
}

/* ----------------------------- demo utils ----------------------------- */

export async function simulateTraffic() {
  const a = await requireAdmin();
  await db.update(designs).set({
    views: sql`${designs.views} + (random() * 240)::int`,
    downloads: sql`${designs.downloads} + (random() * 18)::int`,
  });
  await logAudit(a.name, "Simulated traffic (demo)", "system", "designs");
  refresh();
}

export async function clearReports() {
  const a = await requireAdmin();
  await db.update(designReports).set({ status: "dismissed" }).where(eq(designReports.status, "open"));
  await logAudit(a.name, "Dismissed all open reports", "report", "bulk");
  refresh();
}

export async function unarchiveDesign(code: string) {
  const a = await requireAdmin();
  await db.update(designs).set({ status: "published" }).where(and(eq(designs.code, code)));
  await logAudit(a.name, "Restored design", "design", code, "archived", "published");
  refresh();
}
