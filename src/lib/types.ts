export type Lang = "en" | "hi" | "mr";

export type LanguageItem = {
  code: string;
  name: string;
  nativeName: string;
  isDefault: boolean;
  isActive: boolean;
  completion: number;
};

export type Category = {
  slug: string;
  name: string;
  nameHi: string | null;
  nameMr: string | null;
  emoji: string;
  tagline: string | null;
  cover: string;
  accent: string;
  isFeatured: boolean;
  comingSoon: boolean;
  designCount: number;
};

export type Subcategory = {
  slug: string;
  categorySlug: string;
  name: string;
  nameHi: string | null;
  nameMr: string | null;
  cover: string;
  designCount: number;
};

export type Collection = {
  slug: string;
  categorySlug: string;
  subcategorySlug: string;
  name: string;
  nameHi: string | null;
  nameMr: string | null;
  cover: string;
  blurb: string | null;
  isFeatured: boolean;
  designCount: number;
};

export type Design = {
  code: string;
  title: string;
  titleHi: string | null;
  titleMr: string | null;
  description: string;
  categorySlug: string;
  subcategorySlug: string;
  collectionSlug: string;
  image: string;
  thumb: string;
  isPremium: boolean;
  requiredPlan: string | null;
  allowDownload: boolean;
  allowShare: boolean;
  watermark: boolean;
  colour: string;
  style: string;
  material: string;
  occasion: string;
  gender: string;
  tags: string[];
  views: number;
  downloads: number;
  shares: number;
  favourites: number;
  isFeatured: boolean;
  isTrending: boolean;
  publishedAt: string;
};

export type Plan = {
  code: string;
  name: string;
  nameHi: string | null;
  nameMr: string | null;
  description: string;
  price: number;
  mrp: number | null;
  currency: string;
  taxPercent: number;
  durationDays: number;
  durationLabel: string;
  benefits: string[];
  includedCategories: string[];
  downloadLimit: number;
  quality: string;
  trialDays: number;
  isPopular: boolean;
};

export type Banner = {
  id: number;
  title: string;
  titleHi: string | null;
  subtitle: string;
  image: string;
  cta: string;
  target: string;
  tone: string;
};

export type HomeSection = {
  key: string;
  title: string;
  titleHi: string | null;
  titleMr: string | null;
  subtitle: string | null;
  layout: string;
  isVisible: boolean;
};

export type Faq = { id: number; question: string; answer: string; topic: string };

export type LegalPage = { slug: string; title: string; body: string[]; updatedAt: string };

export type NotificationItem = {
  id: number;
  title: string;
  body: string;
  kind: string;
  image: string | null;
  target: string | null;
  isRead: boolean;
  createdAt: string;
};

export type PaymentItem = {
  id: number;
  planCode: string;
  invoiceNo: string;
  amount: number;
  tax: number;
  total: number;
  method: string;
  status: string;
  gatewayRef: string;
  createdAt: string;
};

export type DownloadItem = {
  designCode: string;
  quality: string;
  watermarked: boolean;
  createdAt: string;
};

export type UserProfile = {
  id: number;
  name: string;
  phone: string;
  email: string | null;
  avatar: string | null;
  language: Lang;
  pushEnabled: boolean;
  promoEnabled: boolean;
  emailEnabled: boolean;
  planCode: string | null;
  subStatus: string;
  subStartedAt: string | null;
  subExpiresAt: string | null;
  downloadsUsed: number;
  deletionRequested: boolean;
  createdAt: string;
};

export type Bootstrap = {
  user: UserProfile;
  settings: Record<string, string>;
  languages: LanguageItem[];
  categories: Category[];
  subcategories: Subcategory[];
  collections: Collection[];
  designs: Design[];
  plans: Plan[];
  banners: Banner[];
  sections: HomeSection[];
  faqs: Faq[];
  legal: LegalPage[];
  notifications: NotificationItem[];
  payments: PaymentItem[];
  downloads: DownloadItem[];
  favourites: { designCode: string; folder: string }[];
  recents: string[];
  popularSearches: string[];
  reportReasons: string[];
};
