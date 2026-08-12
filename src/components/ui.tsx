"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useApp } from "./app-context";
import { locTitle } from "@/lib/i18n";

/* ----------------------------- icons ----------------------------- */

const PATHS: Record<string, string[]> = {
  home: ["M3 10.6 12 3.2l9 7.4", "M5.6 9.4V20h12.8V9.4"],
  compass: ["M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z", "m15.6 8.4-2.1 5.1-5.1 2.1 2.1-5.1 5.1-2.1z"],
  search: ["M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14z", "m20 20-3.6-3.6"],
  heart: ["M12 20.2S4.8 15.9 4.8 10.7A4.1 4.1 0 0 1 12 8a4.1 4.1 0 0 1 7.2 2.7c0 5.2-7.2 9.5-7.2 9.5z"],
  user: ["M12 4.6a3.6 3.6 0 1 0 0 7.2 3.6 3.6 0 0 0 0-7.2z", "M4.8 20a7.2 7.2 0 0 1 14.4 0"],
  bell: ["M6 9.5a6 6 0 1 1 12 0c0 3.8 1.5 5.2 1.5 5.2h-15S6 13.3 6 9.5z", "M10 18.2a2 2 0 0 0 4 0"],
  left: ["m14.5 5-7 7 7 7"],
  right: ["m9.5 5 7 7-7 7"],
  down: ["m5 9 7 7 7-7"],
  up: ["m5 15 7-7 7 7"],
  download: ["M12 4v11", "m8 11 4 4 4-4", "M5 19h14"],
  share: ["M12 4v11", "m8 8 4-4 4 4", "M5 13v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5"],
  lock: ["M5.5 11.5h13v8.5h-13z", "M8.5 11.5V8a3.5 3.5 0 1 1 7 0v3.5"],
  crown: ["M4 17.5h16l1-9.5-5.2 3.2L12 4.5 8.2 11.2 3 8l1 9.5z"],
  filter: ["M4 6h16", "M7 12h10", "M10 18h4"],
  sort: ["M4 7h10", "M4 12h7", "M4 17h4", "M17 6v12", "m14 15 3 3 3-3"],
  close: ["M6 6l12 12", "M18 6 6 18"],
  check: ["m5 12.5 4.5 4.5L19 7"],
  plus: ["M12 5v14", "M5 12h14"],
  folder: ["M4 7.5A2 2 0 0 1 6 5.5h3.4l2 2H18a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z"],
  globe: ["M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z", "M3 12h18", "M12 3c3 3.6 3 14.4 0 18", "M12 3c-3 3.6-3 14.4 0 18"],
  shield: ["M12 3.5 5 6v6c0 4.6 3 7.6 7 8.6 4-1 7-4 7-8.6V6z"],
  help: ["M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z", "M9.6 9.6A2.5 2.5 0 1 1 12 12.6V14", "M12 17.2v.2"],
  mail: ["M3.5 6h17v12h-17z", "m3.9 7 8.1 5.6L20.1 7"],
  phone: ["M6 3.6h3l1.5 4-2 1.4a12 12 0 0 0 6.5 6.5l1.4-2 4 1.5v3a2 2 0 0 1-2.1 2A16.4 16.4 0 0 1 4 6a2 2 0 0 1 2-2.4z"],
  trash: ["M5 7h14", "M9.5 7V4.8h5V7", "m6.8 7 1 13.2h8.4L17.2 7"],
  star: ["m12 4 2.4 5 5.6.8-4 3.8 1 5.4-5-2.7-5 2.7 1-5.4-4-3.8 5.6-.8z"],
  eye: ["M2.5 12S6 6.2 12 6.2 21.5 12 21.5 12 18 17.8 12 17.8 2.5 12 2.5 12z", "M12 9.6a2.4 2.4 0 1 0 0 4.8 2.4 2.4 0 0 0 0-4.8z"],
  clock: ["M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z", "M12 7v5.4l3.4 2"],
  sparkle: ["M12 3.4 13.9 9l5.6 1.9-5.6 1.9L12 18.4l-1.9-5.6L4.5 10.9 10.1 9z"],
  image: ["M3.5 5h17v14h-17z", "m5 16.5 4-4 3 3 3.5-3.5 3.5 3.5"],
  flag: ["M6 21V4", "M6 4h11l-2 3.6L17 11H6"],
  arrow: ["M4 12h15", "m14 7 5 5-5 5"],
  card: ["M3 6.5h18v11H3z", "M3 10.2h18"],
  wallet: ["M4 7h13a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4z", "M15.5 13h3.5"],
  bank: ["m4 10 8-5 8 5", "M6.5 10.5v7M10.5 10.5v7M14 10.5v7M17.5 10.5v7", "M4 20.2h16"],
  refresh: ["M20 12a8 8 0 1 1-2.4-5.7", "M20 4.5v4h-4"],
  logout: ["M14.5 12H4", "m8 8-4 4 4 4", "M12.5 4.5H18a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2h-5.5"],
  settings: ["M12 9.2a2.8 2.8 0 1 0 0 5.6 2.8 2.8 0 0 0 0-5.6z", "M12 3.4v2M12 18.6v2M20.6 12h-2M5.4 12h-2M18 6l-1.4 1.4M7.4 16.6 6 18M6 6l1.4 1.4M16.6 16.6 18 18"],
  grid: ["M4 4.5h6.5V11H4z", "M13.5 4.5H20V11h-6.5z", "M4 13.5h6.5V20H4z", "M13.5 13.5H20V20h-6.5z"],
  zoom: ["M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14z", "m20 20-3.6-3.6", "M11 8.4v5.2M8.4 11h5.2"],
  dots: ["M6 12h.01", "M12 12h.01", "M18 12h.01"],
  play: ["m8 5 11 7-11 7z"],
  scan: ["M4 8V5.5A1.5 1.5 0 0 1 5.5 4H8", "M16 4h2.5A1.5 1.5 0 0 1 20 5.5V8", "M20 16v2.5a1.5 1.5 0 0 1-1.5 1.5H16", "M8 20H5.5A1.5 1.5 0 0 1 4 18.5V16"],
  tag: ["M4 11.5V5h6.5l9 9-6.5 6.5z", "M8 8.2v.01"],
  ticket: ["M4 8.5A1.5 1.5 0 0 1 5.5 7h13A1.5 1.5 0 0 1 20 8.5v2a2 2 0 0 0 0 3.9v2a1.5 1.5 0 0 1-1.5 1.6h-13A1.5 1.5 0 0 1 4 16.4v-2a2 2 0 0 0 0-3.9z"],
};

