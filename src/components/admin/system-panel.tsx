"use client";

import { useState, useTransition } from "react";
import {
  ActionBtn, Area, Bar, Btn, Card, CardHead, Check, Drawer, Empty, Field, I, Pill, Select, Stat,
  Table, Tabs, Td, nice, statusTone, when, whenTime,
} from "./ui";
import {
  clearReports, closeTicket, deleteBanner, deleteCampaign, deleteFaq, moveSection, resolveReport,
  saveBanner, saveFaq, saveLanguage, saveLegal, saveSettings, saveTranslation, sendCampaign,
  setDefaultLanguage, toggleBanner, toggleLanguage, updateSection,
} from "@/app/admin/actions";

/* ----------------------------- appearance ----------------------------- */

type B = { id: number; title: string; titleHi: string | null; subtitle: string; image: string; cta: string; target: string; tone: string; displayOrder: number; isActive: boolean };
type S = { id: number; key: string; title: string; subtitle: string | null; layout: string; displayOrder: number; isVisible: boolean };

export function AppearancePanel({ banners, sections, categories, collections }: { banners: B[]; sections: S[]; categories: { slug: string; name: string }[]; collections: { slug: string; name: string }[] }) {
  const [tab, setTab] = useState("banners");
  const [edit, setEdit] = useState<B | "new" | null>(null);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="max-w-2xl text-[12.5px] text-slate-500">Control what the home screen shows and in what order. Changes are live in the app instantly.</p>
        {tab === "banners" ? <Btn variant="dark" onClick={() => setEdit("new")}><I n="plus" c="h-3.5 w-3.5" /> New banner</Btn> : null}
      </div>

      <Card>
        <Tabs value={tab} onChange={setTab} tabs={[{ key: "banners", label: "Promotional banners", count: banners.length }, { key: "sections", label: "Home sections", count: sections.length }]} />

        {tab === "banners" ? (
          <div className="grid gap-4 p-4 md:grid-cols-2 xl:grid-cols-3">
            {banners.map((b) => (
              <Card key={b.id} className="overflow-hidden">
                <div className="relative h-28">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={b.image} alt="" className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-900/85 to-transparent" />
                  <div className="absolute inset-y-0 left-0 flex w-3/4 flex-col justify-center p-3.5">
                    <p className="text-[13px] font-semibold text-white">{b.title}</p>
                    <p className="mt-0.5 text-[10.5px] text-white/70">{b.subtitle}</p>
                    <span className="mt-1.5 w-fit rounded-full bg-amber-400 px-2 py-0.5 text-[9.5px] font-bold text-slate-900">{b.cta}</span>
                  </div>
                  <span className="absolute right-2 top-2"><Pill tone={b.isActive ? "green" : "slate"}>{b.isActive ? "Live" : "Paused"}</Pill></span>
                </div>
                <div className="flex items-center justify-between p-3">
                  <span className="font-mono text-[10.5px] text-slate-400">{b.target}</span>
                  <div className="flex gap-1.5">
                    <ActionBtn action={() => toggleBanner(b.id)} variant="ghost"><I n="eye" c="h-3.5 w-3.5" /></ActionBtn>
                    <Btn size="sm" variant="outline" onClick={() => setEdit(b)}><I n="edit" c="h-3.5 w-3.5" /></Btn>
                    <ActionBtn action={() => deleteBanner(b.id)} variant="danger" confirm="Delete this banner?"><I n="trash" c="h-3.5 w-3.5" /></ActionBtn>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Table head={["Order", "Section", "Layout", "Visible", ""]}>
            {sections.map((s, i) => (
              <tr key={s.key} className="hover:bg-slate-50">
                <Td>
                  <div className="flex items-center gap-1">
                    <ActionBtn action={() => moveSection(s.key, -1)} variant="ghost"><I n="up" c="h-3.5 w-3.5" /></ActionBtn>
                    <span className="w-5 text-center text-[11.5px] text-slate-500">{i + 1}</span>
                    <ActionBtn action={() => moveSection(s.key, 1)} variant="ghost"><I n="down" c="h-3.5 w-3.5" /></ActionBtn>
                  </div>
                </Td>
                <Td><SectionTitle section={s} /></Td>
                <Td><Pill tone="blue">{s.layout}</Pill></Td>
                <Td><Pill tone={s.isVisible ? "green" : "slate"}>{s.isVisible ? "Shown" : "Hidden"}</Pill></Td>
                <Td>
                  <div className="flex justify-end">
                    <ActionBtn action={() => updateSection(s.key, { isVisible: !s.isVisible })} variant="outline">{s.isVisible ? "Hide" : "Show"}</ActionBtn>
                  </div>
                </Td>
              </tr>
            ))}
          </Table>
        )}
      </Card>

      {edit ? <BannerDrawer value={edit} categories={categories} collections={collections} onClose={() => setEdit(null)} /> : null}
    </div>
  );
}

function SectionTitle({ section }: { section: S }) {
  const [title, setTitle] = useState(section.title);
  const [pending, start] = useTransition();
  const dirty = title !== section.title;
  return (
    <div className="flex items-center gap-2">
      <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-56 rounded-md border border-transparent px-2 py-1 text-[12.5px] font-medium text-slate-800 outline-none hover:border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-100" />
      {dirty ? <Btn size="sm" variant="primary" disabled={pending} onClick={() => start(async () => void (await updateSection(section.key, { title })))}>Save</Btn> : <span className="font-mono text-[10px] text-slate-400">{section.key}</span>}
    </div>
  );
}

function BannerDrawer({ value, categories, collections, onClose }: { value: B | "new"; categories: { slug: string; name: string }[]; collections: { slug: string; name: string }[]; onClose: () => void }) {
  const isNew = value === "new";
  const b = isNew ? null : value;
  const [f, setF] = useState({
    title: b?.title ?? "", titleHi: b?.titleHi ?? "", subtitle: b?.subtitle ?? "",
    image: b?.image ?? "https://images.pexels.com/photos/33101418/pexels-photo-33101418.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=900&h=600",
    cta: b?.cta ?? "Explore now", target: b?.target ?? "screen:plans", tone: b?.tone ?? "gold", displayOrder: String(b?.displayOrder ?? 4),
  });
  const [active, setActive] = useState(b?.isActive ?? true);
  const [pending, start] = useTransition();
  const s = (k: keyof typeof f, v: string) => setF((x) => ({ ...x, [k]: v }));

  const targets = [
    { value: "screen:plans", label: "Subscription plans screen" },
    ...categories.map((c) => ({ value: `category:${c.slug}`, label: `Category · ${c.name}` })),
    ...collections.map((c) => ({ value: `collection:${c.slug}`, label: `Collection · ${c.name}` })),
  ];

  return (
    <Drawer open onClose={onClose} title={isNew ? "New banner" : "Edit banner"} sub="Shown at the top of the app home screen"
      footer={<>
        <Btn variant="outline" onClick={onClose}>Cancel</Btn>
        <Btn variant="primary" disabled={pending || !f.title} onClick={() => start(async () => { await saveBanner({ id: b?.id, ...f, displayOrder: Number(f.displayOrder) || 0, isActive: active }); onClose(); })}>{pending ? "Saving…" : "Save banner"}</Btn>
      </>}>
      <div className="space-y-4">
        <div className="relative h-32 overflow-hidden rounded-xl ring-1 ring-slate-200">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={f.image} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/85 to-transparent" />
          <div className="absolute inset-y-0 left-0 flex w-3/4 flex-col justify-center p-4">
            <p className="text-[15px] font-semibold text-white">{f.title || "Banner title"}</p>
            <p className="mt-0.5 text-[11px] text-white/70">{f.subtitle}</p>
            <span className="mt-1.5 w-fit rounded-full bg-amber-400 px-2.5 py-1 text-[10px] font-bold text-slate-900">{f.cta}</span>
          </div>
        </div>
        <Field label="Image URL" value={f.image} onChange={(v) => s("image", v)} />
        <div className="grid grid-cols-2 gap-3">
          <Field label="Title (English)" value={f.title} onChange={(v) => s("title", v)} />
          <Field label="शीर्षक (Hindi)" value={f.titleHi} onChange={(v) => s("titleHi", v)} />
        </div>
        <Field label="Subtitle" value={f.subtitle} onChange={(v) => s("subtitle", v)} />
        <div className="grid grid-cols-2 gap-3">
          <Field label="Button label" value={f.cta} onChange={(v) => s("cta", v)} />
          <Select label="Colour tone" value={f.tone} onChange={(v) => s("tone", v)} options={["gold", "plum", "rose"].map((x) => ({ value: x, label: x }))} />
        </div>
        <Select label="Destination when tapped" value={f.target} onChange={(v) => s("target", v)} options={targets} />
        <Field label="Display order" value={f.displayOrder} onChange={(v) => s("displayOrder", v)} type="number" />
        <Check label="Banner is live" checked={active} onChange={setActive} />
      </div>
    </Drawer>
  );
}

/* ----------------------------- localization ----------------------------- */

type L = { id: number; code: string; name: string; nativeName: string; isDefault: boolean; isActive: boolean; completion: number };

export function LocalizationPanel({
  languages, missing, totalStrings, categories, collections,
}: {
  languages: L[]; missing: { hi: number; mr: number }; totalStrings: number;
  categories: { slug: string; name: string; nameHi: string | null; nameMr: string | null }[];
  collections: { slug: string; name: string; nameHi: string | null; nameMr: string | null }[];
}) {
  const [edit, setEdit] = useState<L | "new" | null>(null);
  const items = [...categories.map((c) => ({ ...c, kind: "category" as const })), ...collections.map((c) => ({ ...c, kind: "collection" as const }))];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Languages" value={languages.length} sub={`${languages.filter((l) => l.isActive).length} active`} icon="globe" tone="blue" />
        <Stat label="Translatable records" value={totalStrings} icon="doc" />
        <Stat label="Missing Hindi" value={missing.hi} icon="flag" tone={missing.hi ? "amber" : "green"} />
        <Stat label="Missing Marathi" value={missing.mr} icon="flag" tone={missing.mr ? "amber" : "green"} />
      </div>

      <div className="flex justify-end"><Btn variant="dark" onClick={() => setEdit("new")}><I n="plus" c="h-3.5 w-3.5" /> Add language</Btn></div>

      <Card>
        <CardHead title="Languages" sub="Falls back to the default language when a translation is missing" />
        <Table head={["Language", "Code", "Completion", "Status", ""]}>
          {languages.map((l) => (
            <tr key={l.id} className="hover:bg-slate-50">
              <Td><p className="font-medium text-slate-800">{l.nativeName}</p><p className="text-[10.5px] text-slate-400">{l.name}</p></Td>
              <Td className="font-mono text-[11.5px] uppercase">{l.code}</Td>
              <Td><div className="w-32"><Bar value={l.completion} max={100} tone={l.completion > 90 ? "green" : "amber"} /><p className="mt-1 text-[10.5px] text-slate-500">{l.completion}%</p></div></Td>
              <Td><div className="flex gap-1">{l.isDefault ? <Pill tone="violet">Default</Pill> : null}<Pill tone={l.isActive ? "green" : "slate"}>{l.isActive ? "Active" : "Off"}</Pill></div></Td>
              <Td>
                <div className="flex justify-end gap-1.5">
                  {!l.isDefault ? <ActionBtn action={() => setDefaultLanguage(l.id)} variant="outline">Make default</ActionBtn> : null}
                  {!l.isDefault ? <ActionBtn action={() => toggleLanguage(l.id)} variant="ghost"><I n="eye" c="h-3.5 w-3.5" /></ActionBtn> : null}
                  <Btn size="sm" variant="outline" onClick={() => setEdit(l)}><I n="edit" c="h-3.5 w-3.5" /></Btn>
                </div>
              </Td>
            </tr>
          ))}
        </Table>
      </Card>

      <Card>
        <CardHead title="Translation editor" sub="Category and collection names shown inside the app" />
        <Table head={["Record", "Type", "हिन्दी", "मराठी", ""]}>
          {items.map((it) => <TranslationRow key={`${it.kind}-${it.slug}`} item={it} />)}
        </Table>
      </Card>

      {edit ? <LanguageDrawer value={edit} onClose={() => setEdit(null)} /> : null}
    </div>
  );
}

function TranslationRow({ item }: { item: { kind: "category" | "collection"; slug: string; name: string; nameHi: string | null; nameMr: string | null } }) {
  const [hi, setHi] = useState(item.nameHi ?? "");
  const [mr, setMr] = useState(item.nameMr ?? "");
  const [pending, start] = useTransition();
  const dirty = hi !== (item.nameHi ?? "") || mr !== (item.nameMr ?? "");
  const inp = "w-full rounded-md border border-transparent px-2 py-1 text-[12.5px] outline-none hover:border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-100";
  return (
    <tr className="hover:bg-slate-50">
      <Td className="font-medium text-slate-800">{item.name}</Td>
      <Td><Pill tone={item.kind === "category" ? "violet" : "blue"}>{item.kind}</Pill></Td>
      <Td><input value={hi} onChange={(e) => setHi(e.target.value)} placeholder="—" className={inp} /></Td>
      <Td><input value={mr} onChange={(e) => setMr(e.target.value)} placeholder="—" className={inp} /></Td>
      <Td><div className="flex justify-end">{dirty ? <Btn size="sm" variant="primary" disabled={pending} onClick={() => start(async () => void (await saveTranslation(item.kind, item.slug, hi, mr)))}>Save</Btn> : <span className="text-[10.5px] text-slate-300">saved</span>}</div></Td>
    </tr>
  );
}

function LanguageDrawer({ value, onClose }: { value: L | "new"; onClose: () => void }) {
  const isNew = value === "new";
  const l = isNew ? null : value;
  const [code, setCode] = useState(l?.code ?? "");
  const [name, setName] = useState(l?.name ?? "");
  const [native, setNative] = useState(l?.nativeName ?? "");
  const [completion, setCompletion] = useState(String(l?.completion ?? 0));
  const [active, setActive] = useState(l?.isActive ?? true);
  const [pending, start] = useTransition();
  return (
    <Drawer open onClose={onClose} title={isNew ? "Add language" : `Edit ${l?.name}`} sub="Users pick this during onboarding"
      footer={<><Btn variant="outline" onClick={onClose}>Cancel</Btn>
        <Btn variant="primary" disabled={pending || !code || !name} onClick={() => start(async () => { await saveLanguage({ id: l?.id, code, name, nativeName: native || name, completion: Number(completion) || 0, isActive: active }); onClose(); })}>{pending ? "Saving…" : "Save"}</Btn></>}>
      <div className="space-y-3">
        <Field label="ISO code" value={code} onChange={setCode} hint="e.g. gu, ta, kn" />
        <Field label="English name" value={name} onChange={setName} />
        <Field label="Native name" value={native} onChange={setNative} hint="e.g. ગુજરાતી" />
        <Field label="Translation completion %" value={completion} onChange={setCompletion} type="number" />
        <Check label="Active in app" checked={active} onChange={setActive} />
      </div>
    </Drawer>
  );
}

/* ----------------------------- notifications ----------------------------- */

type C = { id: number; title: string; body: string; audience: string; language: string; image: string | null; target: string | null; status: string; scheduledAt: string | null; sentCount: number; openCount: number; clickCount: number; createdAt: string };

export function NotificationsPanel({ campaigns, audienceSizes, collections }: { campaigns: C[]; audienceSizes: Record<string, number>; collections: { slug: string; name: string }[] }) {
  const [f, setF] = useState({ title: "", body: "", audience: "all", language: "all", image: "", target: "", schedule: "" });
  const [pending, start] = useTransition();
  const s = (k: keyof typeof f, v: string) => setF((x) => ({ ...x, [k]: v }));
  const reach = audienceSizes[f.audience] ?? 0;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Campaigns sent" value={campaigns.filter((c) => c.status === "sent").length} icon="send" tone="green" />
        <Stat label="Scheduled" value={campaigns.filter((c) => c.status === "scheduled").length} icon="clock" tone="amber" />
        <Stat label="Total delivered" value={nice(campaigns.reduce((a, b) => a + b.sentCount, 0))} icon="bell" tone="blue" />
        <Stat label="Avg. open rate" value={`${Math.round((campaigns.reduce((a, b) => a + b.openCount, 0) / Math.max(1, campaigns.reduce((a, b) => a + b.sentCount, 0))) * 100)}%`} icon="eye" tone="violet" />
      </div>

      <div className="grid gap-4 lg:grid-cols-[380px_1fr]">
        <Card>
          <CardHead title="Compose notification" sub={`Reaches ${reach} user${reach === 1 ? "" : "s"}`} />
          <div className="space-y-3 p-4">
            <Field label="Title" value={f.title} onChange={(v) => s("title", v)} />
            <Area label="Message" value={f.body} onChange={(v) => s("body", v)} rows={3} />
            <Select label="Audience" value={f.audience} onChange={(v) => s("audience", v)} options={[
              { value: "all", label: `All users (${audienceSizes.all})` },
              { value: "premium", label: `Premium subscribers (${audienceSizes.premium})` },
              { value: "free", label: `Free users (${audienceSizes.free})` },
              { value: "expired", label: `Expired subscriptions (${audienceSizes.expired})` },
            ]} />
            <Select label="Language" value={f.language} onChange={(v) => s("language", v)} options={[
              { value: "all", label: "All languages" }, { value: "en", label: "English only" }, { value: "hi", label: "Hindi only" }, { value: "mr", label: "Marathi only" },
            ]} />
            <Field label="Image URL (optional)" value={f.image} onChange={(v) => s("image", v)} />
            <Select label="Deep link (optional)" value={f.target} onChange={(v) => s("target", v)} options={[
              { value: "", label: "No destination" }, { value: "screen:plans", label: "Subscription plans" },
              ...collections.map((c) => ({ value: `collection:${c.slug}`, label: `Collection · ${c.name}` })),
            ]} />
            <Field label="Schedule for later" value={f.schedule} onChange={(v) => s("schedule", v)} type="datetime-local" hint="Leave blank to send now" />

            <div className="rounded-xl bg-slate-900 p-3">
              <p className="mb-1.5 text-[10px] uppercase tracking-wider text-white/40">Preview</p>
              <div className="flex gap-2.5 rounded-lg bg-white/10 p-2.5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-400/20 text-amber-300"><I n="bell" c="h-4 w-4" /></span>
                <div className="min-w-0">
                  <p className="truncate text-[12px] font-semibold text-white">{f.title || "Notification title"}</p>
                  <p className="line-clamp-2 text-[10.5px] text-white/60">{f.body || "Your message appears here."}</p>
                </div>
              </div>
            </div>

            <Btn variant="primary" className="w-full" disabled={pending || !f.title || !f.body}
              onClick={() => start(async () => { await sendCampaign(f); setF({ title: "", body: "", audience: "all", language: "all", image: "", target: "", schedule: "" }); })}>
              <I n="send" c="h-3.5 w-3.5" /> {pending ? "Sending…" : f.schedule ? "Schedule notification" : `Send to ${reach} users`}
            </Btn>
          </div>
        </Card>

        <Card>
          <CardHead title="Campaign history" sub="Delivery and engagement statistics" />
          {campaigns.length === 0 ? <Empty title="No campaigns yet" icon="bell" /> : (
            <Table head={["Campaign", "Audience", "Delivered", "Opens", "Clicks", "Status", ""]}>
              {campaigns.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50">
                  <Td><p className="font-medium text-slate-800">{c.title}</p><p className="line-clamp-1 text-[10.5px] text-slate-400">{c.body}</p></Td>
                  <Td className="capitalize">{c.audience}</Td>
                  <Td>{c.sentCount}</Td>
                  <Td>{c.openCount ? `${c.openCount} (${Math.round((c.openCount / c.sentCount) * 100)}%)` : "—"}</Td>
                  <Td>{c.clickCount || "—"}</Td>
                  <Td><Pill tone={statusTone(c.status)}>{c.status}</Pill>{c.scheduledAt ? <p className="mt-1 text-[10px] text-slate-400">{whenTime(c.scheduledAt)}</p> : null}</Td>
                  <Td><div className="flex justify-end"><ActionBtn action={() => deleteCampaign(c.id)} variant="danger" confirm="Delete campaign?"><I n="trash" c="h-3.5 w-3.5" /></ActionBtn></div></Td>
                </tr>
              ))}
            </Table>
          )}
        </Card>
      </div>
    </div>
  );
}

