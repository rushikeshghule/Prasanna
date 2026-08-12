"use client";

import { useEffect, useState } from "react";
import { useApp } from "../app-context";
import { Icon, Img } from "../ui";
import type { Lang } from "@/lib/types";

export function Logo({ size = 64 }: { size?: number }) {
  return (
    <div
      className="relative flex items-center justify-center rounded-[28%] bg-gradient-to-br from-[#2a1f33] to-[#120c19] shadow-[0_18px_40px_-18px_rgba(232,196,104,0.7)]"
      style={{ width: size, height: size }}
    >
      <span className="absolute inset-0 rounded-[28%] border border-gold/40" />
      <span className="absolute inset-1.5 rounded-[26%] border border-gold/15" />
      <span className="gold-text font-display font-bold leading-none" style={{ fontSize: size * 0.38 }}>
        PT
      </span>
    </div>
  );
}

const SLIDES = [
  {
    image:
      "https://images.pexels.com/photos/33101418/pexels-photo-33101418.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=800&h=1000",
    title: "Every design, beautifully organised",
    body: "Clothing and jewellery references sorted into categories, subcategories and studio collections.",
  },
  {
    image:
      "https://images.pexels.com/photos/29038003/pexels-photo-29038003.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=800&h=1000",
    title: "Save, download and share instantly",
    body: "Keep favourites in folders, download HD files, and send them to your tailor on WhatsApp.",
  },
  {
    image:
      "https://images.pexels.com/photos/35108809/pexels-photo-35108809.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=800&h=1000",
    title: "₹100 unlocks the premium library",
    body: "Start with a 3-day free trial. Cancel anytime — free designs always stay free.",
  },
];

export function AuthFlow() {
  const { phase, setPhase } = useApp();

  useEffect(() => {
    if (phase !== "splash") return;
    const id = window.setTimeout(() => setPhase("onboarding"), 2100);
    return () => window.clearTimeout(id);
  }, [phase, setPhase]);

  if (phase === "splash") return <Splash />;
  if (phase === "onboarding") return <Onboarding />;
  if (phase === "language") return <LanguagePick />;
  if (phase === "login") return <Login />;
  return <Otp />;
}

function Splash() {
  const { data } = useApp();
  return (
    <div className="relative flex h-full flex-col items-center justify-center overflow-hidden bg-ink">
      <div className="absolute inset-0 opacity-40">
        <Img
          src="https://images.pexels.com/photos/20790057/pexels-photo-20790057.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=800&h=1400"
          alt=""
          className="h-full w-full"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/85 to-ink" />
      <div className="anim-pop relative flex flex-col items-center">
        <Logo size={82} />
        <h1 className="mt-5 font-display text-[30px] font-semibold tracking-tight">
          Prasanna <span className="gold-text">Trends</span>
        </h1>
        <p className="mt-1 text-[12px] tracking-[0.32em] text-muted uppercase">{data.settings.tagline}</p>
      </div>
      <div className="absolute bottom-16 w-40 overflow-hidden rounded-full bg-surface2">
        <div className="anim-bar h-1 rounded-full bg-gradient-to-r from-gold to-rose" />
      </div>
      <p className="absolute bottom-8 text-[10px] text-muted/70">v{data.settings.currentVersion}</p>
    </div>
  );
}

function Onboarding() {
  const { setPhase } = useApp();
  const [i, setI] = useState(0);
  const slide = SLIDES[i];

  return (
    <div className="relative flex h-full flex-col bg-ink">
      <div className="relative h-[58%] overflow-hidden">
        <Img key={slide.image} src={slide.image} alt="" className="h-full w-full" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/25 to-transparent" />
        <button
          type="button"
          onClick={() => setPhase("language")}
          className="tap absolute right-4 top-5 rounded-full border border-white/20 bg-black/35 px-3.5 py-1.5 text-[11px] font-semibold text-cream backdrop-blur"
        >
          Skip
        </button>
      </div>

      <div className="relative -mt-14 flex flex-1 flex-col px-6">
        <div key={i} className="anim-up">
          <h2 className="font-display text-[26px] font-semibold leading-tight">{slide.title}</h2>
          <p className="mt-3 text-[13px] leading-relaxed text-muted">{slide.body}</p>
        </div>

        <div className="mt-6 flex gap-1.5">
          {SLIDES.map((_, idx) => (
            <span
              key={idx}
              className={`h-1.5 rounded-full transition-all ${
                idx === i ? "w-7 bg-gold" : "w-1.5 bg-line"
              }`}
            />
          ))}
        </div>

        <div className="mt-auto pb-8">
          <button
            type="button"
            onClick={() => (i < SLIDES.length - 1 ? setI(i + 1) : setPhase("language"))}
            className="tap flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-gold to-[#d8a94b] py-3.5 text-[14px] font-bold text-ink"
          >
            {i < SLIDES.length - 1 ? "Next" : "Get started"}
            <Icon name="arrow" className="h-4 w-4" strokeWidth={2.2} />
          </button>
        </div>
      </div>
    </div>
  );
}