export function Icon({
  name,
  className = "h-5 w-5",
  strokeWidth = 1.7,
  filled = false,
}: {
  name: keyof typeof PATHS | string;
  className?: string;
  strokeWidth?: number;
  filled?: boolean;
}) {
  const paths = PATHS[name] ?? PATHS.sparkle;
  return (
    <svg
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      {paths.map((d, i) => (
        <path key={i} d={d} />
      ))}
    </svg>
  );
}

/* ----------------------------- primitives ----------------------------- */

export function Chip({
  children,
  active = false,
  onClick,
  tone = "default",
}: {
  children: ReactNode;
  active?: boolean;
  onClick?: () => void;
  tone?: "default" | "gold";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`tap shrink-0 rounded-full border px-3.5 py-1.5 text-[12px] font-semibold tracking-wide ${
        active
          ? tone === "gold"
            ? "border-gold/60 bg-gold/15 text-goldsoft"
            : "border-cream/70 bg-cream text-ink"
          : "border-line bg-surface2/70 text-muted"
      }`}
    >
      {children}
    </button>
  );
}

export function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!on)}
      className={`tap relative h-6 w-11 shrink-0 rounded-full transition-colors ${on ? "bg-gold" : "bg-surface3"}`}
      aria-pressed={on}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-ink transition-all ${on ? "left-[22px]" : "left-0.5"}`}
      />
    </button>
  );
}

export function TopBar({
  title,
  subtitle,
  right,
  onBack,
  transparent = false,
}: {
  title: string;
  subtitle?: string;
  right?: ReactNode;
  onBack?: () => void;
  transparent?: boolean;
}) {
  return (
    <div
      className={`sticky top-0 z-30 flex items-center gap-3 px-4 py-3 ${
        transparent ? "" : "border-b border-line/70 bg-ink/85 backdrop-blur-xl"
      }`}
    >
      {onBack ? (
        <button
          type="button"
          onClick={onBack}
          className="tap flex h-9 w-9 items-center justify-center rounded-full border border-line bg-surface2/80 text-cream"
          aria-label="Back"
        >
          <Icon name="left" className="h-4.5 w-4.5" />
        </button>
      ) : null}
      <div className="min-w-0 flex-1">
        <h1 className="truncate font-display text-[17px] font-semibold leading-tight">{title}</h1>
        {subtitle ? <p className="truncate text-[11px] text-muted">{subtitle}</p> : null}
      </div>
      {right}
    </div>
  );
}

export function Sheet({
  open,
  onClose,
  title,
  subtitle,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end">
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-black/65 backdrop-blur-[2px]"
      />
      <div className="anim-sheet relative max-h-[82%] overflow-y-auto rounded-t-[28px] border-t border-line bg-surface px-5 pb-8 pt-3 no-scrollbar">
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-line" />
        {title ? (
          <div className="mb-4">
            <h3 className="font-display text-lg font-semibold">{title}</h3>
            {subtitle ? <p className="mt-0.5 text-xs text-muted">{subtitle}</p> : null}
          </div>
        ) : null}
        {children}
      </div>
    </div>
  );
}

export function SectionHeader({
  title,
  subtitle,
  actionLabel,
  onAction,
}: {
  title: string;
  subtitle?: string | null;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="mb-3 flex items-end justify-between gap-3 px-4">
      <div className="min-w-0">
        <h2 className="font-display text-[19px] font-semibold leading-tight">{title}</h2>
        {subtitle ? <p className="mt-0.5 text-[11px] text-muted">{subtitle}</p> : null}
      </div>
      {actionLabel && onAction ? (
        <button
          type="button"
          onClick={onAction}
          className="tap shrink-0 text-[12px] font-semibold text-gold"
        >
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}

export function EmptyState({
  icon = "sparkle",
  title,
  subtitle,
  actionLabel,
  onAction,
}: {
  icon?: string;
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="anim-up flex flex-col items-center px-8 py-14 text-center">
      <div className="relative mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-line bg-surface2">
        <span className="absolute inset-0 rounded-2xl border border-gold/25 anim-ring" />
        <Icon name={icon} className="h-7 w-7 text-gold" />
      </div>
      <h3 className="font-display text-lg font-semibold">{title}</h3>
      {subtitle ? <p className="mt-1 text-[12px] leading-relaxed text-muted">{subtitle}</p> : null}
      {actionLabel && onAction ? (
        <button
          type="button"
          onClick={onAction}
          className="tap mt-5 rounded-full bg-gold px-5 py-2.5 text-[13px] font-bold text-ink"
        >
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}

export function Watermark({ compact = false }: { compact?: boolean }) {
  const rows = compact ? 5 : 9;
  return (
    <div className="watermark-tile pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-[-35%] flex -rotate-[24deg] flex-col justify-around">
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            className={`flex justify-around whitespace-nowrap font-semibold text-white/25 ${
              compact ? "text-[7px] tracking-[0.28em]" : "text-[10px] tracking-[0.38em]"
            }`}
          >
            {Array.from({ length: 3 }).map((_, j) => (
              <span key={j}>PRASANNA TRENDS</span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function Img({
  src,
  alt,
  className = "",
  imgClassName = "",
  fit = "cover",
}: {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  fit?: "cover" | "contain";
}) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  return (
    <div className={`relative overflow-hidden bg-surface2 ${className}`}>
      {!loaded && !failed ? <div className="absolute inset-0 shimmer" /> : null}
      {failed ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-surface2 text-muted">
          <Icon name="image" className="h-6 w-6" />
          <span className="text-[9px]">Retry</span>
        </div>
      ) : (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          className={`h-full w-full ${fit === "contain" ? "object-contain" : "object-cover"} transition-all duration-700 ${
            loaded ? "scale-100 opacity-100" : "scale-105 opacity-0"
          } ${imgClassName}`}
        />
      )}
    </div>
  );
}

/* ----------------------------- design tiles ----------------------------- */

export function PremiumTag({ small = false }: { small?: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-gold to-[#c99b3f] font-bold text-ink ${
        small ? "px-1.5 py-0.5 text-[8px]" : "px-2 py-0.5 text-[9px]"
      }`}
    >
      <Icon name="crown" className={small ? "h-2.5 w-2.5" : "h-3 w-3"} strokeWidth={2} />
      PREMIUM
    </span>
  );
}