/* ----------------------------- content & support ----------------------------- */

type Faq = { id: number; question: string; answer: string; topic: string; displayOrder: number };
type Legal = { slug: string; title: string; body: string[]; updatedAt: string };
type Rep = { id: number; designCode: string; designTitle: string; reason: string; note: string | null; status: string; createdAt: string };
type Tick = { id: number; subject: string; message: string; status: string; createdAt: string };

export function ContentPanel({ faqs, legal, settings, reports, tickets, initialTab }: { faqs: Faq[]; legal: Legal[]; settings: { key: string; value: string }[]; reports: Rep[]; tickets: Tick[]; initialTab?: string }) {
  const [tab, setTab] = useState(initialTab ?? "faqs");
  const [edit, setEdit] = useState<Faq | "new" | null>(null);
  const openReports = reports.filter((r) => r.status === "open");

  return (
    <div className="space-y-4">
      <Card>
        <Tabs value={tab} onChange={setTab} tabs={[
          { key: "faqs", label: "FAQs", count: faqs.length },
          { key: "legal", label: "Legal pages", count: legal.length },
          { key: "settings", label: "App settings" },
          { key: "reports", label: "Reported designs", count: openReports.length },
          { key: "tickets", label: "Support tickets", count: tickets.filter((t) => t.status === "open").length },
        ]} />

        {tab === "faqs" ? (
          <>
            <div className="flex justify-end p-3"><Btn variant="dark" onClick={() => setEdit("new")}><I n="plus" c="h-3.5 w-3.5" /> New FAQ</Btn></div>
            <Table head={["Question", "Topic", "Order", ""]}>
              {faqs.map((f) => (
                <tr key={f.id} className="hover:bg-slate-50">
                  <Td><p className="font-medium text-slate-800">{f.question}</p><p className="line-clamp-1 text-[10.5px] text-slate-400">{f.answer}</p></Td>
                  <Td><Pill tone="blue">{f.topic}</Pill></Td>
                  <Td>{f.displayOrder}</Td>
                  <Td><div className="flex justify-end gap-1.5">
                    <Btn size="sm" variant="outline" onClick={() => setEdit(f)}><I n="edit" c="h-3.5 w-3.5" /></Btn>
                    <ActionBtn action={() => deleteFaq(f.id)} variant="danger" confirm="Delete this FAQ?"><I n="trash" c="h-3.5 w-3.5" /></ActionBtn>
                  </div></Td>
                </tr>
              ))}
            </Table>
          </>
        ) : null}

        {tab === "legal" ? <div className="space-y-4 p-4">{legal.map((l) => <LegalEditor key={l.slug} page={l} />)}</div> : null}
        {tab === "settings" ? <SettingsEditor settings={settings} /> : null}

        {tab === "reports" ? (
          <>
            <div className="flex justify-end p-3">{openReports.length > 0 ? <ActionBtn action={clearReports} variant="outline" size="md" confirm="Dismiss all open reports?">Dismiss all</ActionBtn> : null}</div>
            {reports.length === 0 ? <Empty title="No reports" sub="Users have not reported any design." icon="flag" /> : (
              <Table head={["Design", "Reason", "Note", "When", "Status", ""]}>
                {reports.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50">
                    <Td><p className="font-medium text-slate-800">{r.designTitle}</p><p className="font-mono text-[10.5px] text-slate-400">{r.designCode}</p></Td>
                    <Td>{r.reason}</Td>
                    <Td className="max-w-[220px] truncate text-slate-500">{r.note || "—"}</Td>
                    <Td className="text-[11.5px] text-slate-500">{whenTime(r.createdAt)}</Td>
                    <Td><Pill tone={statusTone(r.status)}>{r.status}</Pill></Td>
                    <Td><div className="flex justify-end gap-1.5">
                      {r.status === "open" ? <>
                        <ActionBtn action={() => resolveReport(r.id, "unpublish")} variant="danger" confirm="Unpublish this design?">Unpublish</ActionBtn>
                        <ActionBtn action={() => resolveReport(r.id, "dismissed")} variant="outline">Dismiss</ActionBtn>
                      </> : null}
                    </div></Td>
                  </tr>
                ))}
              </Table>
            )}
          </>
        ) : null}

        {tab === "tickets" ? (
          tickets.length === 0 ? <Empty title="No support tickets" icon="mail" /> : (
            <Table head={["Subject", "Message", "When", "Status", ""]}>
              {tickets.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50">
                  <Td className="font-medium text-slate-800">{t.subject}</Td>
                  <Td className="max-w-[320px] truncate text-slate-500">{t.message}</Td>
                  <Td className="text-[11.5px] text-slate-500">{whenTime(t.createdAt)}</Td>
                  <Td><Pill tone={statusTone(t.status)}>{t.status}</Pill></Td>
                  <Td><div className="flex justify-end">{t.status === "open" ? <ActionBtn action={() => closeTicket(t.id)} variant="outline">Close</ActionBtn> : null}</div></Td>
                </tr>
              ))}
            </Table>
          )
        ) : null}
      </Card>

      {edit ? <FaqDrawer value={edit} onClose={() => setEdit(null)} /> : null}
    </div>
  );
}

