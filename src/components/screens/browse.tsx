"use client";

import { useMemo, useState } from "react";
import { useApp } from "../app-context";
import { Chip, DesignGrid, EmptyState, Icon, Img, SectionHeader, Sheet, TopBar } from "../ui";
import { loc } from "@/lib/i18n";
import type { Design } from "@/lib/types";

type SortKey = "latest" | "popular" | "views" | "downloads";

const SORTS: { key: SortKey; label: string }[] = [
  { key: "latest", label: "Latest first" },
  { key: "popular", label: "Most favourited" },
  { key: "views", label: "Most viewed" },
  { key: "downloads", label: "Most downloaded" },
];

const uniq = (arr: string[]) => Array.from(new Set(arr)).sort();

export function FilterableGrid({ designs }: { designs: Design[] }) {
  const { t } = useApp();
  const [access, setAccess] = useState<"all" | "free" | "premium">("all");
  const [colour, setColour] = useState<string | null>(null);
  const [occasion, setOccasion] = useState<string | null>(null);
  const [material, setMaterial] = useState<string | null>(null);
  const [gender, setGender] = useState<string | null>(null);
  const [sort, setSort] = useState<SortKey>("latest");
  const [sheet, setSheet] = useState<"filter" | "sort" | null>(null);

  const facets = useMemo(
    () => ({
      colours: uniq(designs.map((d) => d.colour)),
      occasions: uniq(designs.map((d) => d.occasion)),
      materials: uniq(designs.map((d) => d.material)),
      genders: uniq(designs.map((d) => d.gender)),
    }),
    [designs],
  );

  const filtered = useMemo(() => {
    const list = designs.filter((d) => {
      if (access === "free" && d.isPremium) return false;
      if (access === "premium" && !d.isPremium) return false;
      if (colour && d.colour !== colour) return false;
      if (occasion && d.occasion !== occasion) return false;
      if (material && d.material !== material) return false;
      if (gender && d.gender !== gender) return false;
      return true;
    });
    const sorted = [...list];
    if (sort === "latest") sorted.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
    if (sort === "popular") sorted.sort((a, b) => b.favourites - a.favourites);
    if (sort === "views") sorted.sort((a, b) => b.views - a.views);
    if (sort === "downloads") sorted.sort((a, b) => b.downloads - a.downloads);
    return sorted;
  }, [access, colour, designs, gender, material, occasion, sort]);

  const activeCount = [colour, occasion, material, gender].filter(Boolean).length + (access !== "all" ? 1 : 0);

  const resetAll = () => {
    setAccess("all");
    setColour(null);
    setOccasion(null);
    setMaterial(null);
    setGender(null);
  };

  return (
    <>
      <div className="sticky top-[57px] z-20 border-y border-line/60 bg-ink/90 py-2.5 backdrop-blur-xl">
        <div className="no-scrollbar flex items-center gap-2 overflow-x-auto px-4">
          <button
            type="button"
            onClick={() => setSheet("filter")}
            className={`tap flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px] font-semibold ${
              activeCount ? "border-gold/60 bg-gold/15 text-goldsoft" : "border-line bg-surface2/70 text-cream"
            }`}
          >
            <Icon name="filter" className="h-3.5 w-3.5" />
            {t("filters")}
            {activeCount ? (
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[9px] font-bold text-ink">
                {activeCount}
              </span>
            ) : null}
          </button>
          <button
            type="button"
            onClick={() => setSheet("sort")}
            className="tap flex shrink-0 items-center gap-1.5 rounded-full border border-line bg-surface2/70 px-3 py-1.5 text-[12px] font-semibold text-cream"
          >
            <Icon name="sort" className="h-3.5 w-3.5" />
            {SORTS.find((s) => s.key === sort)?.label}
          </button>
          <span className="h-4 w-px shrink-0 bg-line" />
          {(["all", "free", "premium"] as const).map((k) => (
            <Chip key={k} active={access === k} tone="gold" onClick={() => setAccess(k)}>
              {k === "all" ? "All" : k === "free" ? t("free") : t("premium")}
            </Chip>
          ))}
          {facets.occasions.slice(0, 5).map((o) => (
            <Chip key={o} active={occasion === o} onClick={() => setOccasion(occasion === o ? null : o)}>
              {o}
            </Chip>
          ))}
        </div>
      </div>

      <div className="pt-4">
        {filtered.length === 0 ? (
          <EmptyState
            icon="search"
            title={t("noResults")}
            subtitle={t("noResultsSub")}
            actionLabel={t("reset")}
            onAction={resetAll}
          />
        ) : (
          <DesignGrid codes={filtered.map((d) => d.code)} />
        )}
      </div>

      <Sheet
        open={sheet === "sort"}
        onClose={() => setSheet(null)}
        title={t("sort")}
        subtitle="Applies to this list only"
      >
        <div className="space-y-1.5">
          {SORTS.map((s) => (
            <button
              key={s.key}
              type="button"
              onClick={() => {
                setSort(s.key);
                setSheet(null);
              }}
              className={`tap flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-[13px] ${
                sort === s.key ? "gold-border font-semibold text-goldsoft" : "border-line bg-surface2/60 text-cream"
              }`}
            >
              {s.label}
              {sort === s.key ? <Icon name="check" className="h-4 w-4 text-gold" strokeWidth={2.5} /> : null}
            </button>
          ))}
        </div>
      </Sheet>

      <Sheet
        open={sheet === "filter"}
        onClose={() => setSheet(null)}
        title={t("filters")}
        subtitle="Attributes are configured per category by the admin"
      >
        <div className="space-y-5">
          <FacetRow label={t("colour")} options={facets.colours} value={colour} onChange={setColour} />
          <FacetRow label={t("occasion")} options={facets.occasions} value={occasion} onChange={setOccasion} />
          <FacetRow label={t("material")} options={facets.materials} value={material} onChange={setMaterial} />
          <FacetRow label={t("gender")} options={facets.genders} value={gender} onChange={setGender} />
        </div>
        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={resetAll}
            className="tap flex-1 rounded-2xl border border-line py-3 text-[13px] font-semibold text-muted"
          >
            {t("reset")}
          </button>
          <button
            type="button"
            onClick={() => setSheet(null)}
            className="tap flex-[1.6] rounded-2xl bg-gold py-3 text-[13px] font-bold text-ink"
          >
            {t("apply")} · {filtered.length} {t("designs")}
          </button>
        </div>
      </Sheet>
    </>
  );
}

