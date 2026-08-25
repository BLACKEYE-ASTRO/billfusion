"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { Loader2, ArrowRight, Wallet } from "lucide-react";

export default function OnboardingPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    currency: "INR",
    currencySymbol: "₹",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const currency = e.target.value;

    const symbols: Record<string, string> = {
      INR: "₹",
      USD: "$",
      EUR: "€",
      GBP: "£",
      JPY: "¥",
      AUD: "$",
      CAD: "$",
    };

    setForm({
      currency,
      currencySymbol: symbols[currency] ?? "$",
    });
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/onboarding", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Something went wrong"
        );
      }

      router.replace("/dashboard");
      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );

      setLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#050706] px-4 py-10 text-white">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/10 blur-[140px]" />

        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.6,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="relative w-full max-w-lg"
      >
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] shadow-2xl shadow-emerald-500/10">
            <Wallet className="h-6 w-6 text-emerald-400" />
          </div>
        </div>

        {/* Card */}
        <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-6 shadow-2xl backdrop-blur-xl sm:p-8">
          <div className="mb-8">
            <p className="mb-3 text-sm font-medium text-emerald-400">
              Welcome to BillFusion
            </p>

            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Set up your finances.
            </h1>

            <p className="mt-3 text-sm leading-6 text-white/50">
              Choose your preferred currency. You can change
              this later from settings.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <div>
              <label className="mb-2 block text-sm font-medium text-white/80">
                Currency
              </label>

              <select
                value={form.currency}
                onChange={handleChange}
                disabled={loading}
                className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none transition focus:border-emerald-400/50 focus:bg-white/[0.06]"
              >
                <option
                  value="INR"
                  className="bg-[#0b0d0c]"
                >
                  INR — Indian Rupee ₹
                </option>

                <option
                  value="USD"
                  className="bg-[#0b0d0c]"
                >
                  USD — US Dollar $
                </option>

                <option
                  value="EUR"
                  className="bg-[#0b0d0c]"
                >
                  EUR — Euro €
                </option>

                <option
                  value="GBP"
                  className="bg-[#0b0d0c]"
                >
                  GBP — British Pound £
                </option>

                <option
                  value="JPY"
                  className="bg-[#0b0d0c]"
                >
                  JPY — Japanese Yen ¥
                </option>

                <option
                  value="AUD"
                  className="bg-[#0b0d0c]"
                >
                  AUD — Australian Dollar $
                </option>

                <option
                  value="CAD"
                  className="bg-[#0b0d0c]"
                >
                  CAD — Canadian Dollar $
                </option>
              </select>
            </div>

            {/* Preview */}
            <div className="rounded-2xl border border-white/8 bg-black/20 p-4">
              <p className="text-xs text-white/40">
                Currency preview
              </p>

              <p className="mt-2 text-2xl font-semibold">
                {form.currencySymbol}25,000
              </p>

              <p className="mt-1 text-xs text-white/30">
                Your financial data will use{" "}
                {form.currency}.
              </p>
            </div>

            {error && (
              <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald-400 px-5 text-sm font-semibold text-black transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Setting things up...
                </>
              ) : (
                <>
                  Continue
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-white/30">
          Your financial data belongs to you.
        </p>
      </motion.div>
    </main>
  );
}