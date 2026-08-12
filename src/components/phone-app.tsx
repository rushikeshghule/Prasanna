"use client";

import { useEffect, useRef, useState } from "react";
import { AppProvider, useApp, type TabKey } from "./app-context";
import { Icon } from "./ui";
import { AuthFlow, Logo } from "./screens/auth";
import { HomeScreen } from "./screens/home";
import { CategoryScreen, CollectionScreen, ExploreScreen, GridScreen, SubcategoryScreen } from "./screens/browse";
import { SearchScreen } from "./screens/search";
import { Viewer } from "./screens/viewer";
import { DownloadsScreen, NotificationsScreen, RecentScreen, SavedScreen } from "./screens/saved";
import { CheckoutScreen, PaymentsScreen, PlansScreen, SubscriptionScreen } from "./screens/billing";
import {
  DeleteAccountScreen,
  DevicesScreen,
  EditProfileScreen,
  FoldersScreen,
  HelpScreen,
  LanguageScreen,
  LegalScreen,
  NotifPrefsScreen,
  ProfileScreen,
  SettingsScreen,
  SupportScreen,
} from "./screens/profile";
import type { Bootstrap } from "@/lib/types";

export function PhoneApp({ data }: { data: Bootstrap }) {
  return (
    <AppProvider data={data}>
      <Stage />
    </AppProvider>
  );
}

