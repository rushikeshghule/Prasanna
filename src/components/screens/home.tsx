"use client";

import { useEffect, useMemo, useState } from "react";
import { useApp } from "../app-context";
import { DesignGrid, DesignRail, Icon, Img, SectionHeader } from "../ui";
import { loc } from "@/lib/i18n";
import type { Lang } from "@/lib/types";

const sectionTitle = (lang: Lang, s: { title: string; titleHi: string | null; titleMr: string | null }) =>
  lang === "hi" ? s.titleHi || s.title : lang === "mr" ? s.titleMr || s.titleHi || s.title : s.title;

export function HomeScreen() {
  const app = useApp();
  const { data, lang, t, user, push, setTab, isSubscribed, activePlan, daysLeft, unreadCount } = app;

  const trending = useMemo(
    () => data.designs.filter((d) => d.isTrending).slice(0, 10).map((d) => d.code),
    [data.designs],
  );
  const latest = useMemo(() => data.designs.slice(0, 10).map((d) => d.code), [data.designs]);
  const freeOnes = useMemo(
    () => data.designs.filter((d) => !d.isPremium).slice(0, 8).map((d) => d.code),
    [data.designs],
  );
  const premiumOnes = useMemo(
    () => data.designs.filter((d) => d.isPremium).slice(0, 10).map((d) => d.code),
    [data.designs],
  );
  const featuredCollections = data.collections.filter((c) => c.isFeatured);

  return (
    <div className="anim-screen pb-6">
      {/* header */}
      <div className="sticky top-0 z-30 bg-ink/90 px-4 pb-3 pt-4 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => setTab("profile")} className="tap relative">
            <Img
              src={user.avatar ?? ""}
              alt={user.name}
              className="h-10 w-10 rounded-full border border-gold/40"
            />
            {isSubscribed ? (
              <span className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full border border-ink bg-gold text-ink">
                <Icon name="crown" className="h-2.5 w-2.5" strokeWidth={2.4} />
              </span>
            ) : null}
          </button>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] text-muted">
              {t("greeting")}, {user.name.split(" ")[0]} 🙏
            </p>
            <p className="truncate font-display text-[15px] font-semibold">
              {isSubscribed ? `${activePlan?.name} · ${daysLeft} ${t("daysLeft")}` : "Discover today's designs"}
            </p>
          </div>
          <button
            type="button"
            onClick={() => push({ name: "language" })}
            className="tap flex h-9 items-center gap-1 rounded-full border border-line bg-surface2 px-2.5 text-[11px] font-bold uppercase text-muted"
          >
            <Icon name="globe" className="h-3.5 w-3.5" />
            {lang}
          </button>
          <button
            type="button"
            onClick={() => push({ name: "notifications" })}
            className="tap relative flex h-9 w-9 items-center justify-center rounded-full border border-line bg-surface2"
          >
            <Icon name="bell" className="h-4 w-4" />
            {unreadCount > 0 ? (
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-rose ring-2 ring-ink" />
            ) : null}
          </button>
        </div>

        <button
          type="button"
          onClick={() => setTab("search")}
          className="tap mt-3 flex w-full items-center gap-2.5 rounded-2xl border border-line bg-surface2/70 px-4 py-3 text-left"
        >
          <Icon name="search" className="h-4 w-4 text-muted" />
          <span className="flex-1 truncate text-[12.5px] text-muted">{t("searchPlaceholder")}</span>
          <Icon name="scan" className="h-4 w-4 text-gold" />
        </button>
      </div>

      {/* subscription strip */}
      <div className="px-4 pt-3">
        {isSubscribed && activePlan ? (
          <div className="gold-border anim-up rounded-2xl p-3.5">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gold/15 text-gold">
                <Icon name="crown" className="h-4.5 w-4.5" />
              </span>
              <div className="flex-1">
                <p className="text-[13px] font-bold">{activePlan.name} is active</p>
                <p className="text-[10.5px] text-muted">
                  {user.downloadsUsed}/{activePlan.downloadLimit} {t("downloadsUsed")} · {t("activeTill")}{" "}
                  {new Date(user.subExpiresAt ?? "").toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                </p>
              </div>
              <button
                type="button"
                onClick={() => push({ name: "subscription" })}
                className="tap rounded-full border border-gold/40 px-3 py-1.5 text-[11px] font-bold text-gold"
              >
                Manage
              </button>
            </div>
            <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-surface3">
              <div
                className="h-full rounded-full bg-gradient-to-r from-gold to-rose"
                style={{
                  width: `${Math.min(100, (user.downloadsUsed / Math.max(1, activePlan.downloadLimit)) * 100)}%`,
                }}
              />
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => push({ name: "plans" })}
            className="tap anim-up relative flex w-full items-center gap-3 overflow-hidden rounded-2xl bg-gradient-to-r from-[#3a2a12] via-[#241a2e] to-[#3a1526] p-3.5 text-left"
          >
            <span className="absolute inset-0 border border-gold/25 rounded-2xl" />
            <span className="anim-float flex h-10 w-10 items-center justify-center rounded-xl bg-gold/20 text-gold">
              <Icon name="crown" className="h-5 w-5" />
            </span>
            <span className="flex-1">
              <span className="block text-[13.5px] font-bold text-goldsoft">{t("unlockTitle")}</span>
              <span className="block text-[10.5px] text-muted">{t("unlockSub")}</span>
            </span>
            <Icon name="right" className="h-4 w-4 text-gold" />
          </button>
        )}
      </div>

      {data.sections
        .filter((s) => s.isVisible)
        .map((section) => {
          const title = sectionTitle(lang, section);
          switch (section.key) {
            case "banners":
              return <BannerCarousel key={section.key} />;
            case "categories":
              return (
                <div key={section.key} className="pt-6">
                  <SectionHeader
                    title={title}
                    subtitle={section.subtitle}
                    actionLabel={t("viewAll")}
                    onAction={() => setTab("explore")}
                  />
                  <div className="no-scrollbar flex gap-3.5 overflow-x-auto px-4 pb-1">
                    {data.categories.map((c) => (
                      <button
                        key={c.slug}
                        type="button"
                        onClick={() => (c.comingSoon ? undefined : push({ name: "category", slug: c.slug }))}
                        className="tap w-[74px] shrink-0 text-center"
                      >
                        <span className="relative block">
                          <span
                            className="absolute -inset-[3px] rounded-full opacity-70"
                            style={{ background: `conic-gradient(from 120deg, ${c.accent}, transparent 65%)` }}
                          />
                          <Img src={c.cover} alt={c.name} className="relative h-[68px] w-[68px] rounded-full" />
                          {c.comingSoon ? (
                            <span className="absolute inset-0 flex items-center justify-center rounded-full bg-ink/70 text-[9px] font-bold text-gold">
                              SOON
                            </span>
                          ) : (
                            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full border border-line bg-ink px-1.5 py-0.5 text-[8px] font-bold text-muted">
                              {c.designCount}
                            </span>
                          )}
                        </span>
                        <span className="mt-2.5 block truncate text-[10.5px] font-semibold">{loc(lang, c)}</span>
                      </button>
                    ))}
                  </div>
                </div>
              );
            case "featured-collections":
              return (
                <div key={section.key} className="pt-7">
                  <SectionHeader title={title} subtitle={section.subtitle} />
                  <div className="no-scrollbar flex gap-3 overflow-x-auto px-4">
                    {featuredCollections.map((c) => (
                      <button
                        key={c.slug}
                        type="button"
                        onClick={() => push({ name: "collection", slug: c.slug })}
                        className="tap relative h-[132px] w-[74%] shrink-0 overflow-hidden rounded-2xl border border-line text-left"
                      >
                        <Img src={c.cover} alt={c.name} className="absolute inset-0 h-full w-full" />
                        <span className="absolute inset-0 bg-gradient-to-r from-ink via-ink/60 to-transparent" />
                        <span className="absolute inset-y-0 left-0 flex w-[68%] flex-col justify-center p-4">
                          <span className="font-display text-[15px] font-semibold leading-tight">{loc(lang, c)}</span>
                          <span className="mt-1 line-clamp-2 text-[10.5px] text-muted">{c.blurb}</span>
                          <span className="mt-2 inline-flex w-fit items-center gap-1 rounded-full border border-gold/40 px-2 py-0.5 text-[9.5px] font-bold text-gold">
                            {c.designCount} {t("designs")}
                          </span>
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              );
            case "trending":
              return (
                <div key={section.key} className="pt-7">
                  <SectionHeader
                    title={title}
                    subtitle={section.subtitle}
                    actionLabel={t("viewAll")}
                    onAction={() => push({ name: "grid", title, codes: trending })}
                  />
                  <DesignRail codes={trending} />
                </div>
              );
            case "new":
              return (
                <div key={section.key} className="pt-7">
                  <SectionHeader
                    title={title}
                    subtitle={section.subtitle}
                    actionLabel={t("viewAll")}
                    onAction={() => push({ name: "grid", title, codes: data.designs.map((d) => d.code) })}
                  />
                  <DesignRail codes={latest} />
                </div>
              );
            case "free":
              return (
                <div key={section.key} className="pt-7">
                  <SectionHeader
                    title={title}
                    subtitle={section.subtitle}
                    actionLabel={t("viewAll")}
                    onAction={() =>
                      push({
                        name: "grid",
                        title,
                        codes: data.designs.filter((d) => !d.isPremium).map((d) => d.code),
                      })
                    }
                  />
                  <DesignGrid codes={freeOnes} />
                </div>
              );
            case "premium":
              return (
                <div key={section.key} className="pt-7">
                  <SectionHeader
                    title={title}
                    subtitle={section.subtitle}
                    actionLabel={t("viewAll")}
                    onAction={() =>
                      push({
                        name: "grid",
                        title,
                        codes: data.designs.filter((d) => d.isPremium).map((d) => d.code),
                      })
                    }
                  />
                  <DesignRail codes={premiumOnes} />
                </div>
              );
            case "recent":
              if (app.recents.length === 0) return null;
              return (
                <div key={section.key} className="pt-7">
                  <SectionHeader
                    title={title}
                    subtitle={section.subtitle}
                    actionLabel={t("viewAll")}
                    onAction={() => push({ name: "recent" })}
                  />
                  <DesignRail codes={app.recents.slice(0, 8)} ratio="square" />
                </div>
              );
            default:
              return null;
          }
        })}

      <div className="mt-8 px-4">
        <div className="rounded-2xl border border-dashed border-line p-4 text-center">
          <p className="font-display text-[13px] text-cream">You&apos;re all caught up ✨</p>
          <p className="mt-1 text-[10.5px] leading-relaxed text-muted">
            Sections, banners and their order on this screen are configured by the admin panel — no app update
            needed.
          </p>
        </div>
        <p className="mt-3 text-center text-[10px] text-muted/60">
          {data.settings.appName} v{data.settings.currentVersion}
        </p>
      </div>
    </div>
  );
}

function BannerCarousel() {
  const { data, push, lang } = useApp();
  const [i, setI] = useState(0);
  const banners = data.banners;

  useEffect(() => {
    const id = window.setInterval(() => setI((x) => (x + 1) % banners.length), 4200);
    return () => window.clearInterval(id);
  }, [banners.length]);

  const go = (target: string) => {
    const [kind, value] = target.split(":");
    if (kind === "collection") push({ name: "collection", slug: value });
    else if (kind === "category") push({ name: "category", slug: value });
    else push({ name: "plans" });
  };

  return (
    <div className="pt-5">
      <div className="overflow-hidden px-4">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${i * 100}%)` }}
        >
          {banners.map((b) => (
            <div key={b.id} className="w-full shrink-0 pr-0">
              <button
                type="button"
                onClick={() => go(b.target)}
                className="tap relative block h-[150px] w-full overflow-hidden rounded-3xl border border-line text-left"
              >
                <Img src={b.image} alt={b.title} className="absolute inset-0 h-full w-full" />
                <span
                  className={`absolute inset-0 ${
                    b.tone === "plum"
                      ? "bg-gradient-to-r from-[#1b0f24]/95 via-[#1b0f24]/70 to-transparent"
                      : b.tone === "rose"
                        ? "bg-gradient-to-r from-[#2a0f1a]/95 via-[#2a0f1a]/65 to-transparent"
                        : "bg-gradient-to-r from-[#241a09]/95 via-[#241a09]/65 to-transparent"
                  }`}
                />
                <span className="absolute inset-y-0 left-0 flex w-[72%] flex-col justify-center gap-1.5 p-5">
                  <span className="font-display text-[18px] font-semibold leading-tight text-cream">
                    {lang === "hi" ? b.titleHi || b.title : b.title}
                  </span>
                  <span className="text-[11px] leading-snug text-white/70">{b.subtitle}</span>
                  <span className="mt-1 inline-flex w-fit items-center gap-1 rounded-full bg-gold px-3 py-1 text-[10.5px] font-bold text-ink">
                    {b.cta}
                    <Icon name="right" className="h-3 w-3" strokeWidth={2.5} />
                  </span>
                </span>
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-2.5 flex justify-center gap-1.5">
        {banners.map((b, idx) => (
          <button
            key={b.id}
            type="button"
            onClick={() => setI(idx)}
            className={`h-1.5 rounded-full transition-all ${idx === i ? "w-5 bg-gold" : "w-1.5 bg-line"}`}
            aria-label={`Banner ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
