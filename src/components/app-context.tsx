"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { makeT } from "@/lib/i18n";
import type {
  Bootstrap,
  Design,
  DownloadItem,
  Lang,
  NotificationItem,
  PaymentItem,
  UserProfile,
} from "@/lib/types";

export type TabKey = "home" | "explore" | "search" | "saved" | "profile";

export type Route =
  | { name: "home" }
  | { name: "explore" }
  | { name: "search" }
  | { name: "saved" }
  | { name: "profile" }
  | { name: "category"; slug: string }
  | { name: "subcategory"; slug: string }
  | { name: "collection"; slug: string }
  | { name: "grid"; title: string; codes: string[] }
  | { name: "plans" }
  | { name: "checkout"; planCode: string }
  | { name: "subscription" }
  | { name: "payments" }
  | { name: "notifications" }
  | { name: "downloads" }
  | { name: "recent" }
  | { name: "folders" }
  | { name: "settings" }
  | { name: "edit-profile" }
  | { name: "language" }
  | { name: "notif-prefs" }
  | { name: "devices" }
  | { name: "help" }
  | { name: "support" }
  | { name: "legal"; slug: string }
  | { name: "delete-account" };

export type Phase = "splash" | "onboarding" | "language" | "login" | "otp" | "terms" | "app";

type ToastState = { id: number; message: string; icon?: string } | null;

type Ctx = {
  data: Bootstrap;
  lang: Lang;
  t: ReturnType<typeof makeT>;
  user: UserProfile;
  phase: Phase;
  setPhase: (p: Phase) => void;
  tab: TabKey;
  route: Route;
  stackDepth: number;
  setTab: (t: TabKey) => void;
  push: (r: Route) => void;
  back: () => void;
  designs: Design[];
  byCode: Map<string, Design>;
  favourites: Set<string>;
  folderOf: Record<string, string>;
  folders: string[];
  toggleFav: (code: string, folder?: string) => void;
  addFolder: (name: string) => void;
  recents: string[];
  clearRecents: () => void;
  downloads: DownloadItem[];
  payments: PaymentItem[];
  notifications: NotificationItem[];
  markNotificationsRead: () => void;
  unreadCount: number;
  viewer: { codes: string[]; index: number } | null;
  openViewer: (codes: string[], index: number) => void;
  closeViewer: () => void;
  setViewerIndex: (i: number) => void;
  hasAccess: (d: Design) => boolean;
  isSubscribed: boolean;
  activePlan: Bootstrap["plans"][number] | null;
  daysLeft: number;
  recordDownload: (code: string, quality: string, watermarked: boolean) => void;
  recordShare: (code: string, channel: string) => void;
  submitReport: (code: string, reason: string, note: string) => void;
  submitSupport: (subject: string, message: string) => void;
  purchase: (planCode: string, method: string, outcome?: "success" | "failed") => Promise<boolean>;
  cancelSubscription: () => void;
  resetSubscription: () => void;
  setLang: (l: Lang) => void;
  updateProfile: (name: string, email: string) => void;
  updatePrefs: (p: Partial<Pick<UserProfile, "pushEnabled" | "promoEnabled" | "emailEnabled">>) => void;
  requestDeletion: () => void;
  searchHistory: string[];
  addSearch: (term: string, results: number) => void;
  clearSearchHistory: () => void;
  toast: ToastState;
  showToast: (message: string, icon?: string) => void;
};

const AppCtx = createContext<Ctx | null>(null);

export function useApp() {
  const ctx = useContext(AppCtx);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}

const post = (url: string, body: unknown) => {
  void fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  }).catch(() => undefined);
};