function Stage() {
  return (
    <div className="relative min-h-[100dvh] w-full overflow-hidden bg-[#07050b]">
      <div className="pointer-events-none absolute -left-40 top-0 h-[520px] w-[520px] rounded-full bg-[#3a2410] blur-[140px] opacity-60" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-[520px] w-[520px] rounded-full bg-[#3a1024] blur-[150px] opacity-50" />

      <div className="relative mx-auto flex min-h-[100dvh] w-full max-w-[1180px] items-center justify-center gap-14 px-0 py-0 lg:px-10 lg:py-12">
        <SidePanel />
        <PhoneFrame />
      </div>
    </div>
  );
}

function SidePanel() {
  const { setTab, push, setPhase, data, isSubscribed, resetSubscription } = useApp();
  const jump = (fn: () => void) => {
    setPhase("app");
    fn();
  };

  return (
    <aside className="hidden max-w-[380px] flex-1 lg:block">
      <div className="flex items-center gap-3">
        <Logo size={52} />
        <div>
          <h1 className="font-display text-[26px] font-semibold leading-none">
            Prasanna <span className="gold-text">Trends</span>
          </h1>
          <p className="mt-1.5 text-[12px] tracking-[0.24em] text-muted uppercase">
            End-user mobile app · UI prototype
          </p>
        </div>
      </div>

      <p className="mt-6 text-[13.5px] leading-relaxed text-muted">
        A complete, interactive design for the Phase-1 Android/iOS app — onboarding, multilingual browsing,
        premium protection, the ₹100 subscription flow, downloads, sharing and support. Content is served live
        from PostgreSQL.
      </p>

      <div className="mt-6 grid grid-cols-2 gap-2.5">
        {[
          ["🗂️", `${data.categories.length} categories`],
          ["🖼️", `${data.designs.length} designs`],
          ["🌐", `${data.languages.length} languages`],
          ["💳", `${data.plans.length} plans`],
        ].map(([e, label]) => (
          <div key={label} className="rounded-2xl border border-line bg-surface2/40 px-3.5 py-3">
            <p className="text-[16px]">{e}</p>
            <p className="mt-1 text-[12px] font-semibold text-cream">{label}</p>
          </div>
        ))}
      </div>

      <p className="mt-7 text-[10.5px] font-bold uppercase tracking-[0.2em] text-muted">Jump to a screen</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {[
          ["Splash & onboarding", () => setPhase("splash")],
          ["Login + OTP", () => setPhase("login")],
          ["Home", () => jump(() => setTab("home"))],
          ["Explore", () => jump(() => setTab("explore"))],
          ["Search", () => jump(() => setTab("search"))],
          ["Saved", () => jump(() => setTab("saved"))],
          ["Plans ₹100", () => jump(() => push({ name: "plans" }))],
          ["Subscription", () => jump(() => push({ name: "subscription" }))],
          ["Payments", () => jump(() => push({ name: "payments" }))],
          ["Notifications", () => jump(() => push({ name: "notifications" }))],
          ["Help & FAQ", () => jump(() => push({ name: "help" }))],
          ["Profile", () => jump(() => setTab("profile"))],
        ].map(([label, fn]) => (
          <button
            key={label as string}
            type="button"
            onClick={fn as () => void}
            className="tap rounded-full border border-line bg-surface2/50 px-3.5 py-2 text-[11.5px] font-semibold text-cream hover:border-gold/40 hover:text-goldsoft"
          >
            {label as string}
          </button>
        ))}
      </div>

      <a
        href="/admin"
        target="_blank"
        rel="noreferrer"
        className="tap mt-5 flex items-center gap-3 rounded-2xl border border-gold/30 bg-gold/8 p-3.5 hover:border-gold/60"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gold/15 text-gold">
          <Icon name="settings" className="h-4.5 w-4.5" />
        </span>
        <span className="flex-1">
          <span className="block text-[12.5px] font-bold text-goldsoft">Open the admin web panel →</span>
          <span className="block text-[10.5px] text-muted">
            admin@prasannatrends.in · admin123
          </span>
        </span>
      </a>

      <div className="mt-4 rounded-2xl border border-dashed border-line p-4">
        <p className="text-[11.5px] font-semibold text-cream">
          Subscription state: {isSubscribed ? "Premium (active)" : "Free user"}
        </p>
        <p className="mt-1 text-[10.5px] leading-relaxed text-muted">
          Buy the ₹100 plan inside the phone to watch every premium design unlock, then reset it here to see the
          locked experience again.
        </p>
        {isSubscribed ? (
          <button
            type="button"
            onClick={resetSubscription}
            className="tap mt-2.5 rounded-full border border-line px-3 py-1.5 text-[11px] text-muted hover:text-cream"
          >
            Reset to free account
          </button>
        ) : null}
      </div>
    </aside>
  );
}

function PhoneFrame() {
  const { phase } = useApp();
  return (
    <div className="relative mx-auto w-full lg:w-auto">
      <div className="relative h-[100dvh] w-full overflow-hidden bg-ink lg:h-[858px] lg:w-[396px] lg:rounded-[3.1rem] lg:border-[9px] lg:border-[#241d2c] lg:shadow-[0_50px_90px_-30px_rgba(0,0,0,0.9)]">
        <div className="absolute left-1/2 top-2 z-50 hidden h-7 w-[112px] -translate-x-1/2 rounded-full bg-black lg:block" />
        <div className="flex h-full flex-col">
          <StatusBar />
          {phase === "app" ? <AppShell /> : <AuthFlow />}
        </div>
        <Toast />
      </div>
      <p className="mt-4 hidden text-center text-[10.5px] text-muted lg:block">
        Interactive prototype · swipe, tap and buy — every action writes to PostgreSQL
      </p>
    </div>
  );
}

function StatusBar() {
  const [time, setTime] = useState("9:41");
  useEffect(() => {
    const set = () =>
      setTime(
        new Date().toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit", hour12: false }),
      );
    set();
    const id = window.setInterval(set, 30000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="relative z-40 flex shrink-0 items-center justify-between bg-ink px-6 pb-1 pt-3 text-[11px] font-semibold text-cream lg:pt-2.5">
      <span>{time}</span>
      <span className="flex items-center gap-1.5">
        <span className="flex items-end gap-[2px]">
          {[3, 5, 7, 9].map((h) => (
            <span key={h} className="w-[3px] rounded-sm bg-cream" style={{ height: h }} />
          ))}
        </span>
        <svg viewBox="0 0 16 12" className="h-3 w-4 fill-cream">
          <path d="M8 10.5 5.8 8.3a3.1 3.1 0 0 1 4.4 0zM8 6.2c-1.4 0-2.7.5-3.7 1.5L3 6.4A7.1 7.1 0 0 1 8 4.3c1.9 0 3.7.8 5 2.1l-1.3 1.3A5.2 5.2 0 0 0 8 6.2m0-3.9c-2.4 0-4.7.9-6.4 2.6L.3 3.6A11 11 0 0 1 8 .4c3 0 5.7 1.2 7.7 3.2l-1.3 1.3A9 9 0 0 0 8 2.3" />
        </svg>
        <span className="relative flex h-3 w-6 items-center rounded-[3px] border border-cream/70 px-[2px]">
          <span className="h-1.5 w-[70%] rounded-[1px] bg-cream" />
          <span className="absolute -right-[3px] h-1.5 w-[2px] rounded-r bg-cream/70" />
        </span>
      </span>
    </div>
  );
}

function AppShell() {
  const { route, tab, viewer } = useApp();
  const scroller = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scroller.current?.scrollTo({ top: 0 });
  }, [route]);

  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      <div ref={scroller} className="no-scrollbar min-h-0 flex-1 overflow-y-auto overscroll-contain">
        <Screen key={`${tab}-${route.name}-${"slug" in route ? route.slug : ""}${"title" in route ? route.title : ""}`} />
        <div className="h-20" />
      </div>
      <TabBar />
      {viewer ? <Viewer /> : null}
    </div>
  );
}

