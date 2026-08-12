# Prasanna Trends — End-User Mobile App (UI Prototype)

An interactive, image-first prototype of the Phase-1 **Prasanna Trends** mobile app
(clothing + jewellery design discovery, favourites, downloads, sharing, and the ₹100
subscription flow), built with **Next.js 16 (App Router) + Drizzle ORM + PostgreSQL + Tailwind v4**.

On a desktop browser it renders inside a phone frame with a shortcut panel to jump to any
screen. On a real phone it fills the whole screen like a native app.

---

## 1. Requirements

| Tool       | Version              |
| ---------- | -------------------- |
| Node.js    | 20 or newer (22 recommended) |
| npm        | 10+                  |
| PostgreSQL | 14 or newer, running locally |

---

## 2. Setup

### a. Install dependencies

```bash
npm install
```

### b. Create the database

```bash
createdb app_db
```

If you don't have `createdb` on your PATH:

```bash
psql -U postgres -c "CREATE DATABASE app_db;"
```

### c. Configure the connection

A `.env` file already exists in the project root:

```
DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:5432/app_db
```

Change the user/password/host if your local Postgres differs.

> **Note:** `drizzle.config.json` also holds the same URL for the CLI. If you change
> `.env`, update `dbCredentials.url` in `drizzle.config.json` to match.

### d. Create the tables

```bash
npx drizzle-kit push
```

This creates all 20 tables (categories, subcategories, collections, designs, plans,
banners, home_sections, faqs, legal_pages, app_users, favorites, payments, etc.).

> You do **not** need to seed manually. The app auto-seeds on first request with
> 3 categories, 10 subcategories, 15 collections, 60 designs, 3 subscription plans,
> banners, FAQs, legal pages, notifications and a demo user.

---

## 3. Run

### Development (hot reload)

```bash
npm run dev
```

Open <http://localhost:3000>

### Production

```bash
npm run build
npm run start
```

Open <http://localhost:3000>

---

## 4. Verify it works

```bash
curl http://localhost:3000/api/health      # -> {"ok":true}
curl http://localhost:3000/api/bootstrap   # -> full app content payload
```

---

## 4a. The admin web panel

Open **`/admin`** on a desktop browser.

```
Email:    admin@prasannatrends.in
Password: admin123
```

Twelve screens, all writing to the same PostgreSQL database as the mobile app:

| Screen | What it covers (SRS §13) |
| --- | --- |
| Dashboard | Users, subscriptions, revenue chart, engagement, storage, 7/30/90-day range |
| Categories | Categories → subcategories → collections, translations, order, archive |
| Designs | Filterable table, bulk actions, full metadata editor, duplicate detection |
| Users | Search, suspend/block, grant or revoke plans, deletion requests, CSV export |
| Plans & payments | Plan builder, pricing/GST/limits, transactions, refunds, CSV export |
| Home & banners | Banner editor with live preview, home-section reordering & visibility |
| Languages | Add languages, set default, inline translation editor, missing-string counts |
| Notifications | Audience targeting, deep links, scheduling, delivery & open stats |
| Content & support | FAQs, legal pages, app settings, reported designs, support tickets |
| Reports | Collection/subcategory engagement, revenue, payment success, empty searches |
| Audit logs | Every admin action with before → after values, IP and timestamp |

Anything you change here appears in the mobile app on the next load — no app release
required. Sessions expire after 8 hours and every login attempt is logged.

---

## 4b. Sharing the link (WhatsApp / Telegram / iMessage)

The app ships with a rich link-preview card (title, description and a 1200×630 image),
plus a web-app manifest and icons so recipients can **Add to Home Screen** and open it
like a native app.

Preview URLs are resolved from the incoming request, so the card works on **any** host —
sandbox preview, Vercel, or your own domain — with zero configuration.

If you deploy behind a proxy that rewrites the host, pin it explicitly instead:

