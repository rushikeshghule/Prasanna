"use client";

import { useMemo, useState, useTransition } from "react";
import {
  ActionBtn,
  Area,
  Btn,
  Card,
  Check,
  Drawer,
  Empty,
  Field,
  I,
  Pill,
  SearchBox,
  Select,
  Table,
  Td,
  nice,
  statusTone,
  when,
} from "./ui";
import { bulkDesignAction, saveDesign, type DesignInput } from "@/app/admin/actions";

type D = DesignInput & { id: number; views: number; downloads: number; shares: number; favourites: number; publishedAt: string };
type Ref = { slug: string; name: string; categorySlug?: string; subcategorySlug?: string };

const STATUSES = ["published", "draft", "scheduled", "inactive", "archived"];
const BULK = [
  { key: "publish", label: "Publish" },
  { key: "draft", label: "Move to draft" },
  { key: "premium", label: "Mark premium" },
  { key: "free", label: "Mark free" },
  { key: "feature", label: "Feature" },
  { key: "archive", label: "Archive" },
];

export function DesignsPanel({
  designs,
  categories,
  subcategories,
  collections,
  plans,
  initialStatus,
}: {
  designs: D[];
  categories: Ref[];
  subcategories: Ref[];
  collections: Ref[];
  plans: { code: string; name: string }[];
  initialStatus?: string;
}) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");
  const [status, setStatus] = useState(initialStatus ?? "all");
  const [access, setAccess] = useState("all");
  const [sel, setSel] = useState<string[]>([]);
  const [edit, setEdit] = useState<D | "new" | null>(null);
  const [bulk, setBulk] = useState("publish");
  const [pending, start] = useTransition();

  const rows = useMemo(
    () =>
      designs.filter((d) => {
        if (cat !== "all" && d.categorySlug !== cat) return false;
        if (status !== "all" && d.status !== status) return false;
        if (access === "premium" && !d.isPremium) return false;
        if (access === "free" && d.isPremium) return false;
        if (q && ![d.title, d.code, d.colour, d.occasion, ...(d.tags ?? [])].join(" ").toLowerCase().includes(q.toLowerCase())) return false;
        return true;
      }),
    [access, cat, designs, q, status],
  );

  const allSel = rows.length > 0 && sel.length === rows.length;
  const dupes = useMemo(() => {
    const seen = new Map<string, number>();
    designs.forEach((d) => seen.set(d.image, (seen.get(d.image) ?? 0) + 1));
    return designs.filter((d) => (seen.get(d.image) ?? 0) > 1).map((d) => d.code);
  }, [designs]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-[12.5px] text-slate-500">
          {rows.length} of {designs.length} designs
          {dupes.length > 0 ? <span className="ml-2 text-amber-700">· {dupes.length} possible duplicate uploads detected</span> : null}
        </p>
        <div className="flex flex-wrap gap-2">
          <div className="w-52"><SearchBox value={q} onChange={setQ} placeholder="Title, code, tag…" /></div>
          <Btn variant="dark" onClick={() => setEdit("new")}><I n="plus" c="h-3.5 w-3.5" /> Upload design</Btn>
        </div>
      </div>

      <Card className="p-3">
        <div className="flex flex-wrap items-end gap-2.5">
          <div className="w-44"><Select label="Category" value={cat} onChange={setCat} options={[{ value: "all", label: "All categories" }, ...categories.map((c) => ({ value: c.slug, label: c.name }))]} /></div>
          <div className="w-40"><Select label="Status" value={status} onChange={setStatus} options={[{ value: "all", label: "All statuses" }, ...STATUSES.map((s) => ({ value: s, label: s }))]} /></div>
          <div className="w-36"><Select label="Access" value={access} onChange={setAccess} options={[{ value: "all", label: "All" }, { value: "free", label: "Free" }, { value: "premium", label: "Premium" }]} /></div>
          <div className="ml-auto flex items-end gap-2">
            <div className="w-40"><Select label={`Bulk action (${sel.length})`} value={bulk} onChange={setBulk} options={BULK.map((b) => ({ value: b.key, label: b.label }))} /></div>
            <Btn
              variant="outline"
              disabled={sel.length === 0 || pending}
              onClick={() => start(async () => { await bulkDesignAction(sel, bulk); setSel([]); })}
            >
              Apply
            </Btn>
          </div>
        </div>
      </Card>

      <Card>
        {rows.length === 0 ? (
          <Empty title="No designs match" sub="Adjust the filters or upload a new design." icon="image" />
        ) : (
          <Table head={["", "Design", "Placement", "Access", "Performance", "Status", ""]}>
            <tr className="bg-slate-50/60">
              <Td>
                <input
                  type="checkbox"
                  checked={allSel}
                  onChange={() => setSel(allSel ? [] : rows.map((r) => r.code))}
                  className="h-3.5 w-3.5 rounded border-slate-300 accent-amber-500"
                />
              </Td>
              <Td className="text-[11px] text-slate-500" >Select all {rows.length}</Td>
              <Td>{""}</Td><Td>{""}</Td><Td>{""}</Td><Td>{""}</Td><Td>{""}</Td>
            </tr>
            {rows.map((d) => (
              <tr key={d.code} className={`hover:bg-slate-50 ${sel.includes(d.code) ? "bg-amber-50/50" : ""}`}>
                <Td>
                  <input
                    type="checkbox"
                    checked={sel.includes(d.code)}
                    onChange={() => setSel((s) => (s.includes(d.code) ? s.filter((x) => x !== d.code) : [...s, d.code]))}
                    className="h-3.5 w-3.5 rounded border-slate-300 accent-amber-500"
                  />
                </Td>
                <Td>
                  <div className="flex items-center gap-2.5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={d.thumb} alt="" className="h-11 w-11 rounded-md object-cover ring-1 ring-slate-200" />
                    <div className="min-w-0">
                      <p className="truncate text-[12.5px] font-medium text-slate-800">{d.title}</p>
                      <p className="font-mono text-[10.5px] text-slate-400">{d.code}</p>
                      {dupes.includes(d.code) ? <Pill tone="amber">possible duplicate</Pill> : null}
                    </div>
                  </div>
                </Td>
                <Td className="text-[11.5px] capitalize text-slate-500">
                  {d.categorySlug} › {d.subcategorySlug}
                  <br />
                  <span className="text-slate-400">{d.collectionSlug}</span>
                </Td>
                <Td>
                  <div className="flex flex-wrap gap-1">
                    {d.isPremium ? <Pill tone="amber">Premium</Pill> : <Pill tone="green">Free</Pill>}
                    {!d.allowDownload ? <Pill tone="rose">No DL</Pill> : null}
                    {!d.allowShare ? <Pill tone="rose">No share</Pill> : null}
                  </div>
                </Td>
                <Td className="text-[11.5px] text-slate-500">
                  {nice(d.views)} views · {d.downloads} dl
                  <br />
                  <span className="text-slate-400">{d.favourites} saves · {when(d.publishedAt)}</span>
                </Td>
                <Td>
                  <div className="flex flex-wrap gap-1">
                    <Pill tone={statusTone(d.status)}>{d.status}</Pill>
                    {d.isFeatured ? <Pill tone="violet">Featured</Pill> : null}
                    {d.isTrending ? <Pill tone="blue">Trending</Pill> : null}
                  </div>
                </Td>
                <Td>
                  <div className="flex justify-end">
                    <Btn size="sm" variant="outline" onClick={() => setEdit(d)}><I n="edit" c="h-3.5 w-3.5" /> Edit</Btn>
                  </div>
                </Td>
              </tr>
            ))}
          </Table>
        )}
      </Card>

      {edit ? (
        <DesignDrawer
          value={edit}
          categories={categories}
          subcategories={subcategories}
          collections={collections}
          plans={plans}
          onClose={() => setEdit(null)}
        />
      ) : null}
    </div>
  );
}

