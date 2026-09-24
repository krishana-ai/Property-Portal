"use client";

import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight, BadgeCheck, Heart, Loader2, MessageCircle, ShieldCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  findProfile, safeReturnPath, takePendingAction, useCustomerSession, type CustomerRole,
} from "@/hooks/use-customer-session";
import { saveProperty } from "@/hooks/use-saved-properties";
import { blurProps, IMG } from "@/lib/site/images";
import { cn } from "@/lib/utils";
import { EASE_OUT } from "../motion/reveal";

type Step = "phone" | "otp" | "profile";

/** Demo code until the SMS/WhatsApp OTP provider is connected. */
const DEMO_OTP = "1234";
const RESEND_SECONDS = 30;
const ROLES: { value: CustomerRole; label: string }[] = [
  { value: "Buyer", label: "Buying" },
  { value: "Tenant", label: "Renting" },
  { value: "Owner", label: "Selling / renting out" },
  { value: "Agent", label: "Agent" },
];

const BENEFITS = [
  { icon: Heart, text: "Keep your shortlist on every device" },
  { icon: MessageCircle, text: "Talk to owners and agents, track visits" },
  { icon: BadgeCheck, text: "Post your property free and manage enquiries" },
];

export function CustomerLogin() {
  const router = useRouter();
  const params = useSearchParams();
  const returnTo = safeReturnPath(params.get("next"));
  const { customer, ready, signIn } = useCustomerSession();

  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [name, setName] = useState("");
  const [role, setRole] = useState<CustomerRole>("Buyer");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [resendIn, setResendIn] = useState(0);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Already signed in (e.g. opened /login from a bookmark) → go straight back.
  useEffect(() => {
    if (ready && customer && step === "phone") router.replace(returnTo);
  }, [ready, customer, step, returnTo, router]);

  useEffect(() => {
    if (resendIn <= 0) return;
    const id = setTimeout(() => setResendIn((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [resendIn]);

  function sendOtp(e?: React.FormEvent) {
    e?.preventDefault();
    const digits = phone.replace(/\D/g, "").slice(-10);
    if (!/^[6-9]\d{9}$/.test(digits)) {
      setError("Enter a valid 10-digit mobile number");
      return;
    }
    setError("");
    setBusy(true);
    setTimeout(() => {
      setPhone(digits);
      setBusy(false);
      setOtp(["", "", "", ""]);
      setResendIn(RESEND_SECONDS);
      setStep("otp");
    }, 600);
  }

  function finish(profile: { name: string; role: CustomerRole; since: string }) {
    signIn({ phone, ...profile });
    // Complete the action that sent the user here (e.g. saving a property).
    const pending = takePendingAction();
    if (pending?.type === "save") saveProperty(pending.slug);
    router.replace(returnTo);
  }

  function verify(code = otp.join("")) {
    if (code.length !== 4) {
      setError("Enter the 4-digit code");
      return;
    }
    if (code !== DEMO_OTP) {
      setError("That code doesn't match. Please try again.");
      setOtp(["", "", "", ""]);
      focusDigit(0);
      return;
    }
    setError("");
    setBusy(true);
    setTimeout(() => {
      setBusy(false);
      const known = findProfile(phone);
      if (known) finish(known);
      else setStep("profile");
    }, 500);
  }

  // Focus after React commits the cleared/updated boxes, otherwise focus can be dropped.
  function focusDigit(i: number) {
    requestAnimationFrame(() => otpRefs.current[i]?.focus());
  }

  function onOtpChange(i: number, value: string) {
    const chars = value.replace(/\D/g, "");
    if (!chars) {
      setOtp((o) => o.map((d, j) => (j === i ? "" : d)));
      return;
    }
    // Supports typing one digit or pasting the whole code.
    const next = [...otp];
    chars.split("").slice(0, 4 - i).forEach((c, k) => (next[i + k] = c));
    setOtp(next);
    if (next.every(Boolean)) verify(next.join(""));
    else focusDigit(Math.min(i + chars.length, 3));
  }

  function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    if (name.trim().length < 2) {
      setError("Please tell us your name");
      return;
    }
    setError("");
    finish({ name: name.trim(), role, since: new Date().toISOString() });
  }

  return (
    <div className="mx-auto grid min-h-[calc(100svh-72px)] max-w-7xl gap-10 px-4 pb-32 pt-28 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-8 lg:pb-16">
      {/* Visual side */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, ease: EASE_OUT }}
        className="relative hidden h-[640px] overflow-hidden rounded-[36px] lg:block"
      >
        <Image src={IMG.heroHawaMahal} {...blurProps(IMG.heroHawaMahal)} alt="" fill priority sizes="50vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/50 to-ink-950/10" />
        <div className="absolute inset-x-0 bottom-0 p-10 text-white">
          <p className="eyebrow text-brass-300">Your Anavrin account</p>
          <h2 className="mt-4 max-w-md font-display text-4xl leading-[1.1]">One login for searching, shortlisting and selling in Jaipur.</h2>
          <ul className="mt-8 space-y-3">
            {BENEFITS.map((b, i) => (
              <motion.li
                key={b.text}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.1, duration: 0.6, ease: EASE_OUT }}
                className="flex items-center gap-3 text-sm text-white/85"
              >
                <span className="grid h-8 w-8 place-items-center rounded-full bg-white/10 text-brass-300"><b.icon className="h-4 w-4" /></span>
                {b.text}
              </motion.li>
            ))}
          </ul>
        </div>
      </motion.div>

      {/* Form side */}
      <div className="mx-auto w-full max-w-md">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.35, ease: EASE_OUT }}
          >
            {step === "phone" && (
              <form onSubmit={sendOtp} noValidate>
                <p className="eyebrow text-brass-700">Log in or sign up</p>
                <h1 className="mt-3 font-display text-4xl leading-tight text-ink-900">Welcome to Anavrin</h1>
                <p className="mt-3 text-ink-600">Enter your mobile number. We&apos;ll send a one-time code — no password needed.</p>
                <label htmlFor="mobile" className="mt-8 block text-sm font-medium text-ink-900">Mobile number</label>
                <div className={cn("mt-2 flex h-14 items-center overflow-hidden rounded-2xl border bg-white transition focus-within:border-ink-900", error ? "border-rose-400" : "border-ink-900/15")}>
                  <span className="flex h-full items-center border-r border-ink-900/10 px-4 text-sm font-medium text-ink-700">+91</span>
                  <input
                    id="mobile"
                    value={phone}
                    onChange={(e) => { setPhone(e.target.value.replace(/[^\d ]/g, "").slice(0, 12)); setError(""); }}
                    inputMode="numeric"
                    autoComplete="tel-national"
                    autoFocus
                    placeholder="98765 43210"
                    className="h-full flex-1 bg-transparent px-4 text-lg tracking-wide outline-none"
                  />
                </div>
                <ErrorText error={error} />
                <SubmitButton busy={busy}>Get OTP</SubmitButton>
                <p className="mt-6 text-xs leading-relaxed text-ink-600">
                  By continuing you agree to our Terms and Privacy Policy. We never share your number without your consent.
                </p>
              </form>
            )}

            {step === "otp" && (
              <form onSubmit={(e) => { e.preventDefault(); verify(); }} noValidate>
                <button type="button" onClick={() => { setStep("phone"); setError(""); }} className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-ink-600 hover:text-ink-900">
                  <ArrowLeft className="h-4 w-4" /> Change number
                </button>
                <h1 className="font-display text-4xl leading-tight text-ink-900">Enter the code</h1>
                <p className="mt-3 text-ink-600">Sent by SMS to <span className="font-semibold text-ink-900">+91 {phone.slice(0, 5)} {phone.slice(5)}</span></p>
                <div className="mt-8 flex gap-3">
                  {otp.map((d, i) => (
                    <input
                      key={i}
                      ref={(el) => { otpRefs.current[i] = el; }}
                      value={d}
                      onChange={(e) => onOtpChange(i, e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Backspace" && !otp[i] && i > 0) otpRefs.current[i - 1]?.focus(); }}
                      inputMode="numeric"
                      autoComplete={i === 0 ? "one-time-code" : "off"}
                      // Steps animate in, so focus on mount rather than when `step` changes.
                      autoFocus={i === 0}
                      aria-label={`Digit ${i + 1}`}
                      maxLength={4}
                      className={cn("h-16 w-16 rounded-2xl border bg-white text-center text-2xl font-semibold outline-none transition focus:border-ink-900 focus:ring-4 focus:ring-brass-500/20", error ? "border-rose-400" : "border-ink-900/15")}
                    />
                  ))}
                </div>
                <ErrorText error={error} />
                <p className="mt-4 text-sm text-ink-600">
                  {resendIn > 0 ? (
                    <>Resend code in <span className="tabular-nums">0:{String(resendIn).padStart(2, "0")}</span></>
                  ) : (
                    <button type="button" onClick={() => sendOtp()} className="font-semibold text-brass-700 hover:underline">Resend code</button>
                  )}
                </p>
                <p className="mt-2 rounded-xl bg-sky-50 px-3 py-2 text-xs text-sky-800">Demo mode: use code <strong>{DEMO_OTP}</strong></p>
                <SubmitButton busy={busy}>Verify & continue</SubmitButton>
              </form>
            )}

            {step === "profile" && (
              <form onSubmit={saveProfile} noValidate>
                <p className="eyebrow text-brass-700">Almost done</p>
                <h1 className="mt-3 font-display text-4xl leading-tight text-ink-900">Tell us about you</h1>
                <p className="mt-3 text-ink-600">So sellers know who&apos;s enquiring. You can change this later.</p>
                <label htmlFor="name" className="mt-8 block text-sm font-medium text-ink-900">Your name</label>
                <input
                  id="name"
                  value={name}
                  onChange={(e) => { setName(e.target.value); setError(""); }}
                  autoComplete="name"
                  autoFocus
                  className="mt-2 h-14 w-full rounded-2xl border border-ink-900/15 bg-white px-4 text-base outline-none transition focus:border-ink-900"
                />
                <fieldset className="mt-6">
                  <legend className="text-sm font-medium text-ink-900">I&apos;m here for</legend>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    {ROLES.map((r) => (
                      <button key={r.value} type="button" aria-pressed={role === r.value} onClick={() => setRole(r.value)} className={cn("rounded-xl border px-3 py-3 text-sm font-medium transition", role === r.value ? "border-ink-900 bg-ink-900 text-white" : "border-ink-900/12 bg-white hover:border-ink-900/40")}>
                        {r.label}
                      </button>
                    ))}
                  </div>
                </fieldset>
                <ErrorText error={error} />
                <SubmitButton busy={false}>Create account</SubmitButton>
              </form>
            )}
          </motion.div>
        </AnimatePresence>

        <p className="mt-10 flex items-start gap-2 border-t border-ink-900/10 pt-6 text-xs leading-relaxed text-ink-600">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
          <span>
            Anavrin will never ask for your OTP on a call or WhatsApp. Browsing is always free —{" "}
            <Link href={returnTo} className="font-medium text-ink-900 underline underline-offset-4">continue without logging in</Link>.
          </span>
        </p>
      </div>
    </div>
  );
}

function ErrorText({ error }: { error: string }) {
  return (
    <AnimatePresence>
      {error && (
        <motion.p role="alert" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-2 text-sm text-rose-600">
          {error}
        </motion.p>
      )}
    </AnimatePresence>
  );
}

function SubmitButton({ busy, children }: { busy: boolean; children: React.ReactNode }) {
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      type="submit"
      disabled={busy}
      className="group mt-6 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-ink-900 font-semibold text-white transition hover:bg-ink-800 disabled:opacity-60"
    >
      {busy ? <Loader2 className="h-5 w-5 animate-spin" /> : <>{children} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" /></>}
    </motion.button>
  );
}