export function FreeTag() {
  return (
    <span className="inline-flex items-center rounded-full border border-jade/40 bg-jade/15 px-2 py-0.5 text-[9px] font-bold text-jade">
      FREE
    </span>
  );
}

export function DesignTile({
  code,
  codes,
  index,
  ratio = "tall",
  showMeta = true,
}: {
  code: string;
  codes: string[];
  index: number;
  ratio?: "tall" | "square" | "wide";
  showMeta?: boolean;
}) {
  const { byCode, openViewer, favourites, toggleFav, hasAccess, lang } = useApp();
  const design = byCode.get(code);
  if (!design) return null;
  const locked = design.isPremium && !hasAccess(design);
  const fav = favourites.has(code);
  const aspect = ratio === "tall" ? "aspect-[3/4]" : ratio === "square" ? "aspect-square" : "aspect-[4/3]";

  return (
    <div className="group relative">
      <button
        type="button"
        onClick={() => openViewer(codes, index)}
        className="tap block w-full text-left"
      >
        <div className={`relative overflow-hidden rounded-2xl border border-line/80 ${aspect}`}>
          <Img src={design.thumb} alt={design.title} className="h-full w-full" />
          {locked ? (
            <>
              <div className="absolute inset-0 bg-ink/45 backdrop-blur-[3px]" />
              <Watermark compact />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-gold/50 bg-ink/70 text-gold">
                  <Icon name="lock" className="h-4 w-4" />
                </span>
              </div>
            </>
          ) : null}
          <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/80 to-transparent" />
          <div className="absolute left-2 top-2">{design.isPremium ? <PremiumTag small /> : <FreeTag />}</div>
          {showMeta ? (
            <div className="absolute inset-x-2 bottom-2">
              <p className="truncate text-[11.5px] font-semibold leading-tight text-cream">
                {locTitle(lang, design)}
              </p>
              <p className="mt-0.5 flex items-center gap-2 text-[9px] text-white/60">
                <span>{design.code}</span>
                <span className="flex items-center gap-0.5">
                  <Icon name="eye" className="h-2.5 w-2.5" /> {(design.views / 1000).toFixed(1)}k
                </span>
              </p>
            </div>
          ) : null}
        </div>
      </button>
      <button
        type="button"
        onClick={() => toggleFav(code)}
        aria-label="Favourite"
        className={`tap absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full border backdrop-blur ${
          fav ? "border-rose/50 bg-rose/25 text-rose" : "border-white/15 bg-black/35 text-white/80"
        }`}
      >
        <Icon name="heart" className="h-3.5 w-3.5" filled={fav} strokeWidth={fav ? 0 : 1.8} />
      </button>
    </div>
  );
}