function FaqDrawer({ value, onClose }: { value: Faq | "new"; onClose: () => void }) {
  const isNew = value === "new";
  const f = isNew ? null : value;
  const [question, setQ] = useState(f?.question ?? "");
  const [answer, setA] = useState(f?.answer ?? "");
  const [topic, setT] = useState(f?.topic ?? "General");
  const [order, setO] = useState(String(f?.displayOrder ?? 9));
  const [pending, start] = useTransition();
  return (
    <Drawer open onClose={onClose} title={isNew ? "New FAQ" : "Edit FAQ"}
      footer={<><Btn variant="outline" onClick={onClose}>Cancel</Btn>
        <Btn variant="primary" disabled={pending || !question} onClick={() => start(async () => { await saveFaq({ id: f?.id, question, answer, topic, displayOrder: Number(order) || 0 }); onClose(); })}>{pending ? "Saving…" : "Save"}</Btn></>}>
      <div className="space-y-3">
        <Field label="Question" value={question} onChange={setQ} />
        <Area label="Answer" value={answer} onChange={setA} rows={5} />
        <Select label="Topic" value={topic} onChange={setT} options={["General", "Subscription", "Designs", "Payments", "Account"].map((x) => ({ value: x, label: x }))} />
        <Field label="Display order" value={order} onChange={setO} type="number" />
      </div>
    </Drawer>
  );
}

