"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  Building,
  ShieldCheck,
  BarChart3,
  Users,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppDispatch } from "@/lib/redux/hooks";
import { login } from "@/lib/redux/slices/auth-slice";

const DEMO_OTP = "1234";

const HIGHLIGHTS = [
  { icon: Building, text: "Manage 12,400+ listings, properties & townships from one place" },
  { icon: ShieldCheck, text: "RERA, KYC & document verification with a full audit trail" },
  { icon: BarChart3, text: "Real-time revenue, leads and state-wise performance analytics" },
  { icon: Users, text: "Role-based access for moderators, support and finance teams" },
];

export function LoginForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [step, setStep] = useState<"identifier" | "otp">("identifier");
  const [identifier, setIdentifier] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const otpInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (step === "otp") otpInputRef.current?.focus();
  }, [step]);

  function handleSendOtp(e: FormEvent) {
    e.preventDefault();
    if (!identifier.trim()) return;
    setError("");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep("otp");
    }, 600);
  }

  function handleVerifyOtp(e: FormEvent) {
    e.preventDefault();
    if (otp.trim().length !== 4) {
      setError("Enter the 4-digit code to continue.");
      return;
    }
    setError("");
    setLoading(true);
    setTimeout(() => {
      dispatch(login({ identifier }));
      router.replace("/admin");
    }, 400);
  }

  return (
    <div className="flex min-h-screen bg-white">
      <div className="relative hidden w-[46%] flex-col justify-between overflow-hidden bg-slate-900 px-12 py-12 text-white lg:flex">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, rgba(99,102,241,0.45), transparent 45%), radial-gradient(circle at 80% 70%, rgba(56,189,248,0.35), transparent 50%)",
          }}
        />
        <div className="relative flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary-600">
            <Building className="h-4.5 w-4.5" />
          </div>
          <span className="text-base font-semibold">Anavrin Property</span>
        </div>

        <div className="relative">
          <h1 className="mb-4 text-3xl font-semibold leading-tight">
            Run your real estate marketplace with confidence.
          </h1>
          <p className="mb-8 text-sm text-slate-300">
            The admin console for listings, properties, RERA compliance, transactions and analytics —
            built for teams that need speed and trust.
          </p>
          <ul className="space-y-4">
            {HIGHLIGHTS.map((h, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-slate-200">
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-white/10">
                  <h.icon className="h-3.5 w-3.5" />
                </span>
                {h.text}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs text-slate-400">
          © {new Date().getFullYear()} Anavrin Property. Internal admin access only.
        </p>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-2 lg:hidden">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary-600 text-white">
              <Building className="h-4.5 w-4.5" />
            </div>
            <span className="text-base font-semibold text-slate-900">Anavrin Property</span>
          </div>

          {step === "identifier" ? (
            <>
              <h2 className="mb-1.5 text-xl font-semibold text-slate-900">Sign in to Admin</h2>
              <p className="mb-6 text-sm text-slate-500">
                Enter your work email or mobile number to receive a one-time code.
              </p>
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-600">
                    Email or mobile number
                  </label>
                  <Input
                    autoFocus
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="priya.sharma@anavrinproperty.com"
                  />
                </div>
                {error && <p className="text-xs font-medium text-danger-600">{error}</p>}
                <Button type="submit" className="w-full" loading={loading}>
                  Send OTP
                </Button>
              </form>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => {
                  setStep("identifier");
                  setOtp("");
                  setError("");
                }}
                className="mb-4 flex cursor-pointer items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-700"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Back
              </button>
              <h2 className="mb-1.5 text-xl font-semibold text-slate-900">Enter verification code</h2>
              <p className="mb-6 text-sm text-slate-500">
                We&apos;ve sent a 4-digit code to <span className="font-medium text-slate-700">{identifier}</span>.
                <br />
                <span className="text-slate-400">Demo OTP: {DEMO_OTP}</span>
              </p>
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-600">One-time code</label>
                  <Input
                    ref={otpInputRef}
                    required
                    inputMode="numeric"
                    maxLength={4}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    placeholder="1234"
                    className="text-center text-lg tracking-[0.5em]"
                  />
                </div>
                {error && <p className="text-xs font-medium text-danger-600">{error}</p>}
                <Button type="submit" className="w-full" loading={loading}>
                  {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  Verify &amp; continue
                </Button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
