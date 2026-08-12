import { desc, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import {
  adminLogins,
  adminUsers,
  appSettings,
  appUsers,
  auditLogs,
  banners,
  campaigns,
  categories,
  collections,
  designReports,
  designs,
  downloadLogs,
  faqs,
  homeSections,
  languages,
  legalPages,
  payments,
  plans,
  searchLogs,
  subcategories,
  supportTickets,
} from "@/db/schema";
import { DEMO_ADMIN, hashPassword, requestMeta } from "@/lib/admin-auth";
import { ensureSeeded } from "./store";

let adminSeed: Promise<void> | null = null;

async function seedAdmin() {
  await ensureSeeded();
  const rows = await db.select().from(adminUsers).limit(1);
  if (rows.length > 0) return;
  await db
    .insert(adminUsers)
    .values({
      email: DEMO_ADMIN.email,
      password: hashPassword(DEMO_ADMIN.password),
      name: DEMO_ADMIN.name,
      role: "admin",
      lastLoginAt: new Date(),
    })
    .onConflictDoNothing();

  await db.insert(auditLogs).values([
    {
      adminName: DEMO_ADMIN.name,
      action: "Published design",
      entity: "design",
      entityRef: "PT-SR-1001",
      after: "status: published",
      ip: "103.21.58.14",
      createdAt: new Date(Date.now() - 3 * 3600 * 1000),
    },
    {
      adminName: DEMO_ADMIN.name,
      action: "Created plan",
      entity: "plan",
      entityRef: "basic-monthly",
      after: "₹100 / 30 days",
      ip: "103.21.58.14",
      createdAt: new Date(Date.now() - 26 * 3600 * 1000),
    },
    {
      adminName: DEMO_ADMIN.name,
      action: "Admin login",
      entity: "session",
      entityRef: DEMO_ADMIN.email,
      ip: "103.21.58.14",
      createdAt: new Date(Date.now() - 27 * 3600 * 1000),
    },
  ]);

  await db.insert(adminLogins).values([
    { email: DEMO_ADMIN.email, ok: true, ip: "103.21.58.14", device: "macOS · Desktop", createdAt: new Date(Date.now() - 27 * 3600 * 1000) },
    { email: DEMO_ADMIN.email, ok: false, ip: "45.118.9.2", device: "Unknown", createdAt: new Date(Date.now() - 52 * 3600 * 1000) },
  ]);

  await db.insert(campaigns).values([
    {
      title: "Bridal Season Edit is live",
      body: "42 new lehenga and blouse references added.",
      audience: "all",
      language: "all",
      target: "collection:bridal-lehenga-couture",
      status: "sent",
      sentCount: 1840,
      openCount: 962,
      clickCount: 418,
      createdAt: new Date(Date.now() - 2 * 86400 * 1000),
    },
    {
      title: "Festive offer · 20% off",
      body: "Quarterly Saver at ₹249 till Sunday midnight.",
      audience: "free",
      language: "all",
      target: "screen:plans",
      status: "sent",
      sentCount: 1204,
      openCount: 511,
      clickCount: 197,
      createdAt: new Date(Date.now() - 5 * 86400 * 1000),
    },
    {
      title: "Temple gold drop — Monday 10am",
      body: "12 antique finish haram designs from the Jaipur studio.",
      audience: "premium",
      language: "all",
      target: "collection:temple-gold-haram",
      status: "scheduled",
      scheduledAt: new Date(Date.now() + 3 * 86400 * 1000),
      createdAt: new Date(),
    },
  ]);
}

export async function ensureAdminSeeded() {
  if (!adminSeed) {
    adminSeed = seedAdmin().catch((e) => {
      adminSeed = null;
      throw e;
    });
  }
  return adminSeed;
}

export async function logAudit(
  adminName: string,
  action: string,
  entity: string,
  entityRef?: string | null,
  before?: unknown,
  after?: unknown,
) {
  const { ip } = await requestMeta();
  await db.insert(auditLogs).values({
    adminName,
    action,
    entity,
    entityRef: entityRef ?? null,
    before: before === undefined ? null : typeof before === "string" ? before : JSON.stringify(before),
    after: after === undefined ? null : typeof after === "string" ? after : JSON.stringify(after),
    ip,
  });
}

const num = (v: unknown) => Number(v ?? 0);

export async function getDashboard(days = 30) {
  await ensureAdminSeeded();
  const since = new Date(Date.now() - days * 86400 * 1000);

  const [users, designRows, catRows, payRows, dlRows, reportRows, ticketRows, searchRows] =
    await Promise.all([
      db.select().from(appUsers),
      db.select().from(designs),
      db.select().from(categories),
      db.select().from(payments),
      db.select().from(downloadLogs),
      db.select().from(designReports),
      db.select().from(supportTickets),
      db.select().from(searchLogs),
    ]);

  const inRange = <T extends { createdAt: Date }>(rows: T[]) => rows.filter((r) => r.createdAt >= since);
  const paidRows = payRows.filter((p) => p.status === "success");
  const rangedPay = inRange(payRows);

  const activeSubs = users.filter((u) => u.subStatus === "active").length;
  const expiredSubs = users.filter((u) => ["expired", "cancelled"].includes(u.subStatus)).length;

  const catStats = catRows
    .map((c) => {
      const list = designRows.filter((d) => d.categorySlug === c.slug);
      return {
        slug: c.slug,
        name: c.name,
        emoji: c.emoji,
        designs: list.length,
        views: list.reduce((a, b) => a + b.views, 0),
        downloads: list.reduce((a, b) => a + b.downloads, 0),
      };
    })
    .sort((a, b) => b.views - a.views);

  const revenueByDay: { date: string; amount: number }[] = [];
  for (let i = days - 1; i >= 0; i -= 1) {
    const day = new Date(Date.now() - i * 86400 * 1000);
    const key = day.toISOString().slice(0, 10);
    revenueByDay.push({
      date: key,
      amount: paidRows
        .filter((p) => p.createdAt.toISOString().slice(0, 10) === key)
        .reduce((a, b) => a + num(b.total), 0),
    });
  }

  const searchTerms = Object.entries(
    searchRows.reduce<Record<string, { count: number; zero: number }>>((acc, s) => {
      const k = s.term.toLowerCase();
      acc[k] = acc[k] ?? { count: 0, zero: 0 };
      acc[k].count += 1;
      if (s.results === 0) acc[k].zero += 1;
      return acc;
    }, {}),
  )
    .map(([term, v]) => ({ term, ...v }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  return {
    days,
    totals: {
      users: users.length,
      newUsers: users.filter((u) => u.createdAt >= since).length,
      activeSubs,
      expiredSubs,
      freeUsers: users.length - activeSubs,
      designs: designRows.length,
      published: designRows.filter((d) => d.status === "published").length,
      drafts: designRows.filter((d) => d.status === "draft").length,
      categories: catRows.length,
      views: designRows.reduce((a, b) => a + b.views, 0),
      downloads: designRows.reduce((a, b) => a + b.downloads, 0),
      shares: designRows.reduce((a, b) => a + b.shares, 0),
      favourites: designRows.reduce((a, b) => a + b.favourites, 0),
      revenue: paidRows.reduce((a, b) => a + num(b.total), 0),
      rangeRevenue: rangedPay.filter((p) => p.status === "success").reduce((a, b) => a + num(b.total), 0),
      paymentsOk: payRows.filter((p) => p.status === "success").length,
      paymentsFail: payRows.filter((p) => p.status !== "success").length,
      downloadEvents: dlRows.length,
      openReports: reportRows.filter((r) => r.status === "open").length,
      openTickets: ticketRows.filter((t) => t.status === "open").length,
      storageMb: Math.round(designRows.length * 3.4 * 10) / 10,
    },
    catStats,
    revenueByDay,
    searchTerms,
    popularDesigns: [...designRows].sort((a, b) => b.views - a.views).slice(0, 6),
    recentDesigns: [...designRows].sort((a, b) => +b.publishedAt - +a.publishedAt).slice(0, 6),
    recentPayments: [...payRows].sort((a, b) => +b.createdAt - +a.createdAt).slice(0, 6),
    recentUsers: [...users].sort((a, b) => +b.createdAt - +a.createdAt).slice(0, 6),
  };
}

export async function getCatalog() {
  await ensureAdminSeeded();
  const [catRows, subRows, colRows, designRows] = await Promise.all([
    db.select().from(categories).orderBy(categories.displayOrder),
    db.select().from(subcategories).orderBy(subcategories.displayOrder),
    db.select().from(collections).orderBy(collections.displayOrder),
    db.select().from(designs),
  ]);
  const count = (k: "categorySlug" | "subcategorySlug" | "collectionSlug", v: string) =>
    designRows.filter((d) => d[k] === v).length;
  return {
    categories: catRows.map((c) => ({ ...c, designCount: count("categorySlug", c.slug) })),
    subcategories: subRows.map((s) => ({ ...s, designCount: count("subcategorySlug", s.slug) })),
    collections: colRows.map((c) => ({ ...c, designCount: count("collectionSlug", c.slug) })),
  };
}

export async function getDesigns() {
  await ensureAdminSeeded();
  const [rows, catRows, subRows, colRows, planRows] = await Promise.all([
    db.select().from(designs).orderBy(desc(designs.publishedAt)),
    db.select().from(categories),
    db.select().from(subcategories),
    db.select().from(collections),
    db.select().from(plans),
  ]);
  return {
    designs: rows.map((d) => ({ ...d, publishedAt: d.publishedAt.toISOString(), tags: d.tags ?? [] })),
    categories: catRows,
    subcategories: subRows,
    collections: colRows,
    plans: planRows.map((p) => ({ code: p.code, name: p.name })),
  };
}

export async function getUsers() {
  await ensureAdminSeeded();
  const [rows, payRows, dlRows, planRows] = await Promise.all([
    db.select().from(appUsers).orderBy(desc(appUsers.createdAt)),
    db.select().from(payments),
    db.select().from(downloadLogs),
    db.select().from(plans),
  ]);
  return {
    users: rows.map((u) => ({
      id: u.id,
      name: u.name,
      phone: u.phone,
      email: u.email,
      avatar: u.avatar,
      status: u.status,
      language: u.language,
      planCode: u.planCode,
      subStatus: u.subStatus,
      subExpiresAt: u.subExpiresAt?.toISOString() ?? null,
      downloadsUsed: u.downloadsUsed,
      deletionRequested: u.deletionRequested,
      createdAt: u.createdAt.toISOString(),
      spend: payRows.filter((p) => p.userId === u.id && p.status === "success").reduce((a, b) => a + num(b.total), 0),
      txns: payRows.filter((p) => p.userId === u.id).length,
      downloads: dlRows.filter((d) => d.userId === u.id).length,
    })),
    plans: planRows.map((p) => ({ code: p.code, name: p.name, durationDays: p.durationDays })),
  };
}

export async function getBilling() {
  await ensureAdminSeeded();
  const [planRows, payRows, userRows] = await Promise.all([
    db.select().from(plans).orderBy(plans.displayOrder),
    db.select().from(payments).orderBy(desc(payments.createdAt)),
    db.select().from(appUsers),
  ]);
  return {
    plans: planRows.map((p) => ({
      ...p,
      price: Number(p.price),
      mrp: p.mrp ? Number(p.mrp) : null,
      benefits: p.benefits ?? [],
      includedCategories: p.includedCategories ?? [],
      subscribers: userRows.filter((u) => u.planCode === p.code).length,
      revenue: payRows
        .filter((x) => x.planCode === p.code && x.status === "success")
        .reduce((a, b) => a + num(b.total), 0),
    })),
    payments: payRows.map((p) => ({
      id: p.id,
      userId: p.userId,
      userName: userRows.find((u) => u.id === p.userId)?.name ?? `User #${p.userId}`,
      planCode: p.planCode,
      invoiceNo: p.invoiceNo,
      amount: Number(p.amount),
      tax: Number(p.tax),
      total: Number(p.total),
      method: p.method,
      status: p.status,
      gatewayRef: p.gatewayRef,
      createdAt: p.createdAt.toISOString(),
    })),
  };
}

export async function getAppearance() {
  await ensureAdminSeeded();
  const [bannerRows, sectionRows, catRows, colRows] = await Promise.all([
    db.select().from(banners).orderBy(banners.displayOrder),
    db.select().from(homeSections).orderBy(homeSections.displayOrder),
    db.select().from(categories),
    db.select().from(collections),
  ]);
  return { banners: bannerRows, sections: sectionRows, categories: catRows, collections: colRows };
}

export async function getLocalization() {
  await ensureAdminSeeded();
  const [langRows, catRows, colRows, designRows] = await Promise.all([
    db.select().from(languages).orderBy(languages.id),
    db.select().from(categories),
    db.select().from(collections),
    db.select().from(designs),
  ]);
  const missing = {
    hi:
      catRows.filter((c) => !c.nameHi).length +
      colRows.filter((c) => !c.nameHi).length +
      designRows.filter((d) => !d.titleHi).length,
    mr:
      catRows.filter((c) => !c.nameMr).length +
      colRows.filter((c) => !c.nameMr).length +
      designRows.filter((d) => !d.titleMr).length,
  };
  const totalStrings = catRows.length + colRows.length + designRows.length;
  return { languages: langRows, missing, totalStrings, categories: catRows, collections: colRows };
}

export async function getCampaigns() {
  await ensureAdminSeeded();
  const [rows, userRows] = await Promise.all([
    db.select().from(campaigns).orderBy(desc(campaigns.createdAt)),
    db.select().from(appUsers),
  ]);
  return {
    campaigns: rows.map((c) => ({ ...c, createdAt: c.createdAt.toISOString(), scheduledAt: c.scheduledAt?.toISOString() ?? null })),
    audienceSizes: {
      all: userRows.length,
      premium: userRows.filter((u) => u.subStatus === "active").length,
      free: userRows.filter((u) => u.subStatus !== "active").length,
      expired: userRows.filter((u) => ["expired", "cancelled"].includes(u.subStatus)).length,
    },
  };
}

export async function getContent() {
  await ensureAdminSeeded();
  const [faqRows, legalRows, settingRows, reportRows, ticketRows, designRows] = await Promise.all([
    db.select().from(faqs).orderBy(faqs.displayOrder),
    db.select().from(legalPages).orderBy(legalPages.id),
    db.select().from(appSettings).orderBy(appSettings.key),
    db.select().from(designReports).orderBy(desc(designReports.createdAt)),
    db.select().from(supportTickets).orderBy(desc(supportTickets.createdAt)),
    db.select().from(designs),
  ]);
  return {
    faqs: faqRows,
    legal: legalRows.map((l) => ({ ...l, body: l.body ?? [], updatedAt: l.updatedAt.toISOString() })),
    settings: settingRows,
    reports: reportRows.map((r) => ({
      ...r,
      createdAt: r.createdAt.toISOString(),
      designTitle: designRows.find((d) => d.code === r.designCode)?.title ?? r.designCode,
    })),
    tickets: ticketRows.map((t) => ({ ...t, createdAt: t.createdAt.toISOString() })),
  };
}

export async function getLogs() {
  await ensureAdminSeeded();
  const [logRows, loginRows] = await Promise.all([
    db.select().from(auditLogs).orderBy(desc(auditLogs.createdAt)).limit(120),
    db.select().from(adminLogins).orderBy(desc(adminLogins.createdAt)).limit(30),
  ]);
  return {
    logs: logRows.map((l) => ({ ...l, createdAt: l.createdAt.toISOString() })),
    logins: loginRows.map((l) => ({ ...l, createdAt: l.createdAt.toISOString() })),
  };
}

export async function getReports(days = 30) {
  await ensureAdminSeeded();
  const dash = await getDashboard(days);
  const [subRows, colRows, designRows] = await Promise.all([
    db.select().from(subcategories),
    db.select().from(collections),
    db.select().from(designs),
  ]);
  return {
    ...dash,
    collectionStats: colRows
      .map((c) => {
        const list = designRows.filter((d) => d.collectionSlug === c.slug);
        return {
          name: c.name,
          designs: list.length,
          views: list.reduce((a, b) => a + b.views, 0),
          downloads: list.reduce((a, b) => a + b.downloads, 0),
          favourites: list.reduce((a, b) => a + b.favourites, 0),
        };
      })
      .sort((a, b) => b.views - a.views),
    subStats: subRows
      .map((s) => {
        const list = designRows.filter((d) => d.subcategorySlug === s.slug);
        return { name: s.name, designs: list.length, views: list.reduce((a, b) => a + b.views, 0) };
      })
      .sort((a, b) => b.views - a.views),
  };
}

export async function countDesignsForCategory(slug: string) {
  const r = await db
    .select({ n: sql<number>`count(*)::int` })
    .from(designs)
    .where(eq(designs.categorySlug, slug));
  return r[0]?.n ?? 0;
}
