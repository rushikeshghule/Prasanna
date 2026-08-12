"use client";

import { useState, useTransition } from "react";
import {
  ActionBtn,
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
  Tabs,
  Td,
} from "./ui";
import {
  deleteCategory,
  saveCategory,
  saveCollection,
  saveSubcategory,
  toggleCategory,
  toggleCollectionFeatured,
} from "@/app/admin/actions";

type Cat = { id: number; slug: string; name: string; nameHi: string | null; nameMr: string | null; emoji: string; tagline: string | null; cover: string; accent: string; displayOrder: number; isFeatured: boolean; isActive: boolean; comingSoon: boolean; designCount: number };
type Sub = { id: number; slug: string; categorySlug: string; name: string; nameHi: string | null; nameMr: string | null; cover: string; displayOrder: number; isActive: boolean; designCount: number };
type Col = { id: number; slug: string; categorySlug: string; subcategorySlug: string; name: string; nameHi: string | null; nameMr: string | null; cover: string; blurb: string | null; isFeatured: boolean; displayOrder: number; designCount: number };

const slugify = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export function CatalogPanel({ categories, subcategories, collections }: { categories: Cat[]; subcategories: Sub[]; collections: Col[] }) {
  const [tab, setTab] = useState("categories");
  const [q, setQ] = useState("");
  const [editCat, setEditCat] = useState<Cat | "new" | null>(null);
  const [editSub, setEditSub] = useState<Sub | "new" | null>(null);
  const [editCol, setEditCol] = useState<Col | "new" | null>(null);

  const f = (s: string) => s.toLowerCase().includes(q.toLowerCase());

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="max-w-2xl text-[12.5px] text-slate-500">
          The hierarchy is <span className="font-medium text-slate-700">Category → Subcategory → Collection → Design</span>. Anything you add here shows up in the
          mobile app immediately — no new app release needed.
        </p>
        <div className="flex gap-2">
          <div className="w-56"><SearchBox value={q} onChange={setQ} placeholder="Search catalogue…" /></div>
          <Btn
            variant="dark"
            onClick={() => (tab === "categories" ? setEditCat("new") : tab === "subcategories" ? setEditSub("new") : setEditCol("new"))}
          >
            <I n="plus" c="h-3.5 w-3.5" /> New {tab === "categories" ? "category" : tab === "subcategories" ? "subcategory" : "collection"}
          </Btn>
        </div>
      </div>

      <Card>
        <Tabs
          value={tab}
          onChange={setTab}
          tabs={[
            { key: "categories", label: "Categories", count: categories.length },
            { key: "subcategories", label: "Subcategories", count: subcategories.length },
            { key: "collections", label: "Collections", count: collections.length },
          ]}
        />

        {tab === "categories" ? (
          <Table head={["Category", "Slug", "Designs", "Order", "Status", ""]}>
            {categories.filter((c) => f(c.name)).map((c) => (
              <tr key={c.id} className="hover:bg-slate-50">
                <Td>
                  <div className="flex items-center gap-2.5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={c.cover} alt="" className="h-9 w-9 rounded-lg object-cover ring-1 ring-slate-200" />
                    <div>
                      <p className="font-medium text-slate-800">{c.emoji} {c.name}</p>
                      <p className="text-[10.5px] text-slate-400">{c.nameHi ?? "—"} · {c.nameMr ?? "—"}</p>
                    </div>
                  </div>
                </Td>
                <Td className="font-mono text-[11.5px] text-slate-500">{c.slug}</Td>
                <Td>{c.designCount}</Td>
                <Td>{c.displayOrder}</Td>
                <Td>
                  <div className="flex flex-wrap gap-1">
                    <Pill tone={c.isActive ? "green" : "slate"}>{c.isActive ? "Active" : "Archived"}</Pill>
                    {c.isFeatured ? <Pill tone="amber">Featured</Pill> : null}
                    {c.comingSoon ? <Pill tone="blue">Coming soon</Pill> : null}
                  </div>
                </Td>
                <Td>
                  <div className="flex justify-end gap-1.5">
                    <ActionBtn action={() => toggleCategory(c.id, "isFeatured")} variant="ghost">★</ActionBtn>
                    <ActionBtn action={() => toggleCategory(c.id, "isActive")} variant="ghost">
                      <I n="eye" c="h-3.5 w-3.5" />
                    </ActionBtn>
                    <Btn size="sm" variant="outline" onClick={() => setEditCat(c)}><I n="edit" c="h-3.5 w-3.5" /></Btn>
                    <ActionBtn action={() => deleteCategory(c.id)} variant="danger" confirm={`Archive “${c.name}”? Designs stay in history.`}>
                      <I n="trash" c="h-3.5 w-3.5" />
                    </ActionBtn>
                  </div>
                </Td>
              </tr>
            ))}
          </Table>
        ) : null}

        {tab === "subcategories" ? (
          <Table head={["Subcategory", "Parent", "Slug", "Designs", "Status", ""]}>
            {subcategories.filter((s) => f(s.name)).map((s) => (
              <tr key={s.id} className="hover:bg-slate-50">
                <Td>
                  <div className="flex items-center gap-2.5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={s.cover} alt="" className="h-9 w-9 rounded-lg object-cover ring-1 ring-slate-200" />
                    <div>
                      <p className="font-medium text-slate-800">{s.name}</p>
                      <p className="text-[10.5px] text-slate-400">{s.nameHi ?? "—"}</p>
                    </div>
                  </div>
                </Td>
                <Td className="capitalize">{s.categorySlug}</Td>
                <Td className="font-mono text-[11.5px] text-slate-500">{s.slug}</Td>
                <Td>{s.designCount}</Td>
                <Td><Pill tone={s.isActive ? "green" : "slate"}>{s.isActive ? "Active" : "Hidden"}</Pill></Td>
                <Td>
                  <div className="flex justify-end">
                    <Btn size="sm" variant="outline" onClick={() => setEditSub(s)}><I n="edit" c="h-3.5 w-3.5" /> Edit</Btn>
                  </div>
                </Td>
              </tr>
            ))}
          </Table>
        ) : null}

        {tab === "collections" ? (
          <Table head={["Collection", "Path", "Designs", "Featured", ""]}>
            {collections.filter((c) => f(c.name)).map((c) => (
              <tr key={c.id} className="hover:bg-slate-50">
                <Td>
                  <div className="flex items-center gap-2.5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={c.cover} alt="" className="h-9 w-9 rounded-lg object-cover ring-1 ring-slate-200" />
                    <div className="min-w-0">
                      <p className="font-medium text-slate-800">{c.name}</p>
                      <p className="truncate text-[10.5px] text-slate-400">{c.blurb}</p>
                    </div>
                  </div>
                </Td>
                <Td className="text-[11.5px] capitalize text-slate-500">{c.categorySlug} › {c.subcategorySlug}</Td>
                <Td>{c.designCount}</Td>
                <Td>{c.isFeatured ? <Pill tone="amber">On home</Pill> : <Pill>—</Pill>}</Td>
                <Td>
                  <div className="flex justify-end gap-1.5">
                    <ActionBtn action={() => toggleCollectionFeatured(c.id)} variant="ghost">★</ActionBtn>
                    <Btn size="sm" variant="outline" onClick={() => setEditCol(c)}><I n="edit" c="h-3.5 w-3.5" /></Btn>
                  </div>
                </Td>
              </tr>
            ))}
          </Table>
        ) : null}
      </Card>

      {editCat ? <CategoryDrawer value={editCat} onClose={() => setEditCat(null)} /> : null}
      {editSub ? <SubDrawer value={editSub} categories={categories} onClose={() => setEditSub(null)} /> : null}
      {editCol ? <ColDrawer value={editCol} categories={categories} subcategories={subcategories} onClose={() => setEditCol(null)} /> : null}
    </div>
  );
}

