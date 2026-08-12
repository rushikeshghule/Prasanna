"use client";

import { useState } from "react";
import { useApp } from "../app-context";
import { Chip, DesignGrid, EmptyState, Icon, Img, Sheet, TopBar } from "../ui";
import { locTitle } from "@/lib/i18n";

export function SavedScreen() {
  const { t, favourites, folderOf, folders, recents, downloads, addFolder, setTab } = useApp();
  const [seg, setSeg] = useState<"fav" | "recent" | "downloads">("fav");
  const [folder, setFolder] = useState("All favourites");
  const [newFolder, setNewFolder] = useState(false);
  const [name, setName] = useState("");

  const favCodes = Array.from(favourites).filter((c) => folder === "All favourites" || folderOf[c] === folder);

  return (
    <div className="anim-screen pb-6">
      <TopBar
        title={t("saved")}
        subtitle={`${favourites.size} favourites · ${downloads.length} downloads`}
        right={
          <button
            type="button"
            onClick={() => setNewFolder(true)}
            className="tap flex h-9 w-9 items-center justify-center rounded-full border border-line bg-surface2"
          >
            <Icon name="plus" className="h-4 w-4" />
          </button>
        }
      />

      <div className="grid grid-cols-3 gap-1 rounded-2xl border border-line bg-surface2/50 p-1 mx-4 mt-3">
        {(
          [
            ["fav", t("favourites")],
            ["recent", t("recentlyViewed")],
            ["downloads", t("downloads")],
          ] as const
        ).map(([k, label]) => (
          <button
            key={k}
            type="button"
            onClick={() => setSeg(k)}
            className={`tap rounded-xl py-2 text-[11.5px] font-semibold ${
              seg === k ? "bg-cream text-ink" : "text-muted"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {seg === "fav" ? (
        <>
          <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto px-4">
            {folders.map((f) => (
              <Chip key={f} active={folder === f} tone="gold" onClick={() => setFolder(f)}>
                {f === "All favourites" ? `${f} · ${favourites.size}` : f}
              </Chip>
            ))}
            <button
              type="button"
              onClick={() => setNewFolder(true)}
              className="tap flex shrink-0 items-center gap-1 rounded-full border border-dashed border-line px-3 py-1.5 text-[12px] text-muted"
            >
              <Icon name="plus" className="h-3 w-3" /> New folder
            </button>
          </div>
          <div className="pt-4">
            {favCodes.length === 0 ? (
              <EmptyState
                icon="heart"
                title={t("emptyFav")}
                subtitle={t("emptyFavSub")}
                actionLabel="Browse designs"
                onAction={() => setTab("explore")}
              />
            ) : (
              <DesignGrid codes={favCodes} />
            )}
          </div>
          <p className="mt-2 px-4 text-center text-[10px] text-muted/70">
            Favourites sync across every device you log in from.
          </p>
        </>
      ) : null}

      {seg === "recent" ? <RecentList /> : null}
      {seg === "downloads" ? <DownloadList /> : null}

      <Sheet open={newFolder} onClose={() => setNewFolder(false)} title="New folder" subtitle="Organise your shortlists">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Sister's wedding"
          className="w-full rounded-2xl border border-line bg-surface2/60 px-4 py-3 text-[13px] outline-none placeholder:text-muted/60"
        />
        <button
          type="button"
          onClick={() => {
            if (!name.trim()) return;
            addFolder(name.trim());
            setFolder(name.trim());
            setName("");
            setNewFolder(false);
          }}
          className="tap mt-3 w-full rounded-2xl bg-gold py-3.5 text-[13.5px] font-bold text-ink"
        >
          Create folder
        </button>
      </Sheet>
    </div>
  );
}

export function RecentList() {
  const { recents, clearRecents, t, setTab } = useApp();
  if (recents.length === 0)
    return (
      <EmptyState
        icon="clock"
        title="No history yet"
        subtitle="Designs you open appear here so you can jump back quickly."
        actionLabel="Start browsing"
        onAction={() => setTab("home")}
      />
    );
  return (
    <>
      <div className="flex items-center justify-between px-4 pb-2 pt-4">
        <p className="text-[11px] font-bold uppercase tracking-wider text-muted">
          {recents.length} {t("recentlyViewed").toLowerCase()}
        </p>
        <button type="button" onClick={clearRecents} className="tap text-[11px] font-semibold text-gold">
          Clear history
        </button>
      </div>
      <DesignGrid codes={recents} />
    </>
  );
}

export function DownloadList() {
  const { downloads, byCode, lang, openViewer, setTab } = useApp();
  if (downloads.length === 0)
    return (
      <EmptyState
        icon="download"
        title="No downloads yet"
        subtitle="Downloaded designs stay available offline inside the app."
        actionLabel="Find designs"
        onAction={() => setTab("explore")}
      />
    );
  return (
    <div className="space-y-2.5 px-4 pt-4">
      <div className="flex items-center gap-2 rounded-2xl border border-line bg-surface2/40 p-3">
        <Icon name="shield" className="h-4 w-4 shrink-0 text-gold" />
        <p className="text-[10.5px] leading-relaxed text-muted">
          These files are stored in your gallery and inside the app. They remain accessible even after your plan
          expires.
        </p>
      </div>
      {downloads.map((d, i) => {
        const design = byCode.get(d.designCode);
        if (!design) return null;
        return (
          <button
            key={`${d.designCode}-${i}`}
            type="button"
            onClick={() => openViewer(downloads.map((x) => x.designCode), i)}
            className="tap flex w-full items-center gap-3 rounded-2xl border border-line bg-surface2/40 p-2.5 text-left"
          >
            <Img src={design.thumb} alt="" className="h-14 w-14 rounded-xl" />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[12.5px] font-semibold">{locTitle(lang, design)}</span>
              <span className="block text-[10px] text-muted">
                {design.code} · {d.quality} {d.watermarked ? "· watermarked" : "· original"}
              </span>
              <span className="mt-0.5 block text-[9.5px] text-muted/70">
                {new Date(d.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
              </span>
            </span>
            <Icon name="download" className="h-4 w-4 text-gold" />
          </button>
        );
      })}
    </div>
  );
}

export function RecentScreen() {
  const { back, t } = useApp();
  return (
    <div className="anim-screen pb-6">
      <TopBar title={t("recentlyViewed")} onBack={back} />
      <RecentList />
    </div>
  );
}

export function DownloadsScreen() {
  const { back, t } = useApp();
  return (
    <div className="anim-screen pb-6">
      <TopBar title={t("downloads")} onBack={back} />
      <DownloadList />
    </div>
  );
}

export function NotificationsScreen() {
  const { notifications, back, markNotificationsRead, push, t } = useApp();
  const [filter, setFilter] = useState<"all" | "content" | "subscription" | "offer">("all");
  const list = notifications.filter((n) => (filter === "all" ? true : n.kind === filter));

  const go = (target: string | null) => {
    if (!target) return;
    const [kind, value] = target.split(":");
    if (kind === "collection") push({ name: "collection", slug: value });
    else if (kind === "category") push({ name: "category", slug: value });
    else if (value === "plans") push({ name: "plans" });
    else if (value === "payments") push({ name: "payments" });
    else if (value === "subscription") push({ name: "subscription" });
  };

  return (
    <div className="anim-screen pb-6">
      <TopBar
        title={t("notifications")}
        onBack={back}
        right={
          <button type="button" onClick={markNotificationsRead} className="tap text-[11px] font-semibold text-gold">
            Mark all read
          </button>
        }
      />
      <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 py-3">
        {(["all", "content", "subscription", "offer"] as const).map((f) => (
          <Chip key={f} active={filter === f} tone="gold" onClick={() => setFilter(f)}>
            {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
          </Chip>
        ))}
      </div>

      {list.length === 0 ? (
        <EmptyState icon="bell" title="Nothing here yet" subtitle="New drops and offers will show up here." />
      ) : (
        <div className="space-y-2.5 px-4">
          {list.map((n) => (
            <button
              key={n.id}
              type="button"
              onClick={() => go(n.target)}
              className={`tap flex w-full gap-3 rounded-2xl border p-3 text-left ${
                n.isRead ? "border-line bg-surface2/30" : "border-gold/25 bg-gold/5"
              }`}
            >
              {n.image ? (
                <Img src={n.image} alt="" className="h-12 w-12 shrink-0 rounded-xl" />
              ) : (
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-surface3 text-gold">
                  <Icon
                    name={n.kind === "subscription" ? "crown" : n.kind === "offer" ? "ticket" : n.kind === "payment" ? "card" : "sparkle"}
                    className="h-5 w-5"
                  />
                </span>
              )}
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-2">
                  <span className="truncate text-[12.5px] font-semibold">{n.title}</span>
                  {!n.isRead ? <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-rose" /> : null}
                </span>
                <span className="mt-0.5 block text-[10.5px] leading-relaxed text-muted">{n.body}</span>
                <span className="mt-1 block text-[9.5px] text-muted/70">
                  {new Date(n.createdAt).toLocaleString("en-IN", {
                    day: "numeric",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