```
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

**Test how the card will look before sending:**

- WhatsApp: just paste the link into a chat with yourself (Message Yourself) and wait ~2s.
- Or use <https://www.opengraph.xyz> and paste the URL.

> WhatsApp caches previews aggressively. If you change the title/image, append a dummy
> query string (`?v=2`) to force it to re-fetch.

---

## 5. Other commands

```bash
npm run typecheck    # TypeScript, no emit
npm run lint         # ESLint
npx drizzle-kit push # re-apply schema changes after editing src/db/schema.ts
```

---

## 6. How to explore the prototype

The **left panel on desktop** has jump buttons for every screen. Suggested tour:

1. **Splash & onboarding** → 3 slides → language picker (English / हिन्दी / मराठी) → Login → OTP auto-fills after ~1.5s.
2. **Home** → banner carousel, category rings, Trending / Featured / Free / Premium sections.
3. Tap any **premium** design → it opens blurred with a tiled watermark and an unlock card.
4. **Plans ₹100** → pick a plan → **Checkout** → try coupon `FESTIVE10` → Pay.
   - Tick *"simulate a failed / pending gateway response"* to see the failure + retry path.
5. After paying, reopen the same premium design — it is now unwatermarked, downloadable and shareable.
6. Try **Download** (quality picker + progress), **Share** (link / watermarked / original), **Report** (6 reasons).
7. **Saved** tab → favourites, folders, recently viewed, downloads.
8. **Profile** → subscription manager, payment history, language, notification prefs, devices, FAQ, support, legal pages, delete account.
9. Reset back to a free account from the side panel or *Profile → My subscription → Demo control*.

Every action (favourite, view, download, share, report, search, purchase) is written to
PostgreSQL, so state survives a refresh.

---

## 7. Reset the demo data

```bash
psql postgresql://postgres:postgres@127.0.0.1:5432/app_db -c "
DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
npx drizzle-kit push
```

Restart the app — it re-seeds automatically.

---

## 8. Project structure

```
src/
├── app/
│   ├── page.tsx                 # server component: loads bootstrap, renders the phone
│   ├── layout.tsx               # fonts, metadata, viewport
│   ├── globals.css              # theme tokens + animations
│   └── api/
│       ├── health/              # DB healthcheck
│       ├── bootstrap/           # full app content payload
│       ├── favorites/           # toggle favourite
│       ├── events/              # view / download / share / report / search / support
│       ├── account/             # profile, language, prefs, deletion
│       └── subscribe/           # purchase, cancel, reset
├── components/
│   ├── phone-app.tsx            # phone shell, tab bar, router, toasts
│   ├── app-context.tsx          # client state: routing, favourites, subscription
│   ├── ui.tsx                   # icons, sheets, tiles, grids, watermark
│   └── screens/
│       ├── auth.tsx             # splash, onboarding, language, login, OTP
│       ├── home.tsx             # home + banner carousel
│       ├── browse.tsx           # explore, category, subcategory, collection, filters
│       ├── search.tsx           # suggestions, recent, popular, no-results
│       ├── viewer.tsx           # full-screen viewer, download/share/report sheets
│       ├── billing.tsx          # plans, checkout, subscription, payments
│       ├── saved.tsx            # favourites, folders, recents, downloads, notifications
│       └── profile.tsx          # profile, settings, help, support, legal, deletion
├── content/catalog.ts           # seed catalogue (categories → designs, plans, FAQs, legal)
├── db/                          # Drizzle client + schema (20 tables)
├── lib/                         # types + i18n dictionary (en/hi/mr with fallback)
└── server/store.ts              # seeding + bootstrap query layer
```

---

## 9. Troubleshooting

| Problem | Fix |
| --- | --- |
| `DATABASE_URL is required` | `.env` is missing or empty — recreate it as shown in step 2c. |
| `ECONNREFUSED 127.0.0.1:5432` | Postgres isn't running. Start it (`brew services start postgresql` / `sudo service postgresql start`). |
| `database "app_db" does not exist` | Run `createdb app_db`. |
| Page loads but is empty / 500 | Tables missing — run `npx drizzle-kit push`. |
| Images don't load | The prototype uses remote Pexels URLs; check your internet connection. |
| Port 3000 in use | `npm run dev -- -p 3001` |
