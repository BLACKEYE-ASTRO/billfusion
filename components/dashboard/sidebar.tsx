"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { motion } from "motion/react";

import {
  LayoutDashboard,
  ArrowLeftRight,
  WalletCards,
  ChartNoAxesCombined,
  Settings,
} from "lucide-react";

import { UserButton } from "@clerk/nextjs";

const navigation = [
  {
    name: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Transactions",
    href: "/dashboard/transactions",
    icon: ArrowLeftRight,
  },
  {
    name: "Budgets",
    href: "/dashboard/budgets",
    icon: WalletCards,
  },
  {
    name: "Analytics",
    href: "/dashboard/analytics",
    icon: ChartNoAxesCombined,
  },
  {
    name: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

type SidebarData = {
  budget: number;
  spent: number;
  percentage: number;
  currency: string;
  currencySymbol: string;
};

export default function DashboardSidebar() {
  const pathname = usePathname();

  const [sidebarData, setSidebarData] =
    useState<SidebarData | null>(null);

  const [loading, setLoading] = useState(true);

  // --------------------------------------------------
  // FETCH SIDEBAR DATA
  // --------------------------------------------------

  const loadSidebarData = useCallback(async () => {
    try {
      const response = await fetch("/api/sidebar", {
        method: "GET",

        // Important:
        // Don't allow browser/cache to return old data.
        cache: "no-store",

        headers: {
          "Cache-Control": "no-cache",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to load sidebar data"
        );
      }

      setSidebarData(data);
    } catch (error) {
      console.error("SIDEBAR_ERROR:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // --------------------------------------------------
  // INITIAL LOAD + PATH CHANGE
  // --------------------------------------------------

  useEffect(() => {
    loadSidebarData();
  }, [loadSidebarData, pathname]);

  // --------------------------------------------------
  // LISTEN FOR FINANCE UPDATES
  // --------------------------------------------------

  useEffect(() => {
    const handleFinanceUpdate = () => {
      loadSidebarData();
    };

    window.addEventListener(
      "finance-updated",
      handleFinanceUpdate
    );

    return () => {
      window.removeEventListener(
        "finance-updated",
        handleFinanceUpdate
      );
    };
  }, [loadSidebarData]);

  // --------------------------------------------------
  // REFRESH WHEN TAB BECOMES VISIBLE
  // --------------------------------------------------

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        loadSidebarData();
      }
    };

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange
    );

    return () => {
      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );
    };
  }, [loadSidebarData]);

  // --------------------------------------------------
  // DATA
  // --------------------------------------------------

  const budget = sidebarData?.budget ?? 0;
  const spent = sidebarData?.spent ?? 0;
  const percentage = sidebarData?.percentage ?? 0;

  const currencySymbol =
    sidebarData?.currencySymbol ?? "₹";

  // Don't let the progress bar visually overflow.
  const progressWidth = Math.min(
    Math.max(percentage, 0),
    100
  );

  // --------------------------------------------------
  // FORMAT MONEY
  // --------------------------------------------------

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // --------------------------------------------------
  // PROGRESS COLOR
  // --------------------------------------------------

  const progressColor =
    percentage >= 100
      ? "bg-red-400"
      : percentage >= 80
        ? "bg-yellow-400"
        : "bg-[#00A67E]";

  const percentageColor =
    percentage >= 100
      ? "text-red-400"
      : percentage >= 80
        ? "text-yellow-400"
        : "text-[#00A67E]";

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-[260px] border-r border-white/[0.06] bg-[#070908] lg:block">
      <div className="flex h-full flex-col">

        {/* ================================================== */}
        {/* LOGO */}
        {/* ================================================== */}

        <div className="flex h-[76px] items-center border-b border-white/[0.06] px-6">
          <Link
            href="/"
            className="flex items-center gap-3"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04]">
              <Image
                src="/assets/logo.svg"
                alt="BillFusion"
                width={26}
                height={26}
              />
            </div>

            <div>
              <div className="text-sm font-semibold">
                Bill
                <span className="text-[#00A67E]">
                  Fusion
                </span>
              </div>

              <div className="text-[9px] uppercase tracking-[0.2em] text-white/30">
                Finance smarter
              </div>
            </div>
          </Link>
        </div>

        {/* ================================================== */}
        {/* NAVIGATION */}
        {/* ================================================== */}

        <div className="flex-1 px-4 py-6">
          <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/25">
            Workspace
          </p>

          <nav className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;

              const active =
                pathname === item.href ||
                (item.href !== "/dashboard" &&
                  pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                >
                  <motion.div
                    whileHover={{ x: 3 }}
                    className={`relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
                      active
                        ? "bg-[#00A67E]/10 text-[#00A67E]"
                        : "text-white/45 hover:bg-white/[0.04] hover:text-white"
                    }`}
                  >
                    {active && (
                      <motion.div
                        layoutId="active-nav"
                        className="absolute left-0 h-5 w-[2px] rounded-full bg-[#00A67E]"
                      />
                    )}

                    <Icon size={18} />

                    <span>{item.name}</span>
                  </motion.div>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* ================================================== */}
        {/* BOTTOM */}
        {/* ================================================== */}

        <div className="border-t border-white/[0.06] p-4">

          {/* ================================================== */}
          {/* MONTHLY BUDGET */}
          {/* ================================================== */}

          <div className="mb-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">

            <div className="mb-3 flex items-center justify-between">

              <span className="text-xs text-white/40">
                Monthly budget
              </span>

              {loading ? (
                <div className="h-3 w-8 animate-pulse rounded bg-white/[0.08]" />
              ) : budget > 0 ? (
                <span
                  className={`text-xs font-medium ${percentageColor}`}
                >
                  {percentage}%
                </span>
              ) : (
                <span className="text-xs text-white/25">
                  —
                </span>
              )}
            </div>

            {/* ================================================== */}
            {/* PROGRESS BAR */}
            {/* ================================================== */}

            <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
              {loading ? (
                <div className="h-full w-1/3 animate-pulse rounded-full bg-white/[0.08]" />
              ) : (
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${progressWidth}%`,
                  }}
                  transition={{
                    duration: 0.5,
                    ease: "easeOut",
                  }}
                  className={`h-full rounded-full ${progressColor}`}
                />
              )}
            </div>

            {/* ================================================== */}
            {/* AMOUNT */}
            {/* ================================================== */}

            {loading ? (
              <div className="mt-2 h-3 w-32 animate-pulse rounded bg-white/[0.06]" />
            ) : budget > 0 ? (
              <p className="mt-2 text-[10px] text-white/25">
                {currencySymbol}
                {formatAmount(spent)} of{" "}
                {currencySymbol}
                {formatAmount(budget)} used
              </p>
            ) : (
              <p className="mt-2 text-[10px] text-white/25">
                No monthly budgets set
              </p>
            )}
          </div>

          {/* ================================================== */}
          {/* ACCOUNT */}
          {/* ================================================== */}

          <div className="flex items-center justify-between rounded-xl p-2">

            <div className="flex items-center gap-3">

              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "h-9 w-9",
                  },
                }}
              />

              <div>
                <p className="text-xs font-medium">
                  Your Account
                </p>

                <p className="text-[10px] text-white/30">
                  Personal
                </p>
              </div>

            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}