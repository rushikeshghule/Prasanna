"use client";

import { useState } from "react";
import { useApp } from "../app-context";
import { Icon, Img, ListRow, Sheet, Toggle, TopBar } from "../ui";
import { Logo } from "./auth";
import type { Lang } from "@/lib/types";

export function ProfileScreen() {
  const { user, t, push, isSubscribed, activePlan, daysLeft, favourites, downloads, recents, data, setPhase } =
    useApp();
  const [logout, setLogout] = useState(false);

  return (
    <div className="anim-screen pb-8">
      <TopBar
        title={t("profile")}
        right={
          <button
            type="button"
            onClick={() => push({ name: "settings" })}
            className="tap flex h-9 w-9 items-center justify-center rounded-full border border-line bg-surface2"
          >
            <Icon name="settings" className="h-4 w-4" />
          </button>
        }
      />

      <div className="px-4 pt-4">
        <div className="relative overflow-hidden rounded-3xl border border-line bg-gradient-to-br from-surface2 to-surface p-4">
          <div className="flex items-center gap-3.5">
            <div className="relative">
              <Img src={user.avatar ?? ""} alt={user.name} className="h-16 w-16 rounded-2xl border border-gold/30" />
              <button
                type="button"
                onClick={() => push({ name: "edit-profile" })}
                className="tap absolute -bottom-1.5 -right-1.5 flex h-7 w-7 items-center justify-center rounded-full border border-ink bg-gold text-ink"
              >
                <Icon name="camera" className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="truncate font-display text-[18px] font-semibold">{user.name}</h2>
              <p className="truncate text-[11.5px] text-muted">{user.phone}</p>
              <p className="truncate text-[11px] text-muted/80">{user.email}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => push({ name: isSubscribed ? "subscription" : "plans" })}
            className={`tap mt-4 flex w-full items-center gap-3 rounded-2xl p-3 text-left ${
              isSubscribed ? "bg-gold/12 border border-gold/30" : "border border-line bg-surface3/60"
            }`}
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gold/20 text-gold">
              <Icon name="crown" className="h-4.5 w-4.5" />
            </span>
            <span className="flex-1">
              <span className="block text-[12.5px] font-bold">
                {isSubscribed ? `${activePlan?.name} · ${daysLeft} ${t("daysLeft")}` : "You are on the free plan"}
              </span>
              <span className="block text-[10px] text-muted">
                {isSubscribed
                  ? `Renews on ${new Date(user.subExpiresAt ?? "").toLocaleDateString("en-IN", { day: "numeric", month: "short" })}`
                  : "Upgrade for ₹100 to unlock premium designs"}
              </span>
            </span>
            <Icon name="right" className="h-4 w-4 text-gold" />
          </button>

          <div className="mt-3 grid grid-cols-3 gap-2">
            {[
              [favourites.size, t("favourites")],
              [downloads.length, t("downloads")],
              [recents.length, "viewed"],
            ].map(([a, b]) => (
              <div key={b as string} className="rounded-2xl border border-line bg-surface2/50 py-2.5 text-center">
                <p className="font-display text-[16px] font-semibold text-goldsoft">{a as number}</p>
                <p className="text-[9.5px] text-muted">{b as string}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Group title="My library">
        <ListRow icon="heart" label={t("favourites")} value={`${favourites.size}`} onClick={() => push({ name: "folders" })} />
        <ListRow icon="download" label={t("downloads")} value={`${downloads.length}`} onClick={() => push({ name: "downloads" })} />
        <ListRow icon="clock" label={t("recentlyViewed")} onClick={() => push({ name: "recent" })} />
      </Group>

      <Group title="Subscription & payments">
        <ListRow icon="crown" label={t("myPlan")} value={isSubscribed ? "Active" : "Free"} onClick={() => push({ name: "subscription" })} />
        <ListRow icon="ticket" label={t("plans")} onClick={() => push({ name: "plans" })} />
        <ListRow icon="card" label={t("paymentHistory")} onClick={() => push({ name: "payments" })} />
      </Group>

      <Group title="Preferences">
        <ListRow icon="globe" label={t("language")} value={data.languages.find((l) => l.code === user.language)?.nativeName} onClick={() => push({ name: "language" })} />
        <ListRow icon="bell" label={t("notifPrefs")} onClick={() => push({ name: "notif-prefs" })} />
        <ListRow icon="shield" label={t("devices")} value="2 active" onClick={() => push({ name: "devices" })} />
      </Group>

      <Group title="Support & legal">
        <ListRow icon="help" label={t("help")} onClick={() => push({ name: "help" })} />
        <ListRow icon="mail" label={t("contactSupport")} onClick={() => push({ name: "support" })} />
        <ListRow icon="sparkle" label={t("about")} onClick={() => push({ name: "legal", slug: "about" })} />
        <ListRow icon="shield" label={t("privacy")} onClick={() => push({ name: "legal", slug: "privacy" })} />
        <ListRow icon="tag" label={t("terms")} onClick={() => push({ name: "legal", slug: "terms" })} />
        <ListRow icon="refresh" label={t("refund")} onClick={() => push({ name: "legal", slug: "refund" })} />
        <ListRow icon="flag" label={t("copyright")} onClick={() => push({ name: "legal", slug: "copyright" })} />
      </Group>

      <Group title="Account">
        <ListRow icon="settings" label={t("settings")} onClick={() => push({ name: "settings" })} />
        <ListRow icon="trash" label={t("deleteAccount")} danger onClick={() => push({ name: "delete-account" })} />
        <ListRow icon="logout" label={t("logout")} onClick={() => setLogout(true)} />
      </Group>

      <div className="mt-6 flex flex-col items-center gap-2 pb-4">
        <Logo size={40} />
        <p className="text-[10.5px] text-muted">
          {data.settings.appName} · v{data.settings.currentVersion}
        </p>
        <p className="text-[9.5px] text-muted/60">Made with care in Pune, India</p>
      </div>

      <Sheet open={logout} onClose={() => setLogout(false)} title="Log out?" subtitle="You can log back in anytime">
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setLogout(false)}
            className="tap flex-1 rounded-2xl border border-line py-3 text-[13px] font-semibold text-muted"
          >
            {t("cancel")}
          </button>
          <button
            type="button"
            onClick={() => {
              setLogout(false);
              setPhase("login");
            }}
            className="tap flex-1 rounded-2xl bg-rose py-3 text-[13px] font-bold text-ink"
          >
            {t("logout")}
          </button>
        </div>
      </Sheet>
    </div>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-5 px-4">
      <p className="mb-2 px-1 text-[10.5px] font-bold uppercase tracking-wider text-muted">{title}</p>
      <div className="divide-y divide-line/50 overflow-hidden rounded-2xl border border-line bg-surface2/30">
        {children}
      </div>
    </div>
  );
}

export function EditProfileScreen() {
  const { user, back, updateProfile, t } = useApp();
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email ?? "");

  return (
    <div className="anim-screen">
      <TopBar title={t("editProfile")} onBack={back} />
      <div className="px-4 pt-5">
        <div className="flex flex-col items-center">
          <div className="relative">
            <Img src={user.avatar ?? ""} alt="" className="h-24 w-24 rounded-3xl border border-gold/30" />
            <span className="tap absolute -bottom-2 -right-2 flex h-9 w-9 items-center justify-center rounded-full border border-ink bg-gold text-ink">
              <Icon name="camera" className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-3 text-[11px] text-muted">Tap to change your profile photo</p>
        </div>

        <div className="mt-6 space-y-3">
          <Field label="Full name" value={name} onChange={setName} />
          <Field label="Email address" value={email} onChange={setEmail} />
          <div className="rounded-2xl border border-line bg-surface2/40 px-4 py-3">
            <p className="text-[10px] uppercase tracking-wider text-muted">Mobile number</p>
            <p className="mt-1 flex items-center gap-2 text-[13.5px] font-semibold">
              {user.phone}
              <span className="rounded-full bg-jade/15 px-2 py-0.5 text-[9px] font-bold text-jade">VERIFIED</span>
            </p>
          </div>
          <div className="rounded-2xl border border-line bg-surface2/40 px-4 py-3">
            <p className="text-[10px] uppercase tracking-wider text-muted">Member since</p>
            <p className="mt-1 text-[13.5px] font-semibold">
              {new Date(user.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            updateProfile(name, email);
            back();
          }}
          className="tap mt-5 w-full rounded-2xl bg-gold py-3.5 text-[14px] font-bold text-ink"
        >
          {t("save")}
        </button>
      </div>
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block rounded-2xl border border-line bg-surface2/40 px-4 py-2.5">
      <span className="text-[10px] uppercase tracking-wider text-muted">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full bg-transparent text-[13.5px] font-semibold outline-none"
      />
    </label>
  );
}

