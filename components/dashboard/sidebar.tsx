"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";

import {
  LayoutDashboard,
  ArrowLeftRight,
  WalletCards,
  ChartNoAxesCombined,
  Settings,
  LogOut,
  Plus,
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

export default function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-[260px] border-r border-white/[0.06] bg-[#070908] lg:block">

      <div className="flex h-full flex-col">

        {/* Logo */}

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
                Bill<span className="text-[#00A67E]">Fusion</span>
              </div>

              <div className="text-[9px] uppercase tracking-[0.2em] text-white/30">
                Finance smarter
              </div>
            </div>
          </Link>

        </div>

        {/* Navigation */}

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

                    <span>
                      {item.name}
                    </span>

                  </motion.div>
                </Link>
              );
            })}

          </nav>

        </div>

        {/* Bottom */}

        <div className="border-t border-white/[0.06] p-4">

          <div className="mb-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">

            <div className="mb-3 flex items-center justify-between">

              <span className="text-xs text-white/40">
                Monthly budget
              </span>

              <span className="text-xs font-medium text-[#00A67E]">
                72%
              </span>

            </div>

            <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">

              <div
                className="h-full rounded-full bg-[#00A67E]"
                style={{ width: "72%" }}
              />

            </div>

            <p className="mt-2 text-[10px] text-white/25">
              ₹14,400 of ₹20,000 used
            </p>

          </div>

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