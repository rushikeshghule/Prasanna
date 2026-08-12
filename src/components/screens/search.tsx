"use client";

import { useMemo, useState } from "react";
import { useApp } from "../app-context";
import { Chip, DesignGrid, EmptyState, Icon, Img } from "../ui";
import { loc, locTitle } from "@/lib/i18n";

export function SearchScreen() {
  const { data, lang, t, push, searchHistory, addSearch, clearSearchHistory, openViewer } = useApp();
  const [q, setQ] = useState("");
  const [committed, setCommitted] = useState("");
  const [scope, setScope] = useState<"all" | "free" | "premium">("all");

  const term = (committed || q).trim().toLowerCase();

  const results = useMemo(() => {
    if (!term) return { designs: [], categories: [], collections: [] };
    const designs = data.designs.filter((d) => {
      const hay = [
        d.title,
        d.titleHi ?? "",
        d.code,
        d.colour,
        d.style,
        d.material,
        d.occasion,
        d.gender,
        d.categorySlug,
        d.subcategorySlug,
        d.collectionSlug,
        ...d.tags,
      ]
        .join(" ")
        .toLowerCase();
      if (!hay.includes(term)) return false;
      if (scope === "free" && d.isPremium) return false;
      if (scope === "premium" && !d.isPremium) return false;
      return true;
    });
    const categories = data.categories.filter((c) => c.name.toLowerCase().includes(term));
    const collections = data.collections.filter(
      (c) => c.name.toLowerCase().includes(term) || (c.blurb ?? "").toLowerCase().includes(term),
    );
    return { designs, categories, collections };
  }, [data.categories, data.collections, data.designs, scope, term]);

  const suggestions = useMemo(() => {
    if (!q.trim() || committed) return [];
    const lower = q.trim().toLowerCase();
    const pool = new Set<string>();
    data.designs.forEach((d) => {
      d.tags.forEach((tag) => {
        if (tag.toLowerCase().includes(lower)) pool.add(tag);
      });
      if (d.title.toLowerCase().includes(lower)) pool.add(d.title);
    });
    data.collections.forEach((c) => {
      if (c.name.toLowerCase().includes(lower)) pool.add(c.name);
    });
    return Array.from(pool).slice(0, 6);
  }, [committed, data.collections, data.designs, q]);

  const commit = (value: string) => {
    setQ(value);
    setCommitted(value);
    const count = data.designs.filter((d) =>
      [d.title, d.code, ...d.tags].join(" ").toLowerCase().includes(value.toLowerCase()),
    ).length;
    addSearch(value, count);
  };

  return (
    <div className="anim-screen pb-6">
      <div className="sticky top-0 z-30 border-b border-line/60 bg-ink/90 px-4 py-3 backdrop-blur-xl">
        <div className="flex items-center gap-2.5 rounded-2xl border border-line bg-surface2/70 px-3.5 py-2.5">
          <Icon name="search" className="h-4 w-4 text-muted" />
          <input
            value={q}
            autoFocus
            onChange={(e) => {
              setQ(e.target.value);
              setCommitted("");
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && q.trim()) commit(q.trim());
            }}
            placeholder={t("searchPlaceholder")}
            className="w-full bg-transparent text-[13px] outline-none placeholder:text-muted/70"
          />
          {q ? (
            <button
              type="button"
              onClick={() => {
                setQ("");
                setCommitted("");
              }}
              className="tap text-muted"
            >
              <Icon name="close" className="h-4 w-4" />
            </button>
          ) : null}
        </div>
        {term ? (
          <div className="no-scrollbar mt-2.5 flex gap-2 overflow-x-auto">
            {(["all", "free", "premium"] as const).map((s) => (
              <Chip key={s} active={scope === s} tone="gold" onClick={() => setScope(s)}>
                {s === "all" ? "All results" : s === "free" ? t("free") : t("premium")}
              </Chip>
            ))}
          </div>
        ) : null}
      </div>

      {!term ? (
        <div className="px-4 pt-5">
          {searchHistory.length > 0 ? (
            <>
              <div className="mb-2.5 flex items-center justify-between">
                <p className="text-[12px] font-bold uppercase tracking-wider text-muted">{t("recentSearches")}</p>
                <button type="button" onClick={clearSearchHistory} className="tap text-[11px] font-semibold text-gold">
                  {t("clearAll")}
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {searchHistory.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => commit(s)}
                    className="tap flex items-center gap-1.5 rounded-full border border-line bg-surface2/60 px-3 py-1.5 text-[12px] text-cream"
                  >
                    <Icon name="clock" className="h-3 w-3 text-muted" />
                    {s}
                  </button>
                ))}
              </div>
            </>
          ) : null}

          <p className="mb-2.5 mt-6 text-[12px] font-bold uppercase tracking-wider text-muted">
            {t("popularSearches")}
          </p>
          <div className="flex flex-wrap gap-2">
            {data.popularSearches.map((s, i) => (
              <button
                key={s}
                type="button"
                onClick={() => commit(s)}
                className="tap flex items-center gap-1.5 rounded-full border border-gold/25 bg-gold/10 px-3 py-1.5 text-[12px] font-semibold text-goldsoft"
              >
                <span className="text-[10px] text-gold/70">#{i + 1}</span>
                {s}
              </button>
            ))}
          </div>

          <p className="mb-3 mt-7 text-[12px] font-bold uppercase tracking-wider text-muted">
            Browse by {t("collections").toLowerCase()}
          </p>
          <div className="grid grid-cols-2 gap-3">
            {data.collections.slice(0, 6).map((c) => (
              <button
                key={c.slug}
                type="button"
                onClick={() => push({ name: "collection", slug: c.slug })}
                className="tap relative h-[84px] overflow-hidden rounded-2xl border border-line text-left"
              >
                <Img src={c.cover} alt={c.name} className="absolute inset-0 h-full w-full" />
                <span className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
                <span className="absolute inset-x-3 bottom-2 truncate text-[11.5px] font-semibold">
                  {loc(lang, c)}
                </span>
              </button>
            ))}
          </div>
        </div>
      ) : suggestions.length > 0 && !committed ? (
        <div className="px-4 pt-4">
          <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-muted">Suggestions</p>
          <div className="divide-y divide-line/60 overflow-hidden rounded-2xl border border-line bg-surface2/50">
            {suggestions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => commit(s)}
                className="tap flex w-full items-center gap-3 px-4 py-3 text-left"
              >
                <Icon name="search" className="h-3.5 w-3.5 text-muted" />
                <span className="flex-1 truncate text-[13px]">{s}</span>
                <Icon name="arrow" className="h-3.5 w-3.5 -rotate-45 text-muted/60" />
              </button>
            ))}
          </div>
          <ResultsBody
            count={results.designs.length}
            codes={results.designs.map((d) => d.code)}
            term={term}
          />
        </div>
      ) : (
        <div className="pt-4">
          {results.categories.length > 0 || results.collections.length > 0 ? (
            <div className="no-scrollbar mb-4 flex gap-2 overflow-x-auto px-4">
              {results.categories.map((c) => (
                <button
                  key={c.slug}
                  type="button"
                  onClick={() => push({ name: "category", slug: c.slug })}
                  className="tap shrink-0 rounded-full border border-line bg-surface2/70 px-3 py-1.5 text-[11.5px] font-semibold"
                >
                  {c.emoji} {loc(lang, c)}
                </button>
              ))}
              {results.collections.map((c) => (
                <button
                  key={c.slug}
                  type="button"
                  onClick={() => push({ name: "collection", slug: c.slug })}
                  className="tap shrink-0 rounded-full border border-line bg-surface2/70 px-3 py-1.5 text-[11.5px] font-semibold"
                >
                  📁 {loc(lang, c)}
                </button>
              ))}
            </div>
          ) : null}

          {results.designs.length === 0 ? (
            <EmptyState
              icon="search"
              title={t("noResults")}
              subtitle={`We could not find “${term}”. This search is logged so the studio can upload what you need.`}
              actionLabel="Request this design"
              onAction={() => push({ name: "support" })}
            />
          ) : (
            <>
              <p className="px-4 pb-3 text-[11.5px] text-muted">
                <span className="text-cream">{results.designs.length}</span> results for “{term}”
              </p>
              <DesignGrid codes={results.designs.map((d) => d.code)} />
              <div className="mt-4 px-4">
                <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-muted">Top match</p>
                <button
                  type="button"
                  onClick={() => openViewer(results.designs.map((d) => d.code), 0)}
                  className="tap flex w-full items-center gap-3 rounded-2xl border border-line bg-surface2/50 p-3 text-left"
                >
                  <Img src={results.designs[0].thumb} alt="" className="h-14 w-14 rounded-xl" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13px] font-semibold">
                      {locTitle(lang, results.designs[0])}
                    </span>
                    <span className="block text-[10.5px] text-muted">
                      {results.designs[0].code} · {results.designs[0].occasion} ·{" "}
                      {results.designs[0].isPremium ? t("premium") : t("free")}
                    </span>
                  </span>
                  <Icon name="right" className="h-4 w-4 text-muted" />
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function ResultsBody({ count, codes, term }: { count: number; codes: string[]; term: string }) {
  if (count === 0) return null;
  return (
    <div className="-mx-4 mt-5">
      <p className="px-4 pb-2 text-[11.5px] text-muted">
        {count} matches for “{term}”
      </p>
      <DesignGrid codes={codes} />
    </div>
  );
}