export function DesignRail({ codes, ratio = "tall" }: { codes: string[]; ratio?: "tall" | "square" }) {
  return (
    <div className="no-scrollbar flex gap-3 overflow-x-auto px-4 pb-1">
      {codes.map((code, i) => (
        <div key={code} className={ratio === "tall" ? "w-[43%] shrink-0" : "w-[38%] shrink-0"}>
          <DesignTile code={code} codes={codes} index={i} ratio={ratio} />
        </div>
      ))}
    </div>
  );
}

export function DesignGrid({ codes }: { codes: string[] }) {
  const [limit, setLimit] = useState(12);
  const signature = `${codes.length}:${codes[0] ?? ""}:${codes[codes.length - 1] ?? ""}`;
  useEffect(() => setLimit(12), [signature]);
  const visible = codes.slice(0, limit);
  const hasMore = limit < codes.length;
  return (
    <div className="px-4">
      <div className="grid grid-cols-2 gap-3">
        {visible.map((code, i) => (
          <DesignTile key={code} code={code} codes={codes} index={i} />
        ))}
      </div>
      {hasMore ? (
        <button
          type="button"
          onClick={() => setLimit((l) => l + 12)}
          className="tap mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-line bg-surface2 py-3 text-[12px] font-semibold text-muted"
        >
          <span className="h-3 w-3 rounded-full border-2 border-gold border-t-transparent anim-spin" />
          Load more designs
        </button>
      ) : (
        <p className="py-5 text-center text-[11px] text-muted/70">
          {codes.length} {codes.length === 1 ? "design" : "designs"} · end of list
        </p>
      )}
    </div>
  );
}

export function ListRow({
  icon,
  label,
  value,
  onClick,
  danger = false,
  right,
}: {
  icon: string;
  label: string;
  value?: string;
  onClick?: () => void;
  danger?: boolean;
  right?: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="tap flex w-full items-center gap-3 px-4 py-3 text-left"
    >
      <span
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${
          danger ? "border-rose/30 bg-rose/10 text-rose" : "border-line bg-surface2 text-gold"
        }`}
      >
        <Icon name={icon} className="h-4 w-4" />
      </span>
      <span className={`flex-1 text-[13.5px] font-medium ${danger ? "text-rose" : "text-cream"}`}>{label}</span>
      {value ? <span className="text-[11.5px] text-muted">{value}</span> : null}
      {right ?? <Icon name="right" className="h-4 w-4 text-muted/60" />}
    </button>
  );
}
