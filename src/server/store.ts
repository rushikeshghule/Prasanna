import { asc, desc, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import {
  appSettings,
  appUsers,
  banners,
  categories,
  collections,
  designs,
  downloadLogs,
  faqs,
  favorites,
  homeSections,
  languages,
  legalPages,
  payments,
  plans,
  recentViews,
  subcategories,
  userNotifications,
} from "@/db/schema";
import {
  BANNERS,
  CATEGORIES,
  COLLECTIONS,
  DEMO_USER,
  DESIGNS,
  FAQS,
  HOME_SECTIONS,
  LANGUAGES,
  LEGAL_PAGES,
  NOTIFICATIONS,
  PLANS,
  POPULAR_SEARCHES,
  REPORT_REASONS,
  SETTINGS,
  SUBCATEGORIES,
} from "@/content/catalog";
import type { Bootstrap, Lang, UserProfile } from "@/lib/types";

const iso = (d: Date | string | null) =>
  d === null ? null : typeof d === "string" ? d : d.toISOString();

let seedPromise: Promise<void> | null = null;

async function seed() {
  const existing = await db.select({ n: sql<number>`count(*)::int` }).from(categories);
  if ((existing[0]?.n ?? 0) > 0) return;

  await db.insert(languages).values(LANGUAGES).onConflictDoNothing();
  await db.insert(categories).values(CATEGORIES).onConflictDoNothing();
  await db.insert(subcategories).values(SUBCATEGORIES).onConflictDoNothing();
  await db.insert(collections).values(COLLECTIONS).onConflictDoNothing();
  await db.insert(designs).values(DESIGNS).onConflictDoNothing();
  await db.insert(plans).values(PLANS).onConflictDoNothing();
  await db.insert(banners).values(BANNERS).onConflictDoNothing();
  await db.insert(homeSections).values(HOME_SECTIONS).onConflictDoNothing();
  await db.insert(faqs).values(FAQS).onConflictDoNothing();
  await db.insert(legalPages).values(LEGAL_PAGES).onConflictDoNothing();
  await db
    .insert(appSettings)
    .values(Object.entries(SETTINGS).map(([key, value]) => ({ key, value })))
    .onConflictDoNothing();

  const [user] = await db.insert(appUsers).values(DEMO_USER).onConflictDoNothing().returning();
  const userId = user?.id ?? 1;

  await db.insert(userNotifications).values(
    NOTIFICATIONS.map((n) => ({
      userId,
      title: n.title,
      body: n.body,
      kind: n.kind,
      image: n.image,
      target: n.target,
      isRead: n.isRead,
      createdAt: new Date(Date.now() - n.minutesAgo * 60000),
    })),
  );

  const favSeeds = [DESIGNS[0], DESIGNS[9], DESIGNS[33], DESIGNS[43]].filter(Boolean);
  await db.insert(favorites).values(
    favSeeds.map((d, i) => ({
      userId,
      designCode: d.code,
      folder: i % 2 === 0 ? "Wedding shortlist" : "All favourites",
    })),
  );

  const recentSeeds = [DESIGNS[15], DESIGNS[41], DESIGNS[3], DESIGNS[50], DESIGNS[22]].filter(Boolean);
  await db.insert(recentViews).values(
    recentSeeds.map((d, i) => ({
      userId,
      designCode: d.code,
      viewedAt: new Date(Date.now() - (i + 1) * 3600 * 1000),
    })),
  );

  await db.insert(downloadLogs).values(
    [DESIGNS[2], DESIGNS[13], DESIGNS[36]].filter(Boolean).map((d, i) => ({
      userId,
      designCode: d.code,
      quality: i === 0 ? "Ultra HD" : "HD",
      watermarked: false,
      createdAt: new Date(Date.now() - (i + 2) * 86400 * 1000),
    })),
  );

  await db.insert(payments).values([
    {
      userId,
      planCode: "basic-monthly",
      invoiceNo: "PT-INV-2041",
      amount: "100.00",
      tax: "18.00",
      total: "118.00",
      method: "UPI · Google Pay",
      status: "success",
      gatewayRef: "pay_Nz8Q1kTrends41",
      createdAt: new Date(Date.now() - 34 * 86400 * 1000),
    },
    {
      userId,
      planCode: "basic-monthly",
      invoiceNo: "PT-INV-1988",
      amount: "100.00",
      tax: "18.00",
      total: "118.00",
      method: "Card · HDFC ****4412",
      status: "failed",
      gatewayRef: "pay_Nz71FailTrends",
      createdAt: new Date(Date.now() - 35 * 86400 * 1000),
    },
  ]);
}

export async function ensureSeeded() {
  if (!seedPromise) {
    seedPromise = seed().catch((err) => {
      seedPromise = null;
      throw err;
    });
  }
  return seedPromise;
}

export async function getUser(): Promise<UserProfile> {
  await ensureSeeded();
  const rows = await db.select().from(appUsers).orderBy(asc(appUsers.id)).limit(1);
  const u = rows[0];
  return {
    id: u.id,
    name: u.name,
    phone: u.phone,
    email: u.email,
    avatar: u.avatar,
    language: (u.language as Lang) ?? "en",
    pushEnabled: u.pushEnabled,
    promoEnabled: u.promoEnabled,
    emailEnabled: u.emailEnabled,
    planCode: u.planCode,
    subStatus: u.subStatus,
    subStartedAt: iso(u.subStartedAt),
    subExpiresAt: iso(u.subExpiresAt),
    downloadsUsed: u.downloadsUsed,
    deletionRequested: u.deletionRequested,
    createdAt: iso(u.createdAt)!,
  };
}

export async function getBootstrap(): Promise<Bootstrap> {
  await ensureSeeded();
  const user = await getUser();

  const [
    settingRows,
    langRows,
    catRows,
    subRows,
    colRows,
    designRows,
    planRows,
    bannerRows,
    sectionRows,
    faqRows,
    legalRows,
    notifRows,
    payRows,
    favRows,
    recentRows,
    downloadRows,
  ] = await Promise.all([
    db.select().from(appSettings),
    db.select().from(languages).orderBy(asc(languages.id)),
    db.select().from(categories).orderBy(asc(categories.displayOrder)),
    db.select().from(subcategories).orderBy(asc(subcategories.displayOrder)),
    db.select().from(collections).orderBy(asc(collections.displayOrder)),
    db.select().from(designs).orderBy(desc(designs.publishedAt)),
    db.select().from(plans).orderBy(asc(plans.displayOrder)),
    db.select().from(banners).orderBy(asc(banners.displayOrder)),
    db.select().from(homeSections).orderBy(asc(homeSections.displayOrder)),
    db.select().from(faqs).orderBy(asc(faqs.displayOrder)),
    db.select().from(legalPages).orderBy(asc(legalPages.id)),
    db.select().from(userNotifications).orderBy(desc(userNotifications.createdAt)),
    db.select().from(payments).where(eq(payments.userId, user.id)).orderBy(desc(payments.createdAt)),
    db.select().from(favorites).where(eq(favorites.userId, user.id)).orderBy(desc(favorites.createdAt)),
    db.select().from(recentViews).where(eq(recentViews.userId, user.id)).orderBy(desc(recentViews.viewedAt)).limit(20),
    db.select().from(downloadLogs).where(eq(downloadLogs.userId, user.id)).orderBy(desc(downloadLogs.createdAt)),
  ]);

  const countBy = (key: "categorySlug" | "subcategorySlug" | "collectionSlug", value: string) =>
    designRows.filter((d) => d[key] === value && d.status === "published").length;

  return {
    user,
    settings: Object.fromEntries(settingRows.map((s) => [s.key, s.value])),
    languages: langRows.map((l) => ({
      code: l.code,
      name: l.name,
      nativeName: l.nativeName,
      isDefault: l.isDefault,
      isActive: l.isActive,
      completion: l.completion,
    })),
    categories: catRows.map((c) => ({
      slug: c.slug,
      name: c.name,
      nameHi: c.nameHi,
      nameMr: c.nameMr,
      emoji: c.emoji,
      tagline: c.tagline,
      cover: c.cover,
      accent: c.accent,
      isFeatured: c.isFeatured,
      comingSoon: c.comingSoon,
      designCount: countBy("categorySlug", c.slug),
    })),
    subcategories: subRows.map((s) => ({
      slug: s.slug,
      categorySlug: s.categorySlug,
      name: s.name,
      nameHi: s.nameHi,
      nameMr: s.nameMr,
      cover: s.cover,
      designCount: countBy("subcategorySlug", s.slug),
    })),
    collections: colRows.map((c) => ({
      slug: c.slug,
      categorySlug: c.categorySlug,
      subcategorySlug: c.subcategorySlug,
      name: c.name,
      nameHi: c.nameHi,
      nameMr: c.nameMr,
      cover: c.cover,
      blurb: c.blurb,
      isFeatured: c.isFeatured,
      designCount: countBy("collectionSlug", c.slug),
    })),
    designs: designRows
      .filter((d) => d.status === "published")
      .map((d) => ({
        code: d.code,
        title: d.title,
        titleHi: d.titleHi,
        titleMr: d.titleMr,
        description: d.description,
        categorySlug: d.categorySlug,
        subcategorySlug: d.subcategorySlug,
        collectionSlug: d.collectionSlug,
        image: d.image,
        thumb: d.thumb,
        isPremium: d.isPremium,
        requiredPlan: d.requiredPlan,
        allowDownload: d.allowDownload,
        allowShare: d.allowShare,
        watermark: d.watermark,
        colour: d.colour,
        style: d.style,
        material: d.material,
        occasion: d.occasion,
        gender: d.gender,
        tags: d.tags ?? [],
        views: d.views,
        downloads: d.downloads,
        shares: d.shares,
        favourites: d.favourites,
        isFeatured: d.isFeatured,
        isTrending: d.isTrending,
        publishedAt: iso(d.publishedAt)!,
      })),
    plans: planRows.map((p) => ({
      code: p.code,
      name: p.name,
      nameHi: p.nameHi,
      nameMr: p.nameMr,
      description: p.description,
      price: Number(p.price),
      mrp: p.mrp ? Number(p.mrp) : null,
      currency: p.currency,
      taxPercent: p.taxPercent,
      durationDays: p.durationDays,
      durationLabel: p.durationLabel,
      benefits: p.benefits ?? [],
      includedCategories: p.includedCategories ?? [],
      downloadLimit: p.downloadLimit,
      quality: p.quality,
      trialDays: p.trialDays,
      isPopular: p.isPopular,
    })),
    banners: bannerRows.map((b) => ({
      id: b.id,
      title: b.title,
      titleHi: b.titleHi,
      subtitle: b.subtitle,
      image: b.image,
      cta: b.cta,
      target: b.target,
      tone: b.tone,
    })),
    sections: sectionRows.map((s) => ({
      key: s.key,
      title: s.title,
      titleHi: s.titleHi,
      titleMr: s.titleMr,
      subtitle: s.subtitle,
      layout: s.layout,
      isVisible: s.isVisible,
    })),
    faqs: faqRows.map((f) => ({ id: f.id, question: f.question, answer: f.answer, topic: f.topic })),
    legal: legalRows.map((l) => ({
      slug: l.slug,
      title: l.title,
      body: l.body ?? [],
      updatedAt: iso(l.updatedAt)!,
    })),
    notifications: notifRows.map((n) => ({
      id: n.id,
      title: n.title,
      body: n.body,
      kind: n.kind,
      image: n.image,
      target: n.target,
      isRead: n.isRead,
      createdAt: iso(n.createdAt)!,
    })),
    payments: payRows.map((p) => ({
      id: p.id,
      planCode: p.planCode,
      invoiceNo: p.invoiceNo,
      amount: Number(p.amount),
      tax: Number(p.tax),
      total: Number(p.total),
      method: p.method,
      status: p.status,
      gatewayRef: p.gatewayRef,
      createdAt: iso(p.createdAt)!,
    })),
    downloads: downloadRows.map((d) => ({
      designCode: d.designCode,
      quality: d.quality,
      watermarked: d.watermarked,
      createdAt: iso(d.createdAt)!,
    })),
    favourites: favRows.map((f) => ({ designCode: f.designCode, folder: f.folder })),
    recents: recentRows.map((r) => r.designCode),
    popularSearches: POPULAR_SEARCHES,
    reportReasons: REPORT_REASONS,
  };
}