function LegalEditor({ page }: { page: Legal }) {
  const [title, setTitle] = useState(page.title);
  const [body, setBody] = useState(page.body.join("\n"));
  const [open, setOpen] = useState(false);
  const [pending, start] = useTransition();
  const dirty = title !== page.title || body !== page.body.join("\n");
  return (
    <Card className="p-4">
      <button type="button" onClick={() => setOpen((o) => !o)} className="flex w-full items-center gap-3 text-left">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-500"><I n="doc" c="h-4 w-4" /></span>
        <span className="flex-1">
          <span className="block text-[13px] font-semibold text-slate-800">{page.title}</span>
          <span className="block text-[10.5px] text-slate-400">/{page.slug} · updated {when(page.updatedAt)} · {page.body.length} paragraphs</span>
        </span>
        {dirty ? <Pill tone="amber">unsaved</Pill> : null}
        <I n={open ? "up" : "down"} c="h-4 w-4 text-slate-400" />
      </button>
      {open ? (
        <div className="mt-4 space-y-3 border-t border-slate-100 pt-4">
          <Field label="Page title" value={title} onChange={setTitle} />
          <Area label="Body (one paragraph per line)" value={body} onChange={setBody} rows={8} />
          <div className="flex justify-end">
            <Btn variant="primary" disabled={pending || !dirty} onClick={() => start(async () => void (await saveLegal(page.slug, title, body)))}>{pending ? "Saving…" : "Save page"}</Btn>
          </div>
        </div>
      ) : null}
    </Card>
  );
}

