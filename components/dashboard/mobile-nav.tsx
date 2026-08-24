"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { usePathname } from "next/navigation";

import {
  ArrowLeftRight,
  ChartNoAxesCombined,
  LayoutDashboard,
  Settings,
  WalletCards,
  X,
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

interface MobileNavProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function MobileNav({
  open,
  setOpen,
}: MobileNavProps) {
  const pathname = usePathname();

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="
              fixed inset-0 z-[60]
              bg-black/70
              backdrop-blur-sm
              lg:hidden
            "
          />

          {/* Drawer */}
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{
              type: "spring",
              stiffness: 350,
              damping: 35,
            }}
            className="
              fixed
              inset-y-0
              left-0
              z-[70]
              flex
              w-[285px]
              flex-col
              border-r
              border-white/[0.07]
              bg-[#070908]
              shadow-2xl
              lg:hidden
            "
          >
            {/* Header */}
            <div className="flex h-[76px] items-center justify-between border-b border-white/[0.06] px-5">
              <Link
                href="/"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3"
              >
                <div
                  className="
                    flex h-9 w-9
                    items-center justify-center
                    rounded-xl
                    border border-white/[0.08]
                    bg-white/[0.04]
                  "
                >
                  <Image
                    src="/assets/logo.svg"
                    alt="BillFusion"
                    width={26}
                    height={26}
                  />
                </div>

                <div>
                  <div className="text-sm font-semibold text-white">
                    Bill<span className="text-[#00A67E]">Fusion</span>
                  </div>

                  <div className="mt-0.5 text-[9px] uppercase tracking-[0.2em] text-white/30">
                    Finance smarter
                  </div>
                </div>
              </Link>

              {/* Close */}
              <button
                onClick={() => setOpen(false)}
                aria-label="Close navigation"
                className="
                  flex h-9 w-9
                  items-center justify-center
                  rounded-xl
                  border border-white/[0.07]
                  bg-white/[0.03]
                  text-white/40
                  transition
                  hover:bg-white/[0.06]
                  hover:text-white
                "
              >
                <X size={18} />
              </button>
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto px-4 py-6">

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
                      onClick={() => setOpen(false)}
                    >
                      <motion.div
                        whileTap={{ scale: 0.98 }}
                        className={`
                          relative
                          flex items-center gap-3
                          rounded-xl
                          px-3 py-3
                          text-sm
                          transition-all
                          ${
                            active
                              ? "bg-[#00A67E]/10 text-[#00A67E]"
                              : "text-white/45 hover:bg-white/[0.04] hover:text-white"
                          }
                        `}
                      >
                        {/* Active indicator */}
                        {active && (
                          <motion.div
                            layoutId="mobile-active-nav"
                            className="
                              absolute
                              left-0
                              h-5
                              w-[2px]
                              rounded-full
                              bg-[#00A67E]
                            "
                          />
                        )}

                        <Icon size={18} />

                        <span>{item.name}</span>
                      </motion.div>
                    </Link>
                  );
                })}
              </nav>

              {/* Budget preview */}
              <div
                className="
                  mt-8
                  rounded-2xl
                  border border-white/[0.06]
                  bg-white/[0.025]
                  p-4
                "
              >
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-xs text-white/40">
                    Monthly budget
                  </span>

                  <span className="text-xs font-medium text-[#00A67E]">
                    72%
                  </span>
                </div>

                <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "72%" }}
                    transition={{
                      duration: 0.8,
                      ease: "easeOut",
                    }}
                    className="h-full rounded-full bg-[#00A67E]"
                  />
                </div>

                <p className="mt-2 text-[10px] text-white/25">
                  ₹14,400 of ₹20,000 used
                </p>
              </div>
            </div>

            {/* User */}
            <div className="border-t border-white/[0.06] p-4">
              <div className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.025] p-3">
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: "h-9 w-9",
                    },
                  }}
                />

                <div className="min-w-0">
                  <p className="truncate text-xs font-medium text-white">
                    Your Account
                  </p>

                  <p className="mt-0.5 text-[10px] text-white/30">
                    Personal
                  </p>
                </div>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}