export function AppProvider({ data, children }: { data: Bootstrap; children: ReactNode }) {
  const [user, setUser] = useState<UserProfile>(() => ({ ...data.user }) as UserProfile);
  const [phase, setPhase] = useState<Phase>("splash");
  const [tab, setTabState] = useState<TabKey>("home");
  const [stacks, setStacks] = useState<Record<TabKey, Route[]>>({
    home: [{ name: "home" }],
    explore: [{ name: "explore" }],
    search: [{ name: "search" }],
    saved: [{ name: "saved" }],
    profile: [{ name: "profile" }],
  });
  const [favState, setFavState] = useState<Record<string, string>>(() =>
    Object.fromEntries(data.favourites.map((f) => [f.designCode, f.folder])),
  );
  const [extraFolders, setExtraFolders] = useState<string[]>([]);
  const [recents, setRecents] = useState<string[]>(data.recents);
  const [downloads, setDownloads] = useState<DownloadItem[]>(data.downloads);
  const [payments, setPayments] = useState<PaymentItem[]>(data.payments);
  const [notifications, setNotifications] = useState<NotificationItem[]>(data.notifications);
  const [viewer, setViewer] = useState<{ codes: string[]; index: number } | null>(null);
  const [searchHistory, setSearchHistory] = useState<string[]>(["bridal blouse", "temple haram", "sherwani"]);
  const [toast, setToast] = useState<ToastState>(null);

  const lang = user.language;
  const t = useMemo(() => makeT(lang), [lang]);

  const byCode = useMemo(() => new Map(data.designs.map((d) => [d.code, d])), [data.designs]);

  const showToast = useCallback((message: string, icon?: string) => {
    const id = Date.now();
    setToast({ id, message, icon });
    window.setTimeout(() => {
      setToast((cur) => (cur && cur.id === id ? null : cur));
    }, 2400);
  }, []);

  const stack = stacks[tab];
  const route = stack[stack.length - 1];

  const setTab = useCallback((next: TabKey) => {
    setTabState((cur) => {
      if (cur === next) {
        setStacks((s) => ({ ...s, [next]: [s[next][0]] }));
      }
      return next;
    });
  }, []);

  const push = useCallback(
    (r: Route) => {
      setStacks((s) => ({ ...s, [tab]: [...s[tab], r] }));
    },
    [tab],
  );

  const back = useCallback(() => {
    if (viewer) {
      setViewer(null);
      return;
    }
    setStacks((s) => {
      const cur = s[tab];
      if (cur.length <= 1) return s;
      return { ...s, [tab]: cur.slice(0, -1) };
    });
  }, [tab, viewer]);

  const activePlan = useMemo(
    () => data.plans.find((p) => p.code === user.planCode) ?? null,
    [data.plans, user.planCode],
  );

  const isSubscribed = user.subStatus === "active" || user.subStatus === "grace";

  const daysLeft = useMemo(() => {
    if (!user.subExpiresAt) return 0;
    const diff = new Date(user.subExpiresAt).getTime() - Date.now();
    return Math.max(0, Math.ceil(diff / 86400000));
  }, [user.subExpiresAt]);

  const hasAccess = useCallback(
    (d: Design) => {
      if (!d.isPremium) return true;
      if (!isSubscribed || !activePlan) return false;
      return activePlan.includedCategories.includes(d.categorySlug);
    },
    [activePlan, isSubscribed],
  );

  const openViewer = useCallback(
    (codes: string[], index: number) => {
      setViewer({ codes, index });
      const code = codes[index];
      if (code) {
        setRecents((r) => [code, ...r.filter((c) => c !== code)].slice(0, 20));
        post("/api/events", { type: "view", designCode: code });
      }
    },
    [],
  );

  const setViewerIndex = useCallback((i: number) => {
    setViewer((v) => {
      if (!v) return v;
      const code = v.codes[i];
      if (code) {
        setRecents((r) => [code, ...r.filter((c) => c !== code)].slice(0, 20));
        post("/api/events", { type: "view", designCode: code });
      }
      return { ...v, index: i };
    });
  }, []);

  const toggleFav = useCallback(
    (code: string, folder = "All favourites") => {
      setFavState((cur) => {
        const next = { ...cur };
        if (next[code]) {
          delete next[code];
          showToast("Removed from favourites", "heart-off");
        } else {
          next[code] = folder;
          showToast(folder === "All favourites" ? "Saved to favourites" : `Saved to ${folder}`, "heart");
        }
        return next;
      });
      post("/api/favorites", { designCode: code, folder });
    },
    [showToast],
  );

  const folders = useMemo(() => {
    const set = new Set<string>(["All favourites", "Wedding shortlist", ...extraFolders]);
    Object.values(favState).forEach((f) => set.add(f));
    return Array.from(set);
  }, [favState, extraFolders]);

  const value: Ctx = {
    data,
    lang,
    t,
    user,
    phase,
    setPhase,
    tab,
    route,
    stackDepth: stack.length,
    setTab,
    push,
    back,
    designs: data.designs,
    byCode,
    favourites: useMemo(() => new Set(Object.keys(favState)), [favState]),
    folderOf: favState,
    folders,
    toggleFav,
    addFolder: (name) => {
      setExtraFolders((f) => (f.includes(name) ? f : [...f, name]));
      showToast(`Folder “${name}” created`, "folder");
    },
    recents,
    clearRecents: () => {
      setRecents([]);
      post("/api/events", { type: "clear-recent" });
      showToast("Recent history cleared", "broom");
    },
    downloads,
    payments,
    notifications,
    unreadCount: notifications.filter((n) => !n.isRead).length,
    markNotificationsRead: () => {
      setNotifications((n) => n.map((x) => ({ ...x, isRead: true })));
      post("/api/account", { action: "read-notifications" });
    },
    viewer,
    openViewer,
    closeViewer: () => setViewer(null),
    setViewerIndex,
    hasAccess,
    isSubscribed,
    activePlan,
    daysLeft,
    recordDownload: (code, quality, watermarked) => {
      setDownloads((d) => [
        { designCode: code, quality, watermarked, createdAt: new Date().toISOString() },
        ...d,
      ]);
      setUser((u) => ({ ...u, downloadsUsed: u.downloadsUsed + 1 }));
      post("/api/events", { type: "download", designCode: code, quality, watermarked });
    },
    recordShare: (code, channel) => {
      post("/api/events", { type: "share", designCode: code });
      showToast(`Shared via ${channel}`, "share");
    },
    submitReport: (code, reason, note) => {
      post("/api/events", { type: "report", designCode: code, reason, note });
      showToast("Report sent to our team", "flag");
    },
    submitSupport: (subject, message) => {
      post("/api/events", { type: "support", subject, message });
      showToast("Support request sent", "mail");
    },
    purchase: async (planCode, method, outcome = "success") => {
      try {
        const res = await fetch("/api/subscribe", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ action: "purchase", planCode, method, outcome }),
        });
        const json = (await res.json()) as {
          ok?: boolean;
          user?: UserProfile;
          payments?: PaymentItem[];
          notifications?: NotificationItem[];
        };
        if (json.user) setUser(json.user);
        if (json.payments) setPayments(json.payments);
        if (json.notifications) setNotifications(json.notifications);
        return outcome === "success";
      } catch {
        return false;
      }
    },
    cancelSubscription: () => {
      setUser((u) => ({ ...u, subStatus: "cancelled" }));
      post("/api/subscribe", { action: "cancel" });
      showToast("Auto-renewal cancelled", "info");
    },
    resetSubscription: () => {
      setUser((u) => ({
        ...u,
        subStatus: "none",
        planCode: null,
        subStartedAt: null,
        subExpiresAt: null,
        downloadsUsed: 0,
      }));
      post("/api/subscribe", { action: "reset" });
      showToast("Demo reset · subscription removed", "info");
    },
    setLang: (l) => {
      setUser((u) => ({ ...u, language: l }));
      post("/api/account", { action: "language", language: l });
    },
    updateProfile: (name, email) => {
      setUser((u) => ({ ...u, name, email }));
      post("/api/account", { action: "profile", name, email });
      showToast("Profile updated", "check");
    },
    updatePrefs: (p) => {
      setUser((u) => ({ ...u, ...p }));
      post("/api/account", { action: "prefs", ...p });
    },
    requestDeletion: () => {
      setUser((u) => ({ ...u, deletionRequested: true }));
      post("/api/account", { action: "delete" });
    },
    searchHistory,
    addSearch: (term, results) => {
      const clean = term.trim();
      if (!clean) return;
      setSearchHistory((h) => [clean, ...h.filter((x) => x !== clean)].slice(0, 8));
      post("/api/events", { type: "search", term: clean, results });
    },
    clearSearchHistory: () => setSearchHistory([]),
    toast,
    showToast,
  };

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}
