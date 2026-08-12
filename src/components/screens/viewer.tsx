"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useApp } from "../app-context";
import { FreeTag, Icon, Img, PremiumTag, Sheet, Watermark } from "../ui";
import { loc, locTitle } from "@/lib/i18n";

const SHARE_TARGETS = [
  { key: "WhatsApp", emoji: "💬", tint: "bg-[#25D366]/15 text-[#25D366]" },
  { key: "Instagram", emoji: "📸", tint: "bg-[#E1306C]/15 text-[#E1306C]" },
  { key: "Facebook", emoji: "📘", tint: "bg-[#1877F2]/15 text-[#1877F2]" },
  { key: "Telegram", emoji: "✈️", tint: "bg-[#2AABEE]/15 text-[#2AABEE]" },
  { key: "Email", emoji: "✉️", tint: "bg-white/10 text-cream" },
  { key: "More apps", emoji: "➕", tint: "bg-white/10 text-cream" },
];

export function Viewer() {
  const app = useApp();
  const { viewer, byCode, closeViewer, setViewerIndex, hasAccess, favourites, toggleFav, lang, t, push, data } = app;
  const [zoom, setZoom] = useState(false);
  const [sheet, setSheet] = useState<"share" | "download" | "report" | "details" | null>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [reason, setReason] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [shareMode, setShareMode] = useState<"link" | "preview" | "original">("link");
  const [quality, setQuality] = useState("HD");
  const startX = useRef<number | null>(null);

  const design = viewer ? byCode.get(viewer.codes[viewer.index]) : undefined;

  useEffect(() => {
    setZoom(false);
  }, [viewer?.index]);

  useEffect(() => {
    if (progress === null) return;
    if (progress >= 100) {
      const id = window.setTimeout(() => setProgress(null), 700);
      return () => window.clearTimeout(id);
    }
    const id = window.setTimeout(() => setProgress((p) => Math.min(100, (p ?? 0) + 12)), 90);
    return () => window.clearTimeout(id);
  }, [progress]);

  const related = useMemo(() => {
    if (!design) return [];
    return data.designs
      .filter((d) => d.code !== design.code && d.subcategorySlug === design.subcategorySlug)
      .slice(0, 8);
  }, [data.designs, design]);

  if (!viewer || !design) return null;

  const locked = design.isPremium && !hasAccess(design);
  const fav = favourites.has(design.code);
  const idx = viewer.index;
  const canPrev = idx > 0;
  const canNext = idx < viewer.codes.length - 1;
  const category = data.categories.find((c) => c.slug === design.categorySlug);
  const collection = data.collections.find((c) => c.slug === design.collectionSlug);

  const onTouchStart = (x: number) => {
    startX.current = x;
  };
  const onTouchEnd = (x: number) => {
    if (startX.current === null) return;
    const delta = x - startX.current;
    startX.current = null;
    if (Math.abs(delta) < 55 || zoom) return;
    if (delta < 0 && canNext) setViewerIndex(idx + 1);
    if (delta > 0 && canPrev) setViewerIndex(idx - 1);
  };

  const startDownload = () => {
    if (locked) {
      push({ name: "plans" });
      closeViewer();
      return;
    }
    setSheet(null);
    setProgress(4);
    app.recordDownload(design.code, quality, !app.isSubscribed);
    window.setTimeout(() => app.showToast(`Saved to gallery · ${quality}`, "check"), 1200);
  };

  return (
    <div className="absolute inset-0 z-40 flex flex-col bg-black">
      {/* top bar */}
      <div className="absolute inset-x-0 top-0 z-20 flex items-center gap-3 bg-gradient-to-b from-black/85 to-transparent px-4 pb-8 pt-4">
        <button
          type="button"
          onClick={closeViewer}
          className="tap flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-cream backdrop-blur"
        >
          <Icon name="close" className="h-4 w-4" />
        </button>
        <div className="flex-1 text-center">
          <p className="text-[11px] font-semibold tracking-wide text-white/90">{design.code}</p>
          <p className="text-[10px] text-white/50">
            {idx + 1} / {viewer.codes.length}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setZoom((z) => !z)}
          className="tap flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-cream backdrop-blur"
        >
          <Icon name="zoom" className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => setSheet("details")}
          className="tap flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-cream backdrop-blur"
        >
          <Icon name="dots" className="h-4 w-4" strokeWidth={2.6} />
        </button>
      </div>

      {/* image stage */}
      <div
        className="relative flex-1 overflow-hidden"
        onTouchStart={(e) => onTouchStart(e.touches[0].clientX)}
        onTouchEnd={(e) => onTouchEnd(e.changedTouches[0].clientX)}
        onPointerDown={(e) => onTouchStart(e.clientX)}
        onPointerUp={(e) => onTouchEnd(e.clientX)}
      >
        <div
          className={`h-full w-full transition-transform duration-500 ${zoom ? "scale-[1.75]" : "scale-100"}`}
          onDoubleClick={() => setZoom((z) => !z)}
        >
          <Img
            key={design.code}
            src={design.image}
            alt={design.title}
            className="h-full w-full"
            fit={locked ? "cover" : "contain"}
            imgClassName={locked ? "blur-[7px] scale-105" : ""}
          />
        </div>

        {locked ? (
          <>
            <div className="absolute inset-0 bg-ink/35" />
            <Watermark />
            <div className="absolute inset-x-6 top-1/2 -translate-y-1/2">
              <div className="glass anim-pop rounded-3xl p-5 text-center">
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gold/20 text-gold">
                  <Icon name="lock" className="h-5 w-5" />
                </span>
                <p className="mt-3 font-display text-[17px] font-semibold">{t("premiumLocked")}</p>
                <p className="mt-1 text-[11.5px] leading-relaxed text-white/70">{t("premiumLockedSub")}</p>
                <button
                  type="button"
                  onClick={() => {
                    closeViewer();
                    push({ name: "plans" });
                  }}
                  className="tap mt-4 w-full rounded-2xl bg-gradient-to-r from-gold to-[#d8a94b] py-3 text-[13px] font-bold text-ink"
                >
                  Unlock for ₹100 / month
                </button>
                <p className="mt-2 text-[10px] text-white/45">
                  Server-side verification · short-lived image links · watermark removed after payment
                </p>
              </div>
            </div>
          </>
        ) : null}

        {canPrev ? (
          <button
            type="button"
            onClick={() => setViewerIndex(idx - 1)}
            className="tap absolute left-2 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-white/80 backdrop-blur sm:flex"
          >
            <Icon name="left" className="h-4 w-4" />
          </button>
        ) : null}
        {canNext ? (
          <button
            type="button"
            onClick={() => setViewerIndex(idx + 1)}
            className="tap absolute right-2 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-white/80 backdrop-blur sm:flex"
          >
            <Icon name="right" className="h-4 w-4" />
          </button>
        ) : null}

        {progress !== null ? (
          <div className="absolute inset-x-6 bottom-6 rounded-2xl bg-black/75 p-3 backdrop-blur">
            <div className="mb-2 flex items-center justify-between text-[11px] text-white/80">
              <span>Downloading {quality} file…</span>
              <span>{progress}%</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-white/15">
              <div className="h-full rounded-full bg-gold transition-all" style={{ width: `${progress}%` }} />
            </div>
          </div>
        ) : null}
      </div>

      {/* info panel */}
      <div className="relative z-10 max-h-[46%] overflow-y-auto rounded-t-[26px] border-t border-line bg-ink px-4 pb-5 pt-4 no-scrollbar">
        <div className="flex items-start gap-3">
          <div className="min-w-0 flex-1">
            <div className="mb-1.5 flex items-center gap-2">
              {design.isPremium ? <PremiumTag /> : <FreeTag />}
              {design.isTrending ? (
                <span className="rounded-full border border-rose/40 bg-rose/10 px-2 py-0.5 text-[9px] font-bold text-rose">
                  TRENDING
                </span>
              ) : null}
            </div>
            <h2 className="font-display text-[18px] font-semibold leading-tight">{locTitle(lang, design)}</h2>
            <p className="mt-1 text-[11px] text-muted">
              {category ? loc(lang, category) : ""} · {collection?.name} · {design.code}
            </p>
          </div>
          <div className="flex flex-col items-end gap-1 text-right text-[10px] text-muted">
            <span className="flex items-center gap-1">
              <Icon name="eye" className="h-3 w-3" /> {design.views.toLocaleString("en-IN")}
            </span>
            <span className="flex items-center gap-1">
              <Icon name="download" className="h-3 w-3" /> {design.downloads}
            </span>
            <span className="flex items-center gap-1">
              <Icon name="heart" className="h-3 w-3" /> {design.favourites}
            </span>
          </div>
        </div>

        <p className="mt-2.5 text-[11.5px] leading-relaxed text-muted">{design.description}</p>

        <div className="no-scrollbar mt-3 flex gap-1.5 overflow-x-auto">
          {[design.colour, design.style, design.material, design.occasion, design.gender].map((tag) => (
            <span
              key={tag}
              className="shrink-0 rounded-full border border-line bg-surface2/70 px-2.5 py-1 text-[10.5px] text-muted"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-4 grid grid-cols-4 gap-2">
          <ActionButton
            icon="heart"
            label={fav ? t("favourited") : t("favourite")}
            active={fav}
            onClick={() => toggleFav(design.code)}
          />
          <ActionButton
            icon="download"
            label={design.allowDownload ? t("download") : "Locked"}
            disabled={!design.allowDownload}
            onClick={() => (design.allowDownload ? setSheet("download") : app.showToast("Download disabled by admin", "info"))}
          />
          <ActionButton
            icon="share"
            label={t("share")}
            disabled={!design.allowShare}
            onClick={() => (design.allowShare ? setSheet("share") : app.showToast("Sharing disabled for this design", "info"))}
          />
          <ActionButton icon="flag" label={t("report")} onClick={() => setSheet("report")} />
        </div>

        {related.length > 0 ? (
          <div className="mt-5">
            <p className="mb-2 text-[12px] font-bold">{t("related")}</p>
            <div className="no-scrollbar flex gap-2.5 overflow-x-auto pb-1">
              {related.map((r) => (
                <button
                  key={r.code}
                  type="button"
                  onClick={() => app.openViewer(related.map((x) => x.code), related.indexOf(r))}
                  className="tap w-[86px] shrink-0"
                >
                  <div className="relative">
                    <Img src={r.thumb} alt={r.title} className="h-[112px] w-full rounded-xl border border-line" />
                    {r.isPremium && !hasAccess(r) ? (
                      <span className="absolute inset-0 flex items-center justify-center rounded-xl bg-ink/55">
                        <Icon name="lock" className="h-4 w-4 text-gold" />
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-1 truncate text-[9.5px] text-muted">{r.code}</p>
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      {/* sheets */}
      <Sheet open={sheet === "download"} onClose={() => setSheet(null)} title={t("download")} subtitle={design.code}>
        <div className="space-y-2">
          {[
            { key: "Standard", note: "1080 px · fastest", locked: false },
            { key: "HD", note: "2048 px · recommended", locked: locked },
            { key: "Ultra HD", note: "4096 px · print ready", locked: locked || app.activePlan?.quality !== "Ultra HD" },
          ].map((opt) => (
            <button
              key={opt.key}
              type="button"
              onClick={() => !opt.locked && setQuality(opt.key)}
              className={`tap flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left ${
                quality === opt.key && !opt.locked ? "gold-border" : "border-line bg-surface2/60"
              } ${opt.locked ? "opacity-50" : ""}`}
            >
              <Icon name={opt.locked ? "lock" : "image"} className="h-4 w-4 text-gold" />
              <span className="flex-1">
                <span className="block text-[13px] font-semibold">{opt.key}</span>
                <span className="block text-[10.5px] text-muted">{opt.note}</span>
              </span>
              {quality === opt.key && !opt.locked ? (
                <Icon name="check" className="h-4 w-4 text-gold" strokeWidth={2.6} />
              ) : null}
            </button>
          ))}
        </div>
        <div className="mt-3 rounded-2xl border border-line bg-surface2/50 p-3 text-[10.5px] leading-relaxed text-muted">
          {app.isSubscribed
            ? `Watermark-free · saved to your phone gallery · ${app.user.downloadsUsed}/${app.activePlan?.downloadLimit} downloads used this cycle.`
            : "Free designs download with a small watermark. Subscribe for watermark-free HD files."}
        </div>
        <button
          type="button"
          onClick={startDownload}
          className="tap mt-4 w-full rounded-2xl bg-gold py-3.5 text-[13.5px] font-bold text-ink"
        >
          {locked ? "Subscribe to download" : `Download ${quality}`}
        </button>
      </Sheet>

      <Sheet open={sheet === "share"} onClose={() => setSheet(null)} title={t("share")} subtitle={design.code}>
        <div className="mb-4 grid grid-cols-3 gap-2">
          {(
            [
              { key: "link", label: "Public link", note: "prasannatrends.in/d/" + design.code.toLowerCase() },
              { key: "preview", label: "Watermarked", note: "Preview image" },
              { key: "original", label: "Original file", note: locked ? "Premium only" : "Full quality" },
            ] as const
          ).map((m) => (
            <button
              key={m.key}
              type="button"
              onClick={() => !(m.key === "original" && locked) && setShareMode(m.key)}
              className={`tap rounded-2xl border p-2.5 text-left ${
                shareMode === m.key ? "gold-border" : "border-line bg-surface2/60"
              } ${m.key === "original" && locked ? "opacity-50" : ""}`}
            >
              <span className="block text-[11.5px] font-semibold">{m.label}</span>
              <span className="mt-0.5 block truncate text-[9px] text-muted">{m.note}</span>
            </button>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-3">
          {SHARE_TARGETS.map((s) => (
            <button
              key={s.key}
              type="button"
              onClick={() => {
                app.recordShare(design.code, s.key);
                setSheet(null);
              }}
              className="tap flex flex-col items-center gap-2 rounded-2xl border border-line bg-surface2/50 py-3.5"
            >
              <span className={`flex h-10 w-10 items-center justify-center rounded-full text-lg ${s.tint}`}>
                {s.emoji}
              </span>
              <span className="text-[10.5px] font-medium">{s.key}</span>
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => {
            app.recordShare(design.code, "Copied link");
            setSheet(null);
          }}
          className="tap mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border border-line py-3 text-[12.5px] font-semibold text-cream"
        >
          <Icon name="tag" className="h-4 w-4 text-gold" /> Copy design link
        </button>
      </Sheet>

      <Sheet
        open={sheet === "report"}
        onClose={() => setSheet(null)}
        title="Report this design"
        subtitle="Our team reviews reports within 48 hours"
      >
        <div className="space-y-2">
          {data.reportReasons.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setReason(r)}
              className={`tap flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-[13px] ${
                reason === r ? "gold-border font-semibold text-goldsoft" : "border-line bg-surface2/60"
              }`}
            >
              {r}
              {reason === r ? <Icon name="check" className="h-4 w-4 text-gold" strokeWidth={2.6} /> : null}
            </button>
          ))}
        </div>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
          placeholder="Add a note (optional)"
          className="mt-3 w-full rounded-2xl border border-line bg-surface2/60 p-3 text-[12.5px] outline-none placeholder:text-muted/60"
        />
        <button
          type="button"
          disabled={!reason}
          onClick={() => {
            if (!reason) return;
            app.submitReport(design.code, reason, note);
            setReason(null);
            setNote("");
            setSheet(null);
          }}
          className={`tap mt-3 w-full rounded-2xl py-3.5 text-[13.5px] font-bold ${
            reason ? "bg-rose text-ink" : "bg-surface3 text-muted"
          }`}
        >
          Submit report
        </button>
      </Sheet>

      <Sheet open={sheet === "details"} onClose={() => setSheet(null)} title={t("details")}>
        <div className="divide-y divide-line/60 overflow-hidden rounded-2xl border border-line bg-surface2/40">
          {[
            [t("code"), design.code],
            ["Category", category ? loc(lang, category) : "—"],
            ["Collection", collection?.name ?? "—"],
            [t("colour"), design.colour],
            [t("style"), design.style],
            [t("material"), design.material],
            [t("occasion"), design.occasion],
            [t("gender"), design.gender],
            ["Published", new Date(design.publishedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })],
            ["Download", design.allowDownload ? "Allowed" : "Disabled by admin"],
            ["Sharing", design.allowShare ? "Allowed" : "Disabled by admin"],
          ].map(([k, v]) => (
            <div key={k} className="flex items-center justify-between px-4 py-2.5">
              <span className="text-[11.5px] text-muted">{k}</span>
              <span className="text-[11.5px] font-medium">{v}</span>
            </div>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {design.tags.map((tag) => (
            <span key={tag} className="rounded-full border border-line px-2.5 py-1 text-[10.5px] text-muted">
              #{tag}
            </span>
          ))}
        </div>
      </Sheet>
    </div>
  );
}

function ActionButton({
  icon,
  label,
  onClick,
  active = false,
  disabled = false,
}: {
  icon: string;
  label: string;
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`tap flex flex-col items-center gap-1.5 rounded-2xl border py-2.5 ${
        active ? "border-rose/50 bg-rose/15 text-rose" : "border-line bg-surface2/60 text-cream"
      } ${disabled ? "opacity-45" : ""}`}
    >
      <Icon name={icon} className="h-4.5 w-4.5" filled={active} strokeWidth={active ? 0 : 1.8} />
      <span className="text-[10px] font-semibold">{label}</span>
    </button>
  );
}
