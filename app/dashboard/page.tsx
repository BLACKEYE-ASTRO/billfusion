"use client";

import { motion } from "motion/react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  CreditCard,
  Plus,
  Wallet,
} from "lucide-react";

import BalanceCard from "@/components/dashboard/balance-card";
import SpendingChart from "@/components/dashboard/spending-chart";
import RecentTransactions from "@/components/dashboard/recent-transactions";
import BudgetCard from "@/components/dashboard/budget-card";

const stats = [
  {
    title: "Total Income",
    value: "₹52,400",
    change: "+12.8%",
    positive: true,
    icon: ArrowDownLeft,
  },
  {
    title: "Total Expenses",
    value: "₹28,640",
    change: "-8.4%",
    positive: true,
    icon: ArrowUpRight,
  },
  {
    title: "Savings",
    value: "₹23,760",
    change: "+18.2%",
    positive: true,
    icon: Wallet,
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">

      {/* Header */}

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">

        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#00A67E]">
            Overview
          </p>

          <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            Your financial command center
          </h2>

          <p className="mt-2 max-w-xl text-sm text-white/35">
            Track your money, understand your spending and stay ahead of
            your financial goals.
          </p>
        </div>

        <button
          className="
            flex items-center justify-center gap-2
            rounded-xl
            bg-[#00A67E]
            px-4 py-2.5
            text-sm font-semibold text-black
            transition
            hover:bg-[#00b889]
          "
        >
          <Plus size={17} />
          Add transaction
        </button>

      </div>

      {/* Main balance */}

      <BalanceCard />

      {/* Stats */}

      <div className="grid gap-4 md:grid-cols-3">

        {stats.map((stat, index) => {

          const Icon = stat.icon;

          return (
            <motion.div
              key={stat.title}
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: index * 0.08,
              }}
              className="
                rounded-2xl
                border border-white/[0.07]
                bg-white/[0.025]
                p-5
              "
            >

              <div className="flex items-center justify-between">

                <p className="text-xs text-white/35">
                  {stat.title}
                </p>

                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.05]">
                  <Icon
                    size={17}
                    className="text-[#00A67E]"
                  />
                </div>

              </div>

              <div className="mt-5 flex items-end justify-between">

                <p className="text-2xl font-semibold">
                  {stat.value}
                </p>

                <span className="text-xs font-medium text-[#00A67E]">
                  {stat.change}
                </span>

              </div>

            </motion.div>
          );
        })}

      </div>

      {/* Charts */}

      <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">

        <SpendingChart />

        <BudgetCard />

      </div>

      {/* Transactions */}

      <RecentTransactions />

    </div>
  );
}