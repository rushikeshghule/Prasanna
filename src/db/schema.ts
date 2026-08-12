import {
  boolean,
  integer,
  jsonb,
  numeric,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

/* ------------------------------------------------------------------ */
/* Content / catalog                                                    */
/* ------------------------------------------------------------------ */

export const languages = pgTable("languages", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(),
  name: text("name").notNull(),
  nativeName: text("native_name").notNull(),
  isDefault: boolean("is_default").notNull().default(false),
  isActive: boolean("is_active").notNull().default(true),
  completion: integer("completion").notNull().default(100),
});

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  nameHi: text("name_hi"),
  nameMr: text("name_mr"),
  emoji: text("emoji").notNull().default("✨"),
  tagline: text("tagline"),
  cover: text("cover").notNull(),
  accent: text("accent").notNull().default("#E9C46A"),
  displayOrder: integer("display_order").notNull().default(0),
  isFeatured: boolean("is_featured").notNull().default(false),
  isActive: boolean("is_active").notNull().default(true),
  comingSoon: boolean("coming_soon").notNull().default(false),
});

export const subcategories = pgTable("subcategories", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  categorySlug: text("category_slug").notNull(),
  name: text("name").notNull(),
  nameHi: text("name_hi"),
  nameMr: text("name_mr"),
  cover: text("cover").notNull(),
  displayOrder: integer("display_order").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
});

export const collections = pgTable("collections", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  categorySlug: text("category_slug").notNull(),
  subcategorySlug: text("subcategory_slug").notNull(),
  name: text("name").notNull(),
  nameHi: text("name_hi"),
  nameMr: text("name_mr"),
  cover: text("cover").notNull(),
  blurb: text("blurb"),
  isFeatured: boolean("is_featured").notNull().default(false),
  displayOrder: integer("display_order").notNull().default(0),
});

export const designs = pgTable("designs", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(),
  title: text("title").notNull(),
  titleHi: text("title_hi"),
  titleMr: text("title_mr"),
  description: text("description").notNull(),
  descriptionHi: text("description_hi"),
  categorySlug: text("category_slug").notNull(),
  subcategorySlug: text("subcategory_slug").notNull(),
  collectionSlug: text("collection_slug").notNull(),
  image: text("image").notNull(),
  thumb: text("thumb").notNull(),
  isPremium: boolean("is_premium").notNull().default(false),
  requiredPlan: text("required_plan"),
  allowDownload: boolean("allow_download").notNull().default(true),
  allowShare: boolean("allow_share").notNull().default(true),
  watermark: boolean("watermark").notNull().default(true),
  colour: text("colour").notNull(),
  style: text("style").notNull(),
  material: text("material").notNull(),
  occasion: text("occasion").notNull(),
  gender: text("gender").notNull(),
  tags: jsonb("tags").$type<string[]>().notNull().default([]),
  views: integer("views").notNull().default(0),
  downloads: integer("downloads").notNull().default(0),
  shares: integer("shares").notNull().default(0),
  favourites: integer("favourites").notNull().default(0),
  status: text("status").notNull().default("published"),
  isFeatured: boolean("is_featured").notNull().default(false),
  isTrending: boolean("is_trending").notNull().default(false),
  publishedAt: timestamp("published_at").notNull().defaultNow(),
});

export const plans = pgTable("plans", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(),
  name: text("name").notNull(),
  nameHi: text("name_hi"),
  nameMr: text("name_mr"),
  description: text("description").notNull(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  mrp: numeric("mrp", { precision: 10, scale: 2 }),
  currency: text("currency").notNull().default("INR"),
  taxPercent: integer("tax_percent").notNull().default(18),
  durationDays: integer("duration_days").notNull(),
  durationLabel: text("duration_label").notNull(),
  benefits: jsonb("benefits").$type<string[]>().notNull().default([]),
  includedCategories: jsonb("included_categories").$type<string[]>().notNull().default([]),
  downloadLimit: integer("download_limit").notNull().default(0),
  quality: text("quality").notNull().default("HD"),
  allowShare: boolean("allow_share").notNull().default(true),
  trialDays: integer("trial_days").notNull().default(0),
  isPopular: boolean("is_popular").notNull().default(false),
  isActive: boolean("is_active").notNull().default(true),
  displayOrder: integer("display_order").notNull().default(0),
});

export const banners = pgTable("banners", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  titleHi: text("title_hi"),
  subtitle: text("subtitle").notNull(),
  image: text("image").notNull(),
  cta: text("cta").notNull(),
  target: text("target").notNull(),
  tone: text("tone").notNull().default("gold"),
  displayOrder: integer("display_order").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
});