function Screen() {
  const { route } = useApp();
  switch (route.name) {
    case "home":
      return <HomeScreen />;
    case "explore":
      return <ExploreScreen />;
    case "search":
      return <SearchScreen />;
    case "saved":
      return <SavedScreen />;
    case "profile":
      return <ProfileScreen />;
    case "category":
      return <CategoryScreen slug={route.slug} />;
    case "subcategory":
      return <SubcategoryScreen slug={route.slug} />;
    case "collection":
      return <CollectionScreen slug={route.slug} />;
    case "grid":
      return <GridScreen title={route.title} codes={route.codes} />;
    case "plans":
      return <PlansScreen />;
    case "checkout":
      return <CheckoutScreen planCode={route.planCode} />;
    case "subscription":
      return <SubscriptionScreen />;
    case "payments":
      return <PaymentsScreen />;
    case "notifications":
      return <NotificationsScreen />;
    case "downloads":
      return <DownloadsScreen />;
    case "recent":
      return <RecentScreen />;
    case "folders":
      return <FoldersScreen />;
    case "settings":
      return <SettingsScreen />;
    case "edit-profile":
      return <EditProfileScreen />;
    case "language":
      return <LanguageScreen />;
    case "notif-prefs":
      return <NotifPrefsScreen />;
    case "devices":
      return <DevicesScreen />;
    case "help":
      return <HelpScreen />;
    case "support":
      return <SupportScreen />;
    case "legal":
      return <LegalScreen slug={route.slug} />;
    case "delete-account":
      return <DeleteAccountScreen />;
    default:
      return <HomeScreen />;
  }
}

const TABS: { key: TabKey; icon: string; labelKey: "home" | "explore" | "search" | "saved" | "profile" }[] = [
  { key: "home", icon: "home", labelKey: "home" },
  { key: "explore", icon: "compass", labelKey: "explore" },
  { key: "search", icon: "search", labelKey: "search" },
  { key: "saved", icon: "heart", labelKey: "saved" },
  { key: "profile", icon: "user", labelKey: "profile" },
];

function TabBar() {
  const { tab, setTab, t, favourites } = useApp();
  return (
    <div className="relative z-30 shrink-0 border-t border-line/80 bg-ink/95 px-2 pb-1.5 pt-1.5 backdrop-blur-xl">
      <div className="flex items-center justify-between">
        {TABS.map((item) => {
          const active = tab === item.key;
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => setTab(item.key)}
              className="tap relative flex flex-1 flex-col items-center gap-1 py-1.5"
            >
              <span className="relative">
                <Icon
                  name={item.icon}
                  className={`h-[21px] w-[21px] transition-colors ${active ? "text-gold" : "text-muted"}`}
                  filled={active && item.key === "saved"}
                  strokeWidth={active ? 2 : 1.6}
                />
                {item.key === "saved" && favourites.size > 0 ? (
                  <span className="absolute -right-2 -top-1.5 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-rose px-1 text-[8px] font-bold text-ink">
                    {favourites.size}
                  </span>
                ) : null}
              </span>
              <span className={`text-[9.5px] font-semibold ${active ? "text-gold" : "text-muted"}`}>
                {t(item.labelKey)}
              </span>
              {active ? <span className="absolute -top-[7px] h-[3px] w-7 rounded-full bg-gold" /> : null}
            </button>
          );
        })}
      </div>
      <div className="mx-auto mt-1 h-1 w-28 rounded-full bg-line" />
    </div>
  );
}

function Toast() {
  const { toast } = useApp();
  if (!toast) return null;
  const emoji =
    toast.icon === "heart"
      ? "❤️"
      : toast.icon === "heart-off"
        ? "🤍"
        : toast.icon === "check"
          ? "✅"
          : toast.icon === "share"
            ? "📤"
            : toast.icon === "flag"
              ? "🚩"
              : toast.icon === "folder"
                ? "📁"
                : toast.icon === "mail"
                  ? "📧"
                  : toast.icon === "broom"
                    ? "🧹"
                    : toast.icon === "shield"
                      ? "🛡️"
                      : "✨";
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-24 z-[60] flex justify-center px-6">
      <div className="anim-up glass flex items-center gap-2.5 rounded-full px-4 py-2.5 text-[12px] font-medium text-cream shadow-xl">
        <span>{emoji}</span>
        {toast.message}
      </div>
    </div>
  );
}