export function LanguageScreen() {
  const { data, lang, setLang, back, t } = useApp();
  return (
    <div className="anim-screen">
      <TopBar title={t("language")} subtitle="Content falls back to English when a translation is missing" onBack={back} />
      <div className="space-y-2.5 px-4 pt-4">
        {data.languages.map((l) => {
          const active = lang === l.code;
          return (
            <button
              key={l.code}
              type="button"
              onClick={() => setLang(l.code as Lang)}
              className={`tap flex w-full items-center gap-3.5 rounded-2xl border px-4 py-3.5 text-left ${
                active ? "gold-border" : "border-line bg-surface2/50"
              }`}
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-surface3 font-display text-[13px] font-semibold text-gold">
                {l.code.toUpperCase()}
              </span>
              <span className="flex-1">
                <span className="block text-[14px] font-semibold">{l.nativeName}</span>
                <span className="block text-[10.5px] text-muted">
                  {l.name}
                  {l.isDefault ? " · default" : ""}
                </span>
                <span className="mt-1.5 block h-1 w-full overflow-hidden rounded-full bg-surface3">
                  <span className="block h-full rounded-full bg-gold" style={{ width: `${l.completion}%` }} />
                </span>
              </span>
              <span className="text-[10px] text-muted">{l.completion}%</span>
            </button>
          );
        })}
        <p className="px-1 pt-2 text-[10.5px] leading-relaxed text-muted">
          Admins can add more languages and update translations from the web panel. New languages appear here
          instantly.
        </p>
      </div>
    </div>
  );
}