export const homeSections = pgTable("home_sections", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(),
  title: text("title").notNull(),
  titleHi: text("title_hi"),
  titleMr: text("title_mr"),
  subtitle: text("subtitle"),
  layout: text("layout").notNull().default("carousel"),
  displayOrder: integer("display_order").notNull().default(0),
  isVisible: boolean("is_visible").notNull().default(true),
});

export const faqs = pgTable("faqs", {
  id: serial("id").primaryKey(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  topic: text("topic").notNull().default("General"),
  displayOrder: integer("display_order").notNull().default(0),
});

export const legalPages = pgTable("legal_pages", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  body: jsonb("body").$type<string[]>().notNull().default([]),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const appSettings = pgTable("app_settings", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(),
  value: text("value").notNull(),
});

/* ------------------------------------------------------------------ */
/* End-user data                                                        */
/* ------------------------------------------------------------------ */

export const appUsers = pgTable("app_users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  phone: text("phone").notNull().unique(),
  email: text("email"),
  avatar: text("avatar"),
  status: text("status").notNull().default("active"),
  language: text("language").notNull().default("en"),
  pushEnabled: boolean("push_enabled").notNull().default(true),
  promoEnabled: boolean("promo_enabled").notNull().default(true),
  emailEnabled: boolean("email_enabled").notNull().default(false),
  planCode: text("plan_code"),
  subStatus: text("sub_status").notNull().default("none"),
  subStartedAt: timestamp("sub_started_at"),
  subExpiresAt: timestamp("sub_expires_at"),
  downloadsUsed: integer("downloads_used").notNull().default(0),
  deletionRequested: boolean("deletion_requested").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const favorites = pgTable("favorites", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  designCode: text("design_code").notNull(),
  folder: text("folder").notNull().default("All favourites"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const recentViews = pgTable("recent_views", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  designCode: text("design_code").notNull(),
  viewedAt: timestamp("viewed_at").notNull().defaultNow(),
});

export const downloadLogs = pgTable("download_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  designCode: text("design_code").notNull(),
  quality: text("quality").notNull().default("HD"),
  watermarked: boolean("watermarked").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  planCode: text("plan_code").notNull(),
  invoiceNo: text("invoice_no").notNull(),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  tax: numeric("tax", { precision: 10, scale: 2 }).notNull().default("0"),
  total: numeric("total", { precision: 10, scale: 2 }).notNull(),
  method: text("method").notNull(),
  status: text("status").notNull(),
  gatewayRef: text("gateway_ref").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const userNotifications = pgTable("user_notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  title: text("title").notNull(),
  body: text("body").notNull(),
  kind: text("kind").notNull().default("content"),
  image: text("image"),
  target: text("target"),
  isRead: boolean("is_read").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const designReports = pgTable("design_reports", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  designCode: text("design_code").notNull(),
  reason: text("reason").notNull(),
  note: text("note"),
  status: text("status").notNull().default("open"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const searchLogs = pgTable("search_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  term: text("term").notNull(),
  results: integer("results").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const supportTickets = pgTable("support_tickets", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  status: text("status").notNull().default("open"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

/* ------------------------------------------------------------------ */
/* Admin panel                                                          */
/* ------------------------------------------------------------------ */

export const adminUsers = pgTable("admin_users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  role: text("role").notNull().default("admin"),
  twoFactor: boolean("two_factor").notNull().default(false),
  lastLoginAt: timestamp("last_login_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const adminLogins = pgTable("admin_logins", {
  id: serial("id").primaryKey(),
  email: text("email").notNull(),
  ok: boolean("ok").notNull(),
  ip: text("ip"),
  device: text("device"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const auditLogs = pgTable("audit_logs", {
  id: serial("id").primaryKey(),
  adminName: text("admin_name").notNull(),
  action: text("action").notNull(),
  entity: text("entity").notNull(),
  entityRef: text("entity_ref"),
  before: text("before"),
  after: text("after"),
  ip: text("ip"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const campaigns = pgTable("campaigns", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  body: text("body").notNull(),
  audience: text("audience").notNull().default("all"),
  language: text("language").notNull().default("all"),
  image: text("image"),
  target: text("target"),
  status: text("status").notNull().default("sent"),
  scheduledAt: timestamp("scheduled_at"),
  sentCount: integer("sent_count").notNull().default(0),
  openCount: integer("open_count").notNull().default(0),
  clickCount: integer("click_count").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