function FacetRow({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string | null;
  onChange: (v: string | null) => void;
}) {
  return (
    <div>
      <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-muted">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <Chip key={o} active={value === o} onClick={() => onChange(value === o ? null : o)}>
            {o}
          </Chip>
        ))}
      </div>
    </div>
  );
}

export function ExploreScreen() {
  const { data, lang, t, push, setTab } = useApp();
  const [cat, setCat] = useState(data.categories[0]?.slug ?? "clothing");
  const category = data.categories.find((c) => c.slug === cat);
  const subs = data.subcategories.filter((s) => s.categorySlug === cat);
  const cols = data.collections.filter((c) => c.categorySlug === cat);

  return (
    <div className="anim-screen pb-4">
      <TopBar
        title={t("explore")}
        subtitle={`${data.categories.filter((c) => !c.comingSoon).length} categories · ${data.designs.length} designs`}
        right={
          <button
            type="button"
            onClick={() => setTab("search")}
            className="tap flex h-9 w-9 items-center justify-center rounded-full border border-line bg-surface2"
          >
            <Icon name="search" className="h-4 w-4" />
          </button>
        }
      />

      <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 py-3">
        {data.categories.map((c) => (
          <button
            key={c.slug}
            type="button"
            onClick={() => !c.comingSoon && setCat(c.slug)}
            className={`tap flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-2 text-[12.5px] font-semibold ${
              cat === c.slug ? "border-gold/60 bg-gold/15 text-goldsoft" : "border-line bg-surface2/60 text-muted"
            } ${c.comingSoon ? "opacity-60" : ""}`}
          >
            <span>{c.emoji}</span>
            {loc(lang, c)}
            {c.comingSoon ? <span className="text-[9px] text-gold">SOON</span> : null}
          </button>
        ))}
      </div>

      {category ? (
        <div className="px-4">
          <div className="relative h-[112px] overflow-hidden rounded-2xl border border-line">
            <Img src={category.cover} alt={category.name} className="absolute inset-0 h-full w-full" />
            <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/70 to-transparent" />
            <div className="absolute inset-y-0 left-0 flex w-[74%] flex-col justify-center p-4">
              <p className="font-display text-[18px] font-semibold">{loc(lang, category)}</p>
              <p className="mt-0.5 text-[11px] text-muted">{category.tagline}</p>
              <button
                type="button"
                onClick={() => push({ name: "category", slug: category.slug })}
                className="tap mt-2 inline-flex w-fit items-center gap-1 rounded-full bg-cream px-3 py-1 text-[10.5px] font-bold text-ink"
              >
                Browse {category.designCount} {t("designs")}
                <Icon name="right" className="h-3 w-3" strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <div className="pt-6">
        <SectionHeader title={t("subcategories")} subtitle="Tap to open a focused grid" />
        <div className="grid grid-cols-2 gap-3 px-4">
          {subs.map((s) => (
            <button
              key={s.slug}
              type="button"
              onClick={() => push({ name: "subcategory", slug: s.slug })}
              className="tap relative h-[92px] overflow-hidden rounded-2xl border border-line text-left"
            >
              <Img src={s.cover} alt={s.name} className="absolute inset-0 h-full w-full" />
              <span className="absolute inset-0 bg-gradient-to-t from-ink via-ink/45 to-transparent" />
              <span className="absolute inset-x-3 bottom-2.5">
                <span className="block truncate text-[12.5px] font-semibold">{loc(lang, s)}</span>
                <span className="block text-[10px] text-muted">
                  {s.designCount} {t("designs")}
                </span>
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="pt-7">
        <SectionHeader title={t("collections")} subtitle="Curated by the studio team" />
        <div className="no-scrollbar flex gap-3 overflow-x-auto px-4">
          {cols.map((c) => (
            <button
              key={c.slug}
              type="button"
              onClick={() => push({ name: "collection", slug: c.slug })}
              className="tap w-[132px] shrink-0 text-left"
            >
              <Img src={c.cover} alt={c.name} className="h-[132px] w-full rounded-2xl border border-line" />
              <p className="mt-2 truncate text-[12px] font-semibold">{loc(lang, c)}</p>
              <p className="text-[10px] text-muted">
                {c.designCount} {t("designs")}
              </p>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-7 px-4">
        <div className="flex items-start gap-3 rounded-2xl border border-dashed border-line p-4">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-surface2 text-lg">🪷</span>
          <div>
            <p className="text-[12.5px] font-semibold">Mehendi &amp; Rangoli arriving soon</p>
            <p className="mt-0.5 text-[10.5px] leading-relaxed text-muted">
              New categories added from the admin panel appear here automatically. You will get a push
              notification the moment it goes live.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CategoryScreen({ slug }: { slug: string }) {
  const { data, lang, t, push, back } = useApp();
  const category = data.categories.find((c) => c.slug === slug);
  const subs = data.subcategories.filter((s) => s.categorySlug === slug);
  const designs = useMemo(() => data.designs.filter((d) => d.categorySlug === slug), [data.designs, slug]);
  if (!category) return null;

  return (
    <div className="anim-screen pb-4">
      <TopBar
        title={loc(lang, category)}
        subtitle={`${designs.length} ${t("designs")}`}
        onBack={back}
      />
      <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 py-3">
        {subs.map((s) => (
          <button
            key={s.slug}
            type="button"
            onClick={() => push({ name: "subcategory", slug: s.slug })}
            className="tap flex shrink-0 items-center gap-2 rounded-full border border-line bg-surface2/60 py-1 pl-1 pr-3"
          >
            <Img src={s.cover} alt={s.name} className="h-7 w-7 rounded-full" />
            <span className="text-[12px] font-semibold">{loc(lang, s)}</span>
            <span className="text-[10px] text-muted">{s.designCount}</span>
          </button>
        ))}
      </div>
      <FilterableGrid designs={designs} />
    </div>
  );
}

export function SubcategoryScreen({ slug }: { slug: string }) {
  const { data, lang, t, push, back } = useApp();
  const sub = data.subcategories.find((s) => s.slug === slug);
  const cols = data.collections.filter((c) => c.subcategorySlug === slug);
  const designs = useMemo(() => data.designs.filter((d) => d.subcategorySlug === slug), [data.designs, slug]);
  if (!sub) return null;

  return (
    <div className="anim-screen pb-4">
      <TopBar title={loc(lang, sub)} subtitle={`${designs.length} ${t("designs")}`} onBack={back} />
      {cols.length > 0 ? (
        <div className="no-scrollbar flex gap-3 overflow-x-auto px-4 py-3">
          {cols.map((c) => (
            <button
              key={c.slug}
              type="button"
              onClick={() => push({ name: "collection", slug: c.slug })}
              className="tap relative h-[74px] w-[62%] shrink-0 overflow-hidden rounded-2xl border border-line text-left"
            >
              <Img src={c.cover} alt={c.name} className="absolute inset-0 h-full w-full" />
              <span className="absolute inset-0 bg-gradient-to-r from-ink/95 via-ink/60 to-transparent" />
              <span className="absolute inset-y-0 left-0 flex flex-col justify-center p-3">
                <span className="text-[12px] font-semibold">{loc(lang, c)}</span>
                <span className="text-[10px] text-muted">
                  {c.designCount} {t("designs")}
                </span>
              </span>
            </button>
          ))}
        </div>
      ) : null}
      <FilterableGrid designs={designs} />
    </div>
  );
}

export function CollectionScreen({ slug }: { slug: string }) {
  const { data, lang, t, back } = useApp();
  const col = data.collections.find((c) => c.slug === slug);
  const designs = useMemo(() => data.designs.filter((d) => d.collectionSlug === slug), [data.designs, slug]);
  if (!col) return null;

  return (
    <div className="anim-screen pb-4">
      <TopBar title={loc(lang, col)} subtitle={`${designs.length} ${t("designs")}`} onBack={back} />
      <div className="px-4 pb-1 pt-3">
        <div className="relative h-[128px] overflow-hidden rounded-2xl border border-line">
          <Img src={col.cover} alt={col.name} className="absolute inset-0 h-full w-full" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/45 to-transparent" />
          <div className="absolute inset-x-4 bottom-3">
            <p className="font-display text-[16px] font-semibold">{loc(lang, col)}</p>
            <p className="text-[11px] text-muted">{col.blurb}</p>
          </div>
        </div>
      </div>
      <FilterableGrid designs={designs} />
    </div>
  );
}

export function GridScreen({ title, codes }: { title: string; codes: string[] }) {
  const { byCode, back, t } = useApp();
  const designs = codes.map((c) => byCode.get(c)).filter(Boolean) as Design[];
  return (
    <div className="anim-screen pb-4">
      <TopBar title={title} subtitle={`${designs.length} ${t("designs")}`} onBack={back} />
      <FilterableGrid designs={designs} />
    </div>
  );
}