function LanguagePick() {
  const { data, setPhase, setLang, lang } = useApp();
  return (
    <div className="flex h-full flex-col bg-ink px-6 pt-14">
      <Logo size={48} />
      <h2 className="mt-6 font-display text-[26px] font-semibold leading-tight">
        Choose your language
      </h2>
      <p className="mt-2 text-[13px] text-muted">
        आप बाद में इसे प्रोफ़ाइल से बदल सकते हैं · तुम्ही नंतर बदलू शकता
      </p>

      <div className="mt-7 space-y-3">
        {data.languages
          .filter((l) => l.isActive)
          .map((l) => {
            const active = lang === l.code;
            return (
              <button
                key={l.code}
                type="button"
                onClick={() => setLang(l.code as Lang)}
                className={`tap flex w-full items-center gap-4 rounded-2xl border px-4 py-3.5 text-left ${
                  active ? "gold-border" : "border-line bg-surface2/60"
                }`}
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-surface3 font-display text-sm font-semibold text-gold">
                  {l.code.toUpperCase()}
                </span>
                <span className="flex-1">
                  <span className="block text-[14px] font-semibold">{l.nativeName}</span>
                  <span className="block text-[11px] text-muted">
                    {l.name} · {l.completion}% translated
                  </span>
                </span>
                <span
                  className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                    active ? "border-gold bg-gold text-ink" : "border-line"
                  }`}
                >
                  {active ? <Icon name="check" className="h-3 w-3" strokeWidth={3} /> : null}
                </span>
              </button>
            );
          })}
      </div>

      <p className="mt-5 flex items-start gap-2 rounded-2xl border border-line bg-surface2/50 p-3 text-[11px] leading-relaxed text-muted">
        <Icon name="globe" className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
        More languages can be added by the admin at any time — the app picks them up without an update.
      </p>

      <div className="mt-auto pb-8">
        <button
          type="button"
          onClick={() => setPhase("login")}
          className="tap w-full rounded-2xl bg-gold py-3.5 text-[14px] font-bold text-ink"
        >
          Continue
        </button>
      </div>
    </div>
  );
}

function Login() {
  const { setPhase, user } = useApp();
  const [mode, setMode] = useState<"mobile" | "email">("mobile");
  const [phone, setPhone] = useState("98765 43210");
  const [email, setEmail] = useState(user.email ?? "");
  const [password, setPassword] = useState("");
  const [agree, setAgree] = useState(true);

  const canContinue = agree && (mode === "mobile" ? phone.replace(/\D/g, "").length >= 10 : email.includes("@"));

  return (
    <div className="flex h-full flex-col bg-ink px-6 pt-12">
      <Logo size={48} />
      <h2 className="mt-6 font-display text-[26px] font-semibold leading-tight">Welcome back</h2>
      <p className="mt-2 text-[13px] text-muted">Log in or create your free account in seconds.</p>

      <div className="mt-6 grid grid-cols-2 gap-1 rounded-2xl border border-line bg-surface2/60 p-1">
        {(["mobile", "email"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={`tap rounded-xl py-2 text-[12.5px] font-semibold ${
              mode === m ? "bg-cream text-ink" : "text-muted"
            }`}
          >
            {m === "mobile" ? "Mobile + OTP" : "Email + password"}
          </button>
        ))}
      </div>

      <div className="mt-5 space-y-3">
        {mode === "mobile" ? (
          <label className="flex items-center gap-3 rounded-2xl border border-line bg-surface2/60 px-4 py-3.5">
            <span className="text-[14px] font-semibold text-muted">+91</span>
            <span className="h-5 w-px bg-line" />
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              inputMode="numeric"
              placeholder="Mobile number"
              className="w-full bg-transparent text-[15px] font-semibold tracking-wide outline-none placeholder:text-muted/60"
            />
          </label>
        ) : (
          <>
            <label className="flex items-center gap-3 rounded-2xl border border-line bg-surface2/60 px-4 py-3.5">
              <Icon name="mail" className="h-4 w-4 text-muted" />
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-transparent text-[14px] outline-none placeholder:text-muted/60"
              />
            </label>
            <label className="flex items-center gap-3 rounded-2xl border border-line bg-surface2/60 px-4 py-3.5">
              <Icon name="lock" className="h-4 w-4 text-muted" />
              <input
                value={password}
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full bg-transparent text-[14px] outline-none placeholder:text-muted/60"
              />
            </label>
          </>
        )}

        <button
          type="button"
          disabled={!canContinue}
          onClick={() => setPhase(mode === "mobile" ? "otp" : "app")}
          className={`tap w-full rounded-2xl py-3.5 text-[14px] font-bold ${
            canContinue ? "bg-gold text-ink" : "bg-surface3 text-muted"
          }`}
        >
          {mode === "mobile" ? "Send OTP" : "Log in"}
        </button>
      </div>

      <div className="my-5 flex items-center gap-3">
        <span className="h-px flex-1 bg-line" />
        <span className="text-[10px] uppercase tracking-widest text-muted">or continue with</span>
        <span className="h-px flex-1 bg-line" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        {[
          { label: "Google", glyph: "G" },
          { label: "Apple", glyph: "" },
        ].map((p) => (
          <button
            key={p.label}
            type="button"
            onClick={() => setPhase("app")}
            className="tap flex items-center justify-center gap-2 rounded-2xl border border-line bg-surface2/60 py-3 text-[13px] font-semibold"
          >
            <span className="font-display text-[15px]">{p.glyph}</span>
            {p.label}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={() => setAgree(!agree)}
        className="mt-6 flex items-start gap-2.5 text-left"
      >
        <span
          className={`mt-0.5 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-[6px] border ${
            agree ? "border-gold bg-gold text-ink" : "border-line"
          }`}
        >
          {agree ? <Icon name="check" className="h-3 w-3" strokeWidth={3} /> : null}
        </span>
        <span className="text-[11px] leading-relaxed text-muted">
          I agree to the <span className="text-gold">Terms &amp; Conditions</span> and{" "}
          <span className="text-gold">Privacy Policy</span>. Consent is recorded with date and device.
        </span>
      </button>

      <p className="mt-auto pb-7 text-center text-[10.5px] text-muted/70">
        Protected by OTP expiry, retry limits and device-session monitoring.
      </p>
    </div>
  );
}

function Otp() {
  const { setPhase } = useApp();
  const [digits, setDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [seconds, setSeconds] = useState(28);
  const [autofilled, setAutofilled] = useState(false);

  useEffect(() => {
    const t = window.setTimeout(() => {
      setDigits(["4", "8", "2", "9", "1", "3"]);
      setAutofilled(true);
    }, 1400);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    if (seconds <= 0) return;
    const id = window.setInterval(() => setSeconds((s) => s - 1), 1000);
    return () => window.clearInterval(id);
  }, [seconds]);

  const complete = digits.every((d) => d !== "");

  return (
    <div className="flex h-full flex-col bg-ink px-6 pt-12">
      <button
        type="button"
        onClick={() => setPhase("login")}
        className="tap flex h-9 w-9 items-center justify-center rounded-full border border-line bg-surface2"
      >
        <Icon name="left" className="h-4 w-4" />
      </button>
      <h2 className="mt-6 font-display text-[26px] font-semibold leading-tight">Verify your number</h2>
      <p className="mt-2 text-[13px] text-muted">
        We sent a 6-digit code to <span className="text-cream">+91 98765 43210</span>
      </p>

      <div className="mt-7 flex gap-2.5">
        {digits.map((d, i) => (
          <div
            key={i}
            className={`flex h-14 flex-1 items-center justify-center rounded-2xl border text-[20px] font-bold ${
              d ? "border-gold/60 bg-gold/10 text-goldsoft" : "border-line bg-surface2/60 text-muted"
            }`}
          >
            {d || "•"}
          </div>
        ))}
      </div>

      {autofilled ? (
        <p className="anim-up mt-3 flex items-center gap-1.5 text-[11px] text-jade">
          <Icon name="check" className="h-3.5 w-3.5" strokeWidth={2.5} /> Code detected from SMS automatically
        </p>
      ) : (
        <p className="mt-3 text-[11px] text-muted">Waiting for SMS…</p>
      )}

      <button
        type="button"
        disabled={!complete}
        onClick={() => setPhase("app")}
        className={`tap mt-6 w-full rounded-2xl py-3.5 text-[14px] font-bold ${
          complete ? "bg-gold text-ink" : "bg-surface3 text-muted"
        }`}
      >
        Verify &amp; continue
      </button>

      <p className="mt-4 text-center text-[11.5px] text-muted">
        {seconds > 0 ? (
          <>
            Resend code in <span className="text-cream">00:{String(seconds).padStart(2, "0")}</span>
          </>
        ) : (
          <span className="text-gold">Resend OTP</span>
        )}
      </p>

      <div className="mt-auto mb-8 rounded-2xl border border-line bg-surface2/50 p-3.5">
        <p className="flex items-start gap-2 text-[11px] leading-relaxed text-muted">
          <Icon name="shield" className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
          OTP expires in 5 minutes. After 5 wrong attempts the number is locked for 30 minutes.
        </p>
      </div>
    </div>
  );
}
