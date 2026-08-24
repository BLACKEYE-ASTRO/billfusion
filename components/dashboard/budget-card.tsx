"use client";

import { motion } from "motion/react";
import {
  ShoppingBag,
  Home,
  Utensils,
  Car,
} from "lucide-react";

const budgets = [
  {
    name: "Shopping",
    amount: "₹4,200",
    limit: "₹6,000",
    percentage: 70,
    icon: ShoppingBag,
  },
  {
    name: "Food",
    amount: "₹3,100",
    limit: "₹4,000",
    percentage: 77,
    icon: Utensils,
  },
  {
    name: "Transport",
    amount: "₹2,100",
    limit: "₹3,500",
    percentage: 60,
    icon: Car,
  },
];

export default function BudgetCard() {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 sm:p-6">

      <div className="flex items-center justify-between">

        <div>
          <p className="text-sm font-medium">
            Budgets
          </p>

          <p className="mt-1 text-xs text-white/30">
            Monthly spending limits
          </p>
        </div>

        <Home
          size={18}
          className="text-white/25"
        />

      </div>

      <div className="mt-6 space-y-5">

        {budgets.map((budget) => {

          const Icon = budget.icon;

          return (
            <div key={budget.name}>

              <div className="mb-2 flex items-center justify-between">

                <div className="flex items-center gap-2">

                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.05]">
                    <Icon size={14} />
                  </div>

                  <span className="text-xs text-white/60">
                    {budget.name}
                  </span>

                </div>

                <span className="text-xs text-white/40">
                  {budget.amount} / {budget.limit}
                </span>

              </div>

              <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">

                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${budget.percentage}%`,
                  }}
                  transition={{
                    duration: 0.8,
                    ease: "easeOut",
                  }}
                  className="h-full rounded-full bg-[#00A67E]"
                />

              </div>

            </div>
          );
        })}

      </div>

      <button className="mt-6 w-full rounded-xl border border-white/[0.07] py-2.5 text-xs text-white/50 transition hover:bg-white/[0.04] hover:text-white">
        View all budgets
      </button>

    </div>
  );
}