function DesignDrawer({
  value,
  categories,
  subcategories,
  collections,
  plans,
  onClose,
}: {
  value: D | "new";
  categories: Ref[];
  subcategories: Ref[];
  collections: Ref[];
  plans: { code: string; name: string }[];
  onClose: () => void;
}) {
  const isNew = value === "new";
  const d = isNew ? null : value;
  const [f, setF] = useState<DesignInput>({
    id: d?.id,
    code: d?.code ?? `PT-NEW-${Math.floor(Math.random() * 9000) + 1000}`,
    title: d?.title ?? "",
    titleHi: d?.titleHi ?? "",
    titleMr: d?.titleMr ?? "",
    description: d?.description ?? "",
    categorySlug: d?.categorySlug ?? categories[0]?.slug ?? "clothing",
    subcategorySlug: d?.subcategorySlug ?? subcategories[0]?.slug ?? "",
    collectionSlug: d?.collectionSlug ?? collections[0]?.slug ?? "",
    image: d?.image ?? "https://images.pexels.com/photos/28943474/pexels-photo-28943474.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=900&h=1350",
    thumb: d?.thumb ?? "",
    isPremium: d?.isPremium ?? false,
    requiredPlan: d?.requiredPlan ?? "basic-monthly",
    allowDownload: d?.allowDownload ?? true,
    allowShare: d?.allowShare ?? true,
    watermark: d?.watermark ?? false,
    colour: d?.colour ?? "Gold",
    style: d?.style ?? "Traditional",
    material: d?.material ?? "Silk",
    occasion: d?.occasion ?? "Wedding",
    gender: d?.gender ?? "Women",
    tags: d?.tags ?? [],
    status: d?.status ?? "draft",
    isFeatured: d?.isFeatured ?? false,
    isTrending: d?.isTrending ?? false,
  });
  const [tagText, setTagText] = useState((d?.tags ?? []).join(", "));
  const [pending, start] = useTransition();
  const set = <K extends keyof DesignInput>(k: K, v: DesignInput[K]) => setF((p) => ({ ...p, [k]: v }));

  const subs = subcategories.filter((s) => s.categorySlug === f.categorySlug);
  const cols = collections.filter((c) => c.subcategorySlug === f.subcategorySlug);

  const submit = (status?: string) =>
    start(async () => {
      await saveDesign({
        ...f,
        status: status ?? f.status,
        thumb: f.thumb || f.image,
        tags: tagText.split(",").map((t) => t.trim()).filter(Boolean),
      });
      onClose();
    });

  return (
    <Drawer
      open wide onClose={onClose}
      title={isNew ? "Upload design" : `Edit ${f.code}`}
      sub="Metadata, access rules and translations"
      footer={
        <>
          <Btn variant="outline" onClick={onClose}>Cancel</Btn>
          <Btn variant="outline" disabled={pending} onClick={() => submit("draft")}>Save draft</Btn>
          <Btn variant="primary" disabled={pending || !f.title} onClick={() => submit("published")}>
            {pending ? "Saving…" : "Publish"}
          </Btn>
        </>
      }
    >
      <div className="grid gap-5 md:grid-cols-[200px_1fr]">
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={f.image} alt="" className="aspect-[3/4] w-full rounded-xl object-cover ring-1 ring-slate-200" />
          <div className="mt-2 rounded-lg border border-dashed border-slate-300 p-2.5 text-center">
            <I n="image" c="mx-auto h-4 w-4 text-slate-400" />
            <p className="mt-1 text-[10.5px] text-slate-500">Drop file or paste a URL below</p>
          </div>
          <div className="mt-3 space-y-2">
            <Field label="Original image URL" value={f.image} onChange={(v) => set("image", v)} />
            <Field label="Thumbnail URL" value={f.thumb} onChange={(v) => set("thumb", v)} hint="Auto-generated if blank" />
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Design code" value={f.code} onChange={(v) => set("code", v)} />
            <Select label="Status" value={f.status} onChange={(v) => set("status", v)} options={STATUSES.map((s) => ({ value: s, label: s }))} />
          </div>
          <Field label="Title (English)" value={f.title} onChange={(v) => set("title", v)} />
          <div className="grid grid-cols-2 gap-3">
            <Field label="शीर्षक (Hindi)" value={f.titleHi ?? ""} onChange={(v) => set("titleHi", v)} />
            <Field label="शीर्षक (Marathi)" value={f.titleMr ?? ""} onChange={(v) => set("titleMr", v)} />
          </div>
          <Area label="Description" value={f.description} onChange={(v) => set("description", v)} rows={3} />

          <div className="grid grid-cols-3 gap-3">
            <Select label="Category" value={f.categorySlug} onChange={(v) => { set("categorySlug", v); const s = subcategories.find((x) => x.categorySlug === v); if (s) set("subcategorySlug", s.slug); }} options={categories.map((c) => ({ value: c.slug, label: c.name }))} />
            <Select label="Subcategory" value={f.subcategorySlug} onChange={(v) => { set("subcategorySlug", v); const c = collections.find((x) => x.subcategorySlug === v); if (c) set("collectionSlug", c.slug); }} options={subs.map((s) => ({ value: s.slug, label: s.name }))} />
            <Select label="Collection" value={f.collectionSlug} onChange={(v) => set("collectionSlug", v)} options={cols.map((c) => ({ value: c.slug, label: c.name }))} />
          </div>

          <div>
            <p className="mb-2 text-[11.5px] font-semibold uppercase tracking-wide text-slate-500">Category attributes</p>
            <div className="grid grid-cols-3 gap-3">
              <Field label="Colour" value={f.colour} onChange={(v) => set("colour", v)} />
              <Field label="Style" value={f.style} onChange={(v) => set("style", v)} />
              <Field label="Material" value={f.material} onChange={(v) => set("material", v)} />
              <Field label="Occasion" value={f.occasion} onChange={(v) => set("occasion", v)} />
              <Select label="Gender" value={f.gender} onChange={(v) => set("gender", v)} options={["Women", "Men", "Unisex", "Kids"].map((g) => ({ value: g, label: g }))} />
              <Field label="Tags" value={tagText} onChange={setTagText} hint="Comma separated" />
            </div>
          </div>

          <div>
            <p className="mb-2 text-[11.5px] font-semibold uppercase tracking-wide text-slate-500">Access & protection</p>
            <div className="space-y-2">
              <Check label="Premium design" checked={f.isPremium} onChange={(v) => { set("isPremium", v); set("watermark", v); }} hint="Locked behind a subscription plan" />
              {f.isPremium ? (
                <Select label="Required plan" value={f.requiredPlan ?? "basic-monthly"} onChange={(v) => set("requiredPlan", v)} options={plans.map((p) => ({ value: p.code, label: p.name }))} />
              ) : null}
              <div className="grid grid-cols-2 gap-2">
                <Check label="Allow download" checked={f.allowDownload} onChange={(v) => set("allowDownload", v)} />
                <Check label="Allow sharing" checked={f.allowShare} onChange={(v) => set("allowShare", v)} />
                <Check label="Watermark preview" checked={f.watermark} onChange={(v) => set("watermark", v)} />
                <Check label="Feature on home" checked={f.isFeatured} onChange={(v) => set("isFeatured", v)} />
                <Check label="Mark as trending" checked={f.isTrending} onChange={(v) => set("isTrending", v)} />
              </div>
            </div>
          </div>

          {d ? (
            <div className="rounded-lg bg-slate-50 p-3 text-[11.5px] text-slate-600 ring-1 ring-inset ring-slate-200">
              <span className="font-semibold">Performance:</span> {nice(d.views)} views · {d.downloads} downloads · {d.shares} shares · {d.favourites} favourites
            </div>
          ) : null}
        </div>
      </div>
    </Drawer>
  );
}

export { ActionBtn };
