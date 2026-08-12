"use client";

import { useState } from "react";
import { useApp } from "../app-context";
import { Chip, EmptyState, Icon, ListRow, TopBar } from "../ui";
import { loc } from "@/lib/i18n";

export function PlansScreen() {
  const { data, lang, t, back, push, user, isSubscribed } = useApp();
  const [sel, setSel] = useState(data.plans.find((p) => p.isPopular)?.code ?? data.plans[0]?.code);

  return (
    <div className="anim-screen pb-8">
      <TopBar title={t("plans")} subtitle="Secure payments · GST invoice included" onBack={back} />

      <div className="px-4 pt-4">
        <div className="relative overflow-hidden rounded-3xl border border-gold/25 bg-gradient-to-br from-[#2c2010] via-[#1a1122] to-[#2a1220] p-5">
          <span className="anim-float absolute -right-6 -top-6 text-[92px] opacity-20">👑</span>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gold/80">Premium access</p>
          <h2 className="mt-2 font-display text-[24px] font-semibold leading-tight">
            {data.designs.filter((d) => d.isPremium).length} premium designs, one small price
          </h2>
          <p className="mt-2 text-[12px] leading-relaxed text-muted">
            Watermark-free downloads, original files for sharing, and every new drop the studio publishes.
          </p>
          <div className="mt-4 flex gap-4">
            {[
              ["3 days", "Free trial"],
              ["₹100", "Per month"],
              ["Anytime", "Cancel"],
            ].map(([a, b]) => (
              <div key={b}>
                <p className="font-display text-[15px] font-semibold text-goldsoft">{a}</p>
                <p className="text-[10px] text-muted">{b}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5 space-y-3 px-4">
        {data.plans.map((p) => {
          const active = sel === p.code;
          const current = user.planCode === p.code && isSubscribed;
          return (
            <button
              key={p.code}
              type="button"
              onClick={() => setSel(p.code)}
              className={`tap relative block w-full overflow-hidden rounded-3xl border p-4 text-left ${
                active ? "gold-border" : "border-line bg-surface2/50"
              }`}
            >
              {p.isPopular ? (
                <span className="absolute right-0 top-0 rounded-bl-2xl bg-gold px-3 py-1 text-[9.5px] font-bold text-ink">
                  MOST POPULAR
                </span>
              ) : null}
              <div className="flex items-start gap-3">
                <span
                  className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                    active ? "border-gold bg-gold text-ink" : "border-line"
                  }`}
                >
                  {active ? <Icon name="check" className="h-3 w-3" strokeWidth={3} /> : null}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-display text-[17px] font-semibold">{loc(lang, p)}</p>
                  <p className="mt-0.5 text-[11px] text-muted">{p.description}</p>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="font-display text-[24px] font-semibold text-goldsoft">₹{p.price}</span>
                    {p.mrp ? <span className="text-[12px] text-muted line-through">₹{p.mrp}</span> : null}
                    <span className="text-[11px] text-muted">/ {p.durationLabel}</span>
                  </div>
                  {p.trialDays > 0 ? (
                    <span className="mt-2 inline-block rounded-full border border-jade/40 bg-jade/10 px-2 py-0.5 text-[9.5px] font-bold text-jade">
                      {p.trialDays}-DAY FREE TRIAL
                    </span>
                  ) : null}
                  <ul className="mt-3 space-y-1.5">
                    {p.benefits.map((b) => (
                      <li key={b} className="flex items-start gap-2 text-[11.5px] text-cream/85">
                        <Icon name="check" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold" strokeWidth={2.6} />
                        {b}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {p.includedCategories.map((c) => (
                      <span key={c} className="rounded-full border border-line px-2 py-0.5 text-[9.5px] text-muted">
                        {data.categories.find((x) => x.slug === c)?.name ?? c}
                      </span>
                    ))}
                    <span className="rounded-full border border-line px-2 py-0.5 text-[9.5px] text-muted">
                      {p.downloadLimit} downloads
                    </span>
                    <span className="rounded-full border border-line px-2 py-0.5 text-[9.5px] text-muted">
                      {p.quality}
                    </span>
                  </div>
                  {current ? (
                    <p className="mt-3 text-[10.5px] font-semibold text-jade">✓ This is your current plan</p>
                  ) : null}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-5 px-4">
        <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-muted">Free vs Premium</p>
        <div className="overflow-hidden rounded-2xl border border-line">
          {[
            ["Browse all categories", true, true],
            ["Free design downloads", true, true],
            ["Premium designs", false, true],
            ["Watermark-free files", false, true],
            ["Share original image", false, true],
            ["Early access drops", false, true],
          ].map(([label, free, premium]) => (
            <div
              key={label as string}
              className="flex items-center border-b border-line/60 bg-surface2/40 px-4 py-2.5 last:border-0"
            >
              <span className="flex-1 text-[11.5px]">{label as string}</span>
              <span className="w-12 text-center">
                {free ? <Icon name="check" className="mx-auto h-3.5 w-3.5 text-jade" strokeWidth={2.6} /> : <span className="text-muted">—</span>}
              </span>
              <span className="w-12 text-center">
                {premium ? <Icon name="check" className="mx-auto h-3.5 w-3.5 text-gold" strokeWidth={2.6} /> : <span className="text-muted">—</span>}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 px-4 text-center">
        <p className="text-[10.5px] leading-relaxed text-muted">
          Payments processed securely by Razorpay / Google Play Billing. Card details are never stored by
          Prasanna Trends. GST invoice is generated for every successful payment.
        </p>
        <button type="button" className="tap mt-2 text-[11.5px] font-semibold text-gold">
          Restore previous purchase
        </button>
      </div>

      <div className="sticky bottom-0 mt-5 border-t border-line bg-ink/95 p-4 backdrop-blur-xl">
        <button
          type="button"
          onClick={() => sel && push({ name: "checkout", planCode: sel })}
          className="tap flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-gold to-[#d8a94b] py-3.5 text-[14px] font-bold text-ink"
        >
          Continue with {data.plans.find((p) => p.code === sel)?.name}
          <Icon name="arrow" className="h-4 w-4" strokeWidth={2.4} />
        </button>
      </div>
    </div>
  );
}

const METHODS = [
  { key: "UPI · Google Pay", icon: "scan", note: "Pay by any UPI app" },
  { key: "Card · HDFC ****4412", icon: "card", note: "Visa / Mastercard / RuPay" },
  { key: "Net banking", icon: "bank", note: "All major banks" },
  { key: "Wallet · Paytm", icon: "wallet", note: "Instant payment" },
  { key: "Google Play Billing", icon: "play", note: "Charged to your Play account" },
];

export function CheckoutScreen({ planCode }: { planCode: string }) {
  const { data, back, purchase, push, t } = useApp();
  const plan = data.plans.find((p) => p.code === planCode);
  const [method, setMethod] = useState(METHODS[0].key);
  const [coupon, setCoupon] = useState("");
  const [couponState, setCouponState] = useState<"idle" | "ok" | "bad">("idle");
  const [state, setState] = useState<"idle" | "processing" | "success" | "failed">("idle");
  const [step, setStep] = useState(0);
  const [simulateFail, setSimulateFail] = useState(false);

  if (!plan) return null;

  const discount = couponState === "ok" ? Math.round(plan.price * 0.1) : 0;
  const base = plan.price - discount;
  const tax = Math.round(base * plan.taxPercent) / 100;
  const total = base + tax;

  const pay = async () => {
    setState("processing");
    setStep(0);
    const steps = [700, 900, 900];
    steps.forEach((_, i) => window.setTimeout(() => setStep(i + 1), steps.slice(0, i + 1).reduce((a, b) => a + b, 0)));
    const ok = await new Promise<boolean>((resolve) => {
      window.setTimeout(async () => {
        const r = await purchase(planCode, method, simulateFail ? "failed" : "success");
        resolve(r);
      }, 2500);
    });
    setState(ok ? "success" : "failed");
  };

  if (state === "processing") {
    const labels = ["Creating secure order", "Contacting payment gateway", "Verifying payment signature", "Activating subscription"];
    return (
      <div className="anim-screen flex h-full flex-col items-center justify-center bg-ink px-8">
        <div className="relative flex h-20 w-20 items-center justify-center">
          <span className="absolute inset-0 rounded-full border-2 border-gold/25" />
          <span className="absolute inset-0 rounded-full border-2 border-gold border-t-transparent anim-spin" />
          <Icon name="shield" className="h-7 w-7 text-gold" />
        </div>
        <p className="mt-6 font-display text-[18px] font-semibold">Processing ₹{total.toFixed(0)}</p>
        <p className="mt-1 text-[12px] text-muted">Do not close the app</p>
        <div className="mt-6 w-full space-y-2.5">
          {labels.map((l, i) => (
            <div key={l} className="flex items-center gap-3">
              <span
                className={`flex h-5 w-5 items-center justify-center rounded-full border text-[10px] ${
                  i < step ? "border-jade bg-jade/20 text-jade" : i === step ? "border-gold text-gold" : "border-line text-muted"
                }`}
              >
                {i < step ? <Icon name="check" className="h-3 w-3" strokeWidth={3} /> : i + 1}
              </span>
              <span className={`text-[12px] ${i <= step ? "text-cream" : "text-muted"}`}>{l}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (state === "success") {
    const expiry = new Date(Date.now() + plan.durationDays * 86400000);
    return (
      <div className="anim-screen flex h-full flex-col bg-ink px-6 pt-16">
        <div className="anim-pop mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-jade/15">
          <Icon name="check" className="h-9 w-9 text-jade" strokeWidth={2.6} />
        </div>
        <h2 className="mt-6 text-center font-display text-[24px] font-semibold">Payment successful 🎉</h2>
        <p className="mt-2 text-center text-[12.5px] text-muted">
          {plan.name} is active till{" "}
          {expiry.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
        </p>

        <div className="mt-6 divide-y divide-line/60 overflow-hidden rounded-2xl border border-line bg-surface2/40">
          {[
            ["Plan", plan.name],
            ["Amount", `₹${base.toFixed(2)}`],
            [`GST (${plan.taxPercent}%)`, `₹${tax.toFixed(2)}`],
            ["Paid", `₹${total.toFixed(2)}`],
            ["Method", method],
          ].map(([k, v]) => (
            <div key={k} className="flex items-center justify-between px-4 py-2.5">
              <span className="text-[11.5px] text-muted">{k}</span>
              <span className="text-[11.5px] font-semibold">{v}</span>
            </div>
          ))}
        </div>

        <div className="mt-4 space-y-2.5">
          <button
            type="button"
            onClick={() => {
              back();
              back();
            }}
            className="tap w-full rounded-2xl bg-gold py-3.5 text-[14px] font-bold text-ink"
          >
            Start exploring premium designs
          </button>
          <button
            type="button"
            onClick={() => push({ name: "payments" })}
            className="tap w-full rounded-2xl border border-line py-3.5 text-[13px] font-semibold text-cream"
          >
            View invoice &amp; payment history
          </button>
        </div>
      </div>
    );
  }

  if (state === "failed") {
    return (
      <div className="anim-screen flex h-full flex-col bg-ink px-6 pt-16">
        <div className="anim-pop mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-rose/15">
          <Icon name="close" className="h-9 w-9 text-rose" strokeWidth={2.6} />
        </div>
        <h2 className="mt-6 text-center font-display text-[23px] font-semibold">Payment could not be verified</h2>
        <p className="mt-2 text-center text-[12.5px] leading-relaxed text-muted">
          No amount was captured. If money was debited it is auto-refunded within 5-7 working days. The
          transaction is recorded in your payment history.
        </p>
        <div className="mt-6 space-y-2.5">
          <button
            type="button"
            onClick={() => {
              setSimulateFail(false);
              setState("idle");
            }}
            className="tap w-full rounded-2xl bg-gold py-3.5 text-[14px] font-bold text-ink"
          >
            Retry payment
          </button>
          <button
            type="button"
            onClick={() => push({ name: "support" })}
            className="tap w-full rounded-2xl border border-line py-3.5 text-[13px] font-semibold text-cream"
          >
            Contact support
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="anim-screen pb-8">
      <TopBar title="Checkout" subtitle={plan.name} onBack={back} />

      <div className="px-4 pt-4">
        <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-muted">{t("orderSummary")}</p>
        <div className="divide-y divide-line/60 overflow-hidden rounded-2xl border border-line bg-surface2/40">
          <div className="flex items-center justify-between px-4 py-3">
            <div>
              <p className="text-[13px] font-semibold">{plan.name}</p>
              <p className="text-[10.5px] text-muted">
                {plan.durationLabel} · {plan.downloadLimit} downloads · {plan.quality}
              </p>
            </div>
            <p className="text-[13px] font-semibold">₹{plan.price.toFixed(2)}</p>
          </div>
          {discount > 0 ? (
            <div className="flex items-center justify-between px-4 py-2.5 text-jade">
              <span className="text-[11.5px]">Coupon FESTIVE10</span>
              <span className="text-[11.5px]">− ₹{discount.toFixed(2)}</span>
            </div>
          ) : null}
          <div className="flex items-center justify-between px-4 py-2.5">
            <span className="text-[11.5px] text-muted">{t("gst")}</span>
            <span className="text-[11.5px]">₹{tax.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between bg-surface2/70 px-4 py-3">
            <span className="text-[12.5px] font-bold">{t("total")}</span>
            <span className="font-display text-[18px] font-semibold text-goldsoft">₹{total.toFixed(2)}</span>
          </div>
        </div>

        <div className="mt-3 flex gap-2">
          <input
            value={coupon}
            onChange={(e) => {
              setCoupon(e.target.value.toUpperCase());
              setCouponState("idle");
            }}
            placeholder="Coupon code (try FESTIVE10)"
            className="flex-1 rounded-2xl border border-line bg-surface2/60 px-4 py-3 text-[12.5px] outline-none placeholder:text-muted/60"
          />
          <button
            type="button"
            onClick={() => setCouponState(coupon === "FESTIVE10" ? "ok" : "bad")}
            className="tap rounded-2xl border border-gold/40 px-4 text-[12.5px] font-bold text-gold"
          >
            Apply
          </button>
        </div>
        {couponState === "bad" ? (
          <p className="mt-1.5 text-[10.5px] text-rose">That coupon is not valid for this plan.</p>
        ) : null}
        {couponState === "ok" ? <p className="mt-1.5 text-[10.5px] text-jade">10% discount applied.</p> : null}
      </div>

      <div className="mt-5 px-4">
        <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-muted">{t("paymentMethod")}</p>
        <div className="space-y-2">
          {METHODS.map((m) => (
            <button
              key={m.key}
              type="button"
              onClick={() => setMethod(m.key)}
              className={`tap flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left ${
                method === m.key ? "gold-border" : "border-line bg-surface2/50"
              }`}
            >
              <Icon name={m.icon} className="h-4.5 w-4.5 text-gold" />
              <span className="flex-1">
                <span className="block text-[12.5px] font-semibold">{m.key}</span>
                <span className="block text-[10px] text-muted">{m.note}</span>
              </span>
              <span
                className={`flex h-4.5 w-4.5 items-center justify-center rounded-full border ${
                  method === m.key ? "border-gold bg-gold text-ink" : "border-line"
                }`}
              >
                {method === m.key ? <Icon name="check" className="h-2.5 w-2.5" strokeWidth={3.4} /> : null}
              </span>
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setSimulateFail((s) => !s)}
          className="tap mt-3 flex w-full items-center gap-2 rounded-2xl border border-dashed border-line px-4 py-2.5 text-left"
        >
          <span
            className={`flex h-4 w-4 items-center justify-center rounded border ${
              simulateFail ? "border-rose bg-rose text-ink" : "border-line"
            }`}
          >
            {simulateFail ? <Icon name="check" className="h-2.5 w-2.5" strokeWidth={3.4} /> : null}
          </span>
          <span className="text-[10.5px] text-muted">
            Demo: simulate a failed / pending gateway response
          </span>
        </button>
      </div>

      <div className="sticky bottom-0 mt-5 border-t border-line bg-ink/95 p-4 backdrop-blur-xl">
        <button
          type="button"
          onClick={pay}
          className="tap flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-gold to-[#d8a94b] py-3.5 text-[14px] font-bold text-ink"
        >
          <Icon name="lock" className="h-4 w-4" strokeWidth={2.2} />
          {t("payNow")} ₹{total.toFixed(0)}
        </button>
        <p className="mt-2 text-center text-[9.5px] text-muted">
          By paying you accept the Terms, Refund Policy and consent to auto-renewal reminders.
        </p>
      </div>
    </div>
  );
}

export function SubscriptionScreen() {
  const { user, back, activePlan, daysLeft, isSubscribed, push, cancelSubscription, resetSubscription, payments, data } =
    useApp();

  if (!isSubscribed || !activePlan) {
    return (
      <div className="anim-screen">
        <TopBar title="My subscription" onBack={back} />
        <EmptyState
          icon="crown"
          title="No active subscription"
          subtitle="Free designs stay free forever. Subscribe to unlock the premium library, HD downloads and original-file sharing."
          actionLabel="View plans"
          onAction={() => push({ name: "plans" })}
        />
        {payments.length > 0 ? (
          <div className="px-4">
            <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-muted">Past subscriptions</p>
            {payments.slice(0, 3).map((p) => (
              <div key={p.id} className="mb-2 flex items-center gap-3 rounded-2xl border border-line bg-surface2/40 p-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-surface3 text-gold">
                  <Icon name="ticket" className="h-4 w-4" />
                </span>
                <div className="flex-1">
                  <p className="text-[12.5px] font-semibold">
                    {data.plans.find((x) => x.code === p.planCode)?.name ?? p.planCode}
                  </p>
                  <p className="text-[10px] text-muted">
                    {new Date(p.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })} ·{" "}
                    {p.status}
                  </p>
                </div>
                <span className="text-[12px] font-semibold">₹{p.total}</span>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    );
  }

  const pct = Math.min(100, (user.downloadsUsed / Math.max(1, activePlan.downloadLimit)) * 100);

  return (
    <div className="anim-screen pb-8">
      <TopBar title="My subscription" onBack={back} />
      <div className="px-4 pt-4">
        <div className="gold-border rounded-3xl p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10.5px] font-bold uppercase tracking-widest text-gold/80">Current plan</p>
              <h2 className="mt-1 font-display text-[22px] font-semibold">{activePlan.name}</h2>
            </div>
            <span
              className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                user.subStatus === "active" ? "bg-jade/15 text-jade" : "bg-rose/15 text-rose"
              }`}
            >
              {user.subStatus.toUpperCase()}
            </span>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
            {[
              [`${daysLeft}`, "days left"],
              [`${user.downloadsUsed}`, "downloads"],
              [activePlan.quality, "quality"],
            ].map(([a, b]) => (
              <div key={b} className="rounded-2xl border border-line bg-surface2/50 py-2.5">
                <p className="font-display text-[16px] font-semibold text-goldsoft">{a}</p>
                <p className="text-[9.5px] text-muted">{b}</p>
              </div>
            ))}
          </div>

          <div className="mt-4">
            <div className="mb-1.5 flex justify-between text-[10.5px] text-muted">
              <span>Download quota</span>
              <span>
                {user.downloadsUsed} / {activePlan.downloadLimit}
              </span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-surface3">
              <div className="h-full rounded-full bg-gradient-to-r from-gold to-rose" style={{ width: `${pct}%` }} />
            </div>
          </div>

          <div className="mt-4 space-y-1.5">
            {activePlan.benefits.map((b) => (
              <p key={b} className="flex items-start gap-2 text-[11.5px] text-cream/85">
                <Icon name="check" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold" strokeWidth={2.6} />
                {b}
              </p>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 divide-y divide-line/60 overflow-hidden rounded-2xl border border-line bg-surface2/30 mx-4">
        <ListRow icon="refresh" label="Renew now" value={`₹${activePlan.price}`} onClick={() => push({ name: "checkout", planCode: activePlan.code })} />
        <ListRow icon="crown" label="Change plan" onClick={() => push({ name: "plans" })} />
        <ListRow icon="card" label="Payment history" onClick={() => push({ name: "payments" })} />
        <ListRow icon="close" label="Cancel auto-renewal" onClick={cancelSubscription} danger />
      </div>

      <div className="mt-4 px-4">
        <div className="rounded-2xl border border-line bg-surface2/40 p-4">
          <p className="text-[11.5px] font-semibold">Subscription timeline</p>
          <div className="mt-3 space-y-3">
            {[
              ["Started", user.subStartedAt],
              ["Renews / expires", user.subExpiresAt],
            ].map(([label, value]) => (
              <div key={label as string} className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-gold" />
                <span className="flex-1 text-[11.5px] text-muted">{label as string}</span>
                <span className="text-[11.5px]">
                  {value
                    ? new Date(value as string).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                    : "—"}
                </span>
              </div>
            ))}
          </div>
          <p className="mt-3 text-[10px] leading-relaxed text-muted">
            After expiry premium previews lock again, but designs already saved to your gallery stay with you.
            A reminder is sent 3 days before expiry.
          </p>
        </div>
        <button
          type="button"
          onClick={resetSubscription}
          className="tap mt-3 w-full rounded-2xl border border-dashed border-line py-2.5 text-[11px] text-muted"
        >
          Demo control · reset to free account
        </button>
      </div>
    </div>
  );
}

export function PaymentsScreen() {
  const { payments, back, data } = useApp();
  const [filter, setFilter] = useState<"all" | "success" | "failed">("all");
  const list = payments.filter((p) => (filter === "all" ? true : p.status === filter));
  const spent = payments.filter((p) => p.status === "success").reduce((a, b) => a + b.total, 0);

  return (
    <div className="anim-screen pb-8">
      <TopBar title="Payment history" subtitle={`₹${spent.toFixed(0)} paid in total`} onBack={back} />
      <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 py-3">
        {(["all", "success", "failed"] as const).map((f) => (
          <Chip key={f} active={filter === f} tone="gold" onClick={() => setFilter(f)}>
            {f === "all" ? "All transactions" : f === "success" ? "Successful" : "Failed / pending"}
          </Chip>
        ))}
      </div>

      {list.length === 0 ? (
        <EmptyState icon="card" title="No transactions yet" subtitle="Your invoices will appear here." />
      ) : (
        <div className="space-y-2.5 px-4">
          {list.map((p) => (
            <div key={p.id} className="rounded-2xl border border-line bg-surface2/40 p-4">
              <div className="flex items-start gap-3">
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                    p.status === "success" ? "bg-jade/15 text-jade" : "bg-rose/15 text-rose"
                  }`}
                >
                  <Icon name={p.status === "success" ? "check" : "close"} className="h-4 w-4" strokeWidth={2.4} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-semibold">
                    {data.plans.find((x) => x.code === p.planCode)?.name ?? p.planCode}
                  </p>
                  <p className="text-[10.5px] text-muted">
                    {new Date(p.createdAt).toLocaleString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                  <p className="mt-1 text-[10px] text-muted">
                    {p.method} · Ref {p.gatewayRef}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-display text-[15px] font-semibold">₹{p.total.toFixed(0)}</p>
                  <p className="text-[9.5px] text-muted">incl. ₹{p.tax.toFixed(0)} GST</p>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-line/60 pt-2.5">
                <span className="text-[10.5px] text-muted">Invoice {p.invoiceNo}</span>
                <span className="flex gap-3">
                  {p.status !== "success" ? (
                    <button type="button" className="tap text-[11px] font-semibold text-gold">
                      Retry
                    </button>
                  ) : null}
                  <button type="button" className="tap text-[11px] font-semibold text-gold">
                    Download PDF
                  </button>
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