const SETTING_LABELS: Record<string, string> = {
  appName: "Application name", tagline: "Tagline", supportEmail: "Support email", supportPhone: "Support phone",
  whatsapp: "WhatsApp number", instagram: "Instagram handle", minAppVersion: "Minimum supported version",
  currentVersion: "Current version", forceUpdate: "Force update (true/false)", maintenanceMessage: "Maintenance message",
  defaultLanguage: "Default language",
};

function SettingsEditor({ settings }: { settings: { key: string; value: string }[] }) {
  const [vals, setVals] = useState<Record<string, string>>(Object.fromEntries(settings.map((s) => [s.key, s.value])));
  const [pending, start] = useTransition();
  const dirty = settings.some((s) => vals[s.key] !== s.value);
  return (
    <div className="p-4">
      <div className="grid gap-3 md:grid-cols-2">
        {settings.map((s) => (
          <Field key={s.key} label={SETTING_LABELS[s.key] ?? s.key} value={vals[s.key] ?? ""} onChange={(v) => setVals((x) => ({ ...x, [s.key]: v }))} hint={s.key} />
        ))}
      </div>
      <div className="mt-4 flex justify-end">
        <Btn variant="primary" disabled={pending || !dirty} onClick={() => start(async () => void (await saveSettings(Object.entries(vals).map(([key, value]) => ({ key, value })))))}>
          {pending ? "Saving…" : "Save all settings"}
        </Btn>
      </div>
    </div>
  );
}
