"use client";

import { motion } from "motion/react";
import {
  ArrowUpRight,
  Eye,
  EyeOff,
} from "lucide-react";
import { useState } from "react";

export default function BalanceCard() {
  const [visible, setVisible] = useState(true);

  return (
    <motion.div
      initial={{
        opacity: 0,
        scale: 0.98,
      }}
      animate={{
        opacity: 1,
        scale: 1,
      }}
      className="
        relative overflow-hidden
        rounded-3xl
        border border-[#00A67E]/20
        bg-gradient-to-br
        from-[#00A67E]/15
        via-[#00A67E]/5
        to-transparent
        p-6
        sm:p-8
      "
    >

      {/* Glow */}

      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#00A67E]/10 blur-3xl" />

      <div className="relative">

        <div className="flex items-center justify-between">

          <div>

            <p className="text-xs text-white/40">
              Total balance
            </p>

            <div className="mt-3 flex items-center gap-3">

              <h3 className="text-4xl font-semibold tracking-tight">
                {visible ? "₹84,920.00" : "••••••••"}
              </h3>

              <button
                onClick={() => setVisible(!visible)}
                className="text-white/30 transition hover:text-white"
              >
                {visible ? (
                  <Eye size={18} />
                ) : (
                  <EyeOff size={18} />
                )}
              </button>

            </div>

          </div>

          <div className="hidden h-12 w-12 items-center justify-center rounded-2xl bg-[#00A67E] text-black sm:flex">
            <ArrowUpRight size={21} />
          </div>

        </div>

        <div className="mt-8 flex flex-wrap items-center gap-4">

          <div>
            <p className="text-[11px] text-white/30">
              This month
            </p>

            <p className="mt-1 text-sm font-medium text-[#00A67E]">
              +₹8,240
            </p>
          </div>

          <div className="h-8 w-px bg-white/[0.08]" />

          <div>
            <p className="text-[11px] text-white/30">
              Compared to last month
            </p>

            <p className="mt-1 text-sm font-medium">
              +10.4%
            </p>
          </div>

        </div>

      </div>

    </motion.div>
  );
}