function CategoryDrawer({ value, onClose }: { value: Cat | "new"; onClose: () => void }) {
  const isNew = value === "new";
  const c = isNew ? null : value;
  const [name, setName] = useState(c?.name ?? "");
  const [slug, setSlug] = useState(c?.slug ?? "");
  const [nameHi, setHi] = useState(c?.nameHi ?? "");
  const [nameMr, setMr] = useState(c?.nameMr ?? "");
  const [emoji, setEmoji] = useState(c?.emoji ?? "✨");
  const [tagline, setTagline] = useState(c?.tagline ?? "");
  const [cover, setCover] = useState(c?.cover ?? "https://images.pexels.com/photos/35108809/pexels-photo-35108809.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=800&h=800");
  const [accent, setAccent] = useState(c?.accent ?? "#E9C46A");
  const [order, setOrder] = useState(String(c?.displayOrder ?? 4));
  const [featured, setFeatured] = useState(c?.isFeatured ?? false);
  const [active, setActive] = useState(c?.isActive ?? true);
  const [soon, setSoon] = useState(c?.comingSoon ?? false);
  const [pending, start] = useTransition();

  const submit = () =>
    start(async () => {
      await saveCategory({
        id: c?.id,
        slug: slug || slugify(name),
        name, nameHi, nameMr, emoji, tagline, cover, accent,
        displayOrder: Number(order) || 0,
        isFeatured: featured, isActive: active, comingSoon: soon,
      });
      onClose();
    });

  return (
    <Drawer
      open
      onClose={onClose}
      title={isNew ? "New category" : `Edit ${c?.name}`}
      sub="Appears on the app home screen and Explore tab"
      footer={
        <>
          <Btn variant="outline" onClick={onClose}>Cancel</Btn>
          <Btn variant="primary" onClick={submit} disabled={pending || !name}>{pending ? "Saving…" : "Save category"}</Btn>
        </>
      }
    >
      <div className="space-y-4">
        <div className="flex gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={cover} alt="" className="h-20 w-20 rounded-xl object-cover ring-1 ring-slate-200" />
          <div className="flex-1"><Field label="Cover image URL" value={cover} onChange={setCover} /></div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Name (English)" value={name} onChange={(v) => { setName(v); if (isNew) setSlug(slugify(v)); }} />
          <Field label="Slug" value={slug} onChange={setSlug} hint="Used in deep links" />
          <Field label="नाम (Hindi)" value={nameHi} onChange={setHi} />
          <Field label="नाव (Marathi)" value={nameMr} onChange={setMr} />
          <Field label="Emoji / icon" value={emoji} onChange={setEmoji} />
          <Field label="Accent colour" value={accent} onChange={setAccent} hint="Ring colour on home" />
        </div>
        <Field label="Tagline" value={tagline} onChange={setTagline} />
        <Field label="Display order" value={order} onChange={setOrder} type="number" />
        <div className="space-y-2">
          <Check label="Active" checked={active} onChange={setActive} hint="Inactive categories are hidden from users" />
          <Check label="Featured on home" checked={featured} onChange={setFeatured} />
          <Check label="Coming soon badge" checked={soon} onChange={setSoon} hint="Visible but not tappable" />
        </div>
      </div>
    </Drawer>
  );
}

function SubDrawer({ value, categories, onClose }: { value: Sub | "new"; categories: Cat[]; onClose: () => void }) {
  const isNew = value === "new";
  const s = isNew ? null : value;
  const [name, setName] = useState(s?.name ?? "");
  const [slug, setSlug] = useState(s?.slug ?? "");
  const [cat, setCat] = useState(s?.categorySlug ?? categories[0]?.slug ?? "");
  const [nameHi, setHi] = useState(s?.nameHi ?? "");
  const [nameMr, setMr] = useState(s?.nameMr ?? "");
  const [cover, setCover] = useState(s?.cover ?? "https://images.pexels.com/photos/28943474/pexels-photo-28943474.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=420&h=630");
  const [order, setOrder] = useState(String(s?.displayOrder ?? 6));
  const [active, setActive] = useState(s?.isActive ?? true);
  const [pending, start] = useTransition();

  return (
    <Drawer
      open onClose={onClose}
      title={isNew ? "New subcategory" : `Edit ${s?.name}`}
      footer={
        <>
          <Btn variant="outline" onClick={onClose}>Cancel</Btn>
          <Btn variant="primary" disabled={pending || !name} onClick={() => start(async () => { await saveSubcategory({ id: s?.id, slug: slug || slugify(name), categorySlug: cat, name, nameHi, nameMr, cover, displayOrder: Number(order) || 0, isActive: active }); onClose(); })}>
            {pending ? "Saving…" : "Save"}
          </Btn>
        </>
      }
    >
      <div className="space-y-4">
        <div className="flex gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={cover} alt="" className="h-20 w-20 rounded-xl object-cover ring-1 ring-slate-200" />
          <div className="flex-1"><Field label="Cover image URL" value={cover} onChange={setCover} /></div>
        </div>
        <Select label="Parent category" value={cat} onChange={setCat} options={categories.map((c) => ({ value: c.slug, label: c.name }))} />
        <div className="grid grid-cols-2 gap-3">
          <Field label="Name (English)" value={name} onChange={(v) => { setName(v); if (isNew) setSlug(slugify(v)); }} />
          <Field label="Slug" value={slug} onChange={setSlug} />
          <Field label="नाम (Hindi)" value={nameHi} onChange={setHi} />
          <Field label="नाव (Marathi)" value={nameMr} onChange={setMr} />
        </div>
        <Field label="Display order" value={order} onChange={setOrder} type="number" />
        <Check label="Active" checked={active} onChange={setActive} />
      </div>
    </Drawer>
  );
}