export function NotifPrefsScreen() {
  const { user, updatePrefs, back, t } = useApp();
  const rows = [
    { key: "pushEnabled" as const, label: "Push notifications", note: "New designs, collections and reminders" },
    { key: "promoEnabled" as const, label: "Offers & promotions", note: "Discounts and festive offers" },
    { key: "emailEnabled" as const, label: "Email updates", note: "Invoices and monthly highlights" },
  ];
  return (
    <div className="anim-screen">
      <TopBar title={t("notifPrefs")} onBack={back} />
      <div className="mt-4 divide-y divide-line/50 overflow-hidden rounded-2xl border border-line bg-surface2/30 mx-4">
        {rows.map((r) => (
          <div key={r.key} className="flex items-center gap-3 px-4 py-3.5">
            <div className="flex-1">
              <p className="text-[13px] font-medium">{r.label}</p>
              <p className="text-[10.5px] text-muted">{r.note}</p>
            </div>
            <Toggle on={user[r.key]} onChange={(v) => updatePrefs({ [r.key]: v })} />
          </div>
        ))}
      </div>
      <p className="mt-3 px-5 text-[10.5px] leading-relaxed text-muted">
        Subscription and payment alerts are always delivered — they are required for your account.
      </p>
    </div>
  );
}

export function DevicesScreen() {
  const { back, t, showToast } = useApp();
  const devices = [
    { name: "Redmi Note 13 Pro", meta: "Pune · Android 14 · this device", now: true },
    { name: "iPhone 13", meta: "Mumbai · iOS 18 · 3 days ago", now: false },
  ];
  return (
    <div className="anim-screen">
      <TopBar title={t("devices")} subtitle="Sessions are monitored for suspicious activity" onBack={back} />
      <div className="space-y-2.5 px-4 pt-4">
        {devices.map((d) => (
          <div key={d.name} className="flex items-center gap-3 rounded-2xl border border-line bg-surface2/40 p-4">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface3 text-gold">
              <Icon name="scan" className="h-4.5 w-4.5" />
            </span>
            <div className="flex-1">
              <p className="text-[13px] font-semibold">{d.name}</p>
              <p className="text-[10.5px] text-muted">{d.meta}</p>
            </div>
            {d.now ? (
              <span className="rounded-full bg-jade/15 px-2 py-0.5 text-[9.5px] font-bold text-jade">ACTIVE</span>
            ) : (
              <button
                type="button"
                onClick={() => showToast("Session revoked", "shield")}
                className="tap text-[11px] font-semibold text-rose"
              >
                Revoke
              </button>
            )}
          </div>
        ))}
        <div className="rounded-2xl border border-line bg-surface2/40 p-4">
          <p className="text-[11.5px] font-semibold">Security</p>
          <ul className="mt-2 space-y-1.5">
            {[
              "Short-lived signed URLs for every premium image",
              "Server-side subscription verification on each download",
              "API rate limiting and suspicious-activity logging",
            ].map((s) => (
              <li key={s} className="flex items-start gap-2 text-[10.5px] text-muted">
                <Icon name="check" className="mt-0.5 h-3 w-3 shrink-0 text-gold" strokeWidth={2.6} />
                {s}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export function SettingsScreen() {
  const { back, t, push, data, user, updatePrefs, showToast } = useApp();
  return (
    <div className="anim-screen pb-8">
      <TopBar title={t("settings")} onBack={back} />
      <Group title="App">
        <ListRow icon="globe" label={t("language")} onClick={() => push({ name: "language" })} />
        <ListRow icon="bell" label={t("notifPrefs")} onClick={() => push({ name: "notif-prefs" })} />
        <div className="flex items-center gap-3 px-4 py-3.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-line bg-surface2 text-gold">
            <Icon name="image" className="h-4 w-4" />
          </span>
          <div className="flex-1">
            <p className="text-[13.5px] font-medium">High quality images</p>
            <p className="text-[10px] text-muted">Uses more data on mobile networks</p>
          </div>
          <Toggle on={user.emailEnabled} onChange={(v) => updatePrefs({ emailEnabled: v })} />
        </div>
        <ListRow icon="trash" label="Clear image cache" value="86 MB" onClick={() => showToast("Cache cleared", "broom")} />
      </Group>

      <Group title="Account">
        <ListRow icon="user" label={t("editProfile")} onClick={() => push({ name: "edit-profile" })} />
        <ListRow icon="shield" label={t("devices")} onClick={() => push({ name: "devices" })} />
        <ListRow icon="download" label="Export my data" onClick={() => showToast("Export link sent to your email", "mail")} />
        <ListRow icon="trash" label={t("deleteAccount")} danger onClick={() => push({ name: "delete-account" })} />
      </Group>

      <Group title="About">
        <ListRow icon="sparkle" label="App version" value={`v${data.settings.currentVersion}`} />
        <ListRow icon="refresh" label="Check for updates" onClick={() => showToast("You are on the latest version", "check")} />
        <ListRow icon="mail" label="Support email" value={data.settings.supportEmail} />
        <ListRow icon="phone" label="Support phone" value={data.settings.supportPhone} />
      </Group>
    </div>
  );
}

export function HelpScreen() {
  const { data, back, t, push } = useApp();
  const [open, setOpen] = useState<number | null>(data.faqs[0]?.id ?? null);
  const topics = Array.from(new Set(data.faqs.map((f) => f.topic)));

  return (
    <div className="anim-screen pb-8">
      <TopBar title={t("help")} subtitle="Answers to the most common questions" onBack={back} />
      <div className="px-4 pt-4">
        {topics.map((topic) => (
          <div key={topic} className="mb-4">
            <p className="mb-2 text-[10.5px] font-bold uppercase tracking-wider text-muted">{topic}</p>
            <div className="divide-y divide-line/50 overflow-hidden rounded-2xl border border-line bg-surface2/30">
              {data.faqs
                .filter((f) => f.topic === topic)
                .map((f) => (
                  <div key={f.id}>
                    <button
                      type="button"
                      onClick={() => setOpen(open === f.id ? null : f.id)}
                      className="tap flex w-full items-center gap-3 px-4 py-3 text-left"
                    >
                      <span className="flex-1 text-[12.5px] font-medium">{f.question}</span>
                      <Icon name={open === f.id ? "up" : "down"} className="h-4 w-4 shrink-0 text-muted" />
                    </button>
                    {open === f.id ? (
                      <p className="anim-up px-4 pb-3.5 text-[11.5px] leading-relaxed text-muted">{f.answer}</p>
                    ) : null}
                  </div>
                ))}
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={() => push({ name: "support" })}
          className="tap mt-2 flex w-full items-center gap-3 rounded-2xl border border-gold/30 bg-gold/8 p-4 text-left"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold/15 text-gold">
            <Icon name="mail" className="h-4.5 w-4.5" />
          </span>
          <span className="flex-1">
            <span className="block text-[13px] font-semibold">Still need help?</span>
            <span className="block text-[10.5px] text-muted">Our team replies within one working day</span>
          </span>
          <Icon name="right" className="h-4 w-4 text-gold" />
        </button>
      </div>
    </div>
  );
}

export function SupportScreen() {
  const { data, back, t, submitSupport } = useApp();
  const [subject, setSubject] = useState("Payment issue");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const channels = [
    { label: "WhatsApp support", value: data.settings.whatsapp, icon: "phone", tint: "text-[#25D366]" },
    { label: "Email us", value: data.settings.supportEmail, icon: "mail", tint: "text-gold" },
    { label: "Call us · 10am to 7pm", value: data.settings.supportPhone, icon: "phone", tint: "text-rose" },
  ];

  return (
    <div className="anim-screen pb-8">
      <TopBar title={t("contactSupport")} onBack={back} />
      <div className="space-y-2.5 px-4 pt-4">
        {channels.map((c) => (
          <div key={c.label} className="flex items-center gap-3 rounded-2xl border border-line bg-surface2/40 p-3.5">
            <span className={`flex h-10 w-10 items-center justify-center rounded-xl bg-surface3 ${c.tint}`}>
              <Icon name={c.icon} className="h-4.5 w-4.5" />
            </span>
            <div className="flex-1">
              <p className="text-[12.5px] font-semibold">{c.label}</p>
              <p className="text-[10.5px] text-muted">{c.value}</p>
            </div>
            <Icon name="arrow" className="h-4 w-4 -rotate-45 text-muted" />
          </div>
        ))}
      </div>

      <div className="mt-5 px-4">
        <p className="mb-2 text-[10.5px] font-bold uppercase tracking-wider text-muted">Raise a request</p>
        <div className="space-y-2.5">
          <div className="no-scrollbar flex gap-2 overflow-x-auto">
            {["Payment issue", "Subscription", "Design request", "Report content", "Other"].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSubject(s)}
                className={`tap shrink-0 rounded-full border px-3 py-1.5 text-[11.5px] font-semibold ${
                  subject === s ? "border-gold/60 bg-gold/15 text-goldsoft" : "border-line bg-surface2/60 text-muted"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={5}
            placeholder="Describe your issue. Attach the design code if it helps."
            className="w-full rounded-2xl border border-line bg-surface2/50 p-3.5 text-[12.5px] outline-none placeholder:text-muted/60"
          />
          <button
            type="button"
            disabled={!message.trim() || sent}
            onClick={() => {
              submitSupport(subject, message);
              setSent(true);
              setMessage("");
            }}
            className={`tap w-full rounded-2xl py-3.5 text-[13.5px] font-bold ${
              message.trim() && !sent ? "bg-gold text-ink" : "bg-surface3 text-muted"
            }`}
          >
            {sent ? "Request submitted ✓" : "Submit request"}
          </button>
          {sent ? (
            <p className="text-center text-[10.5px] text-jade">
              Ticket #PT-{Math.floor(Math.random() * 9000) + 1000} created. We will reply on {data.settings.supportEmail}.
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export function LegalScreen({ slug }: { slug: string }) {
  const { data, back } = useApp();
  const page = data.legal.find((l) => l.slug === slug);
  if (!page) return null;
  return (
    <div className="anim-screen pb-10">
      <TopBar
        title={page.title}
        subtitle={`Updated ${new Date(page.updatedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}`}
        onBack={back}
      />
      <div className="space-y-3.5 px-5 pt-5">
        {page.body.map((p, i) => (
          <p key={i} className="text-[12.5px] leading-relaxed text-muted">
            {p}
          </p>
        ))}
        <div className="mt-4 rounded-2xl border border-line bg-surface2/40 p-4">
          <p className="text-[11px] font-semibold">Need clarification?</p>
          <p className="mt-1 text-[10.5px] text-muted">
            Write to {data.settings.supportEmail} or call {data.settings.supportPhone}.
          </p>
        </div>
      </div>
    </div>
  );
}

export function DeleteAccountScreen() {
  const { back, requestDeletion, user, setPhase, t } = useApp();
  const [confirm, setConfirm] = useState("");
  const [done, setDone] = useState(user.deletionRequested);

  if (done) {
    return (
      <div className="anim-screen flex h-full flex-col items-center justify-center px-8 text-center">
        <div className="anim-pop flex h-16 w-16 items-center justify-center rounded-2xl bg-rose/15 text-rose">
          <Icon name="trash" className="h-7 w-7" />
        </div>
        <h2 className="mt-5 font-display text-[20px] font-semibold">Deletion requested</h2>
        <p className="mt-2 text-[12px] leading-relaxed text-muted">
          Your profile will be anonymised within 7 days and all sessions are revoked now. Payment records are
          retained only as required by law. You can cancel by logging in again before then.
        </p>
        <button
          type="button"
          onClick={() => setPhase("login")}
          className="tap mt-6 w-full rounded-2xl bg-rose py-3.5 text-[13.5px] font-bold text-ink"
        >
          Log out now
        </button>
      </div>
    );
  }

  return (
    <div className="anim-screen pb-8">
      <TopBar title={t("deleteAccount")} onBack={back} />
      <div className="px-5 pt-5">
        <div className="rounded-2xl border border-rose/30 bg-rose/8 p-4">
          <p className="text-[12.5px] font-semibold text-rose">This action cannot be undone</p>
          <ul className="mt-2 space-y-1.5">
            {[
              "Favourites, folders and history are deleted",
              "Active subscription is cancelled without refund",
              "Downloaded files already in your gallery stay with you",
              "Invoices are retained for statutory compliance",
            ].map((s) => (
              <li key={s} className="flex items-start gap-2 text-[11px] text-muted">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-rose" />
                {s}
              </li>
            ))}
          </ul>
        </div>

        <p className="mt-5 text-[11.5px] text-muted">
          Type <span className="font-semibold text-cream">DELETE</span> to confirm
        </p>
        <input
          value={confirm}
          onChange={(e) => setConfirm(e.target.value.toUpperCase())}
          placeholder="DELETE"
          className="mt-2 w-full rounded-2xl border border-line bg-surface2/50 px-4 py-3 text-[13px] tracking-widest outline-none placeholder:text-muted/50"
        />
        <button
          type="button"
          disabled={confirm !== "DELETE"}
          onClick={() => {
            requestDeletion();
            setDone(true);
          }}
          className={`tap mt-4 w-full rounded-2xl py-3.5 text-[13.5px] font-bold ${
            confirm === "DELETE" ? "bg-rose text-ink" : "bg-surface3 text-muted"
          }`}
        >
          Request account deletion
        </button>
        <button
          type="button"
          onClick={back}
          className="tap mt-2.5 w-full rounded-2xl border border-line py-3.5 text-[13px] font-semibold text-cream"
        >
          Keep my account
        </button>
      </div>
    </div>
  );
}

export function FoldersScreen() {
  const { folders, favourites, folderOf, byCode, back, openViewer } = useApp();
  return (
    <div className="anim-screen pb-8">
      <TopBar title="My folders" subtitle={`${favourites.size} designs saved`} onBack={back} />
      <div className="space-y-3 px-4 pt-4">
        {folders.map((f) => {
          const codes = Array.from(favourites).filter((c) => (f === "All favourites" ? true : folderOf[c] === f));
          const covers = codes.slice(0, 3).map((c) => byCode.get(c)?.thumb ?? "");
          return (
            <button
              key={f}
              type="button"
              onClick={() => codes.length && openViewer(codes, 0)}
              className="tap flex w-full items-center gap-3 rounded-2xl border border-line bg-surface2/40 p-3 text-left"
            >
              <span className="flex -space-x-4">
                {covers.length === 0 ? (
                  <span className="flex h-14 w-14 items-center justify-center rounded-xl border border-line bg-surface3 text-muted">
                    <Icon name="folder" className="h-5 w-5" />
                  </span>
                ) : (
                  covers.map((src, i) => (
                    <Img key={i} src={src} alt="" className="h-14 w-14 rounded-xl border-2 border-ink" />
                  ))
                )}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[13px] font-semibold">{f}</span>
                <span className="block text-[10.5px] text-muted">{codes.length} designs</span>
              </span>
              <Icon name="right" className="h-4 w-4 text-muted" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