function ColDrawer({ value, categories, subcategories, onClose }: { value: Col | "new"; categories: Cat[]; subcategories: Sub[]; onClose: () => void }) {
  const isNew = value === "new";
  const c = isNew ? null : value;
  const [name, setName] = useState(c?.name ?? "");
  const [slug, setSlug] = useState(c?.slug ?? "");
  const [cat, setCat] = useState(c?.categorySlug ?? categories[0]?.slug ?? "");
  const [sub, setSub] = useState(c?.subcategorySlug ?? subcategories[0]?.slug ?? "");
  const [nameHi, setHi] = useState(c?.nameHi ?? "");
  const [nameMr, setMr] = useState(c?.nameMr ?? "");
  const [blurb, setBlurb] = useState(c?.blurb ?? "");
  const [cover, setCover] = useState(c?.cover ?? "https://images.pexels.com/photos/33101418/pexels-photo-33101418.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=420&h=630");
  const [featured, setFeatured] = useState(c?.isFeatured ?? false);
  const [order, setOrder] = useState(String(c?.displayOrder ?? 3));
  const [pending, start] = useTransition();
  const subs = subcategories.filter((s) => s.categorySlug === cat);

  return (
    <Drawer
      open onClose={onClose}
      title={isNew ? "New collection" : `Edit ${c?.name}`}
      footer={
        <>
          <Btn variant="outline" onClick={onClose}>Cancel</Btn>
          <Btn variant="primary" disabled={pending || !name} onClick={() => start(async () => { await saveCollection({ id: c?.id, slug: slug || slugify(name), categorySlug: cat, subcategorySlug: sub, name, nameHi, nameMr, cover, blurb, isFeatured: featured, displayOrder: Number(order) || 0 }); onClose(); })}>
            {pending ? "Saving…" : "Save"}
          </Btn>
        </>
      }
    >
      <div className="space-y-4">
        <div className="flex gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={cover} alt="" className="h-20 w-20 rounded-xl object-cover ring-1 ring-slate-200" />
          <div className="flex-1"><Field label="Cover image URL" value={cover} onChange={setCover} /></div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Select label="Category" value={cat} onChange={(v) => { setCat(v); const first = subcategories.find((s) => s.categorySlug === v); if (first) setSub(first.slug); }} options={categories.map((x) => ({ value: x.slug, label: x.name }))} />
          <Select label="Subcategory" value={sub} onChange={setSub} options={subs.map((x) => ({ value: x.slug, label: x.name }))} />
          <Field label="Name (English)" value={name} onChange={(v) => { setName(v); if (isNew) setSlug(slugify(v)); }} />
          <Field label="Slug" value={slug} onChange={setSlug} />
          <Field label="नाम (Hindi)" value={nameHi} onChange={setHi} />
          <Field label="नाव (Marathi)" value={nameMr} onChange={setMr} />
        </div>
        <Field label="Short blurb" value={blurb} onChange={setBlurb} />
        <Field label="Display order" value={order} onChange={setOrder} type="number" />
        <Check label="Feature on home screen" checked={featured} onChange={setFeatured} />
      </div>
    </Drawer>
  );
}

export function EmptyCatalog() {
  return <Empty title="Nothing here yet" sub="Create your first category to get started." icon="layers" />;
}
