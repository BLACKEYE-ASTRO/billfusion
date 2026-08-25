"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  ArrowLeftRight,
  WalletCards,
  ChartNoAxesCombined,
  Settings,
} from "lucide-react";

const navigation = [
  {
    name: "Overview",
    shortName: "Home",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Transactions",
    shortName: "Transactions",
    href: "/dashboard/transactions",
    icon: ArrowLeftRight,
  },
  {
    name: "Budgets",
    shortName: "Budgets",
    href: "/dashboard/budgets",
    icon: WalletCards,
  },
  {
    name: "Analytics",
    shortName: "Analytics",
    href: "/dashboard/analytics",
    icon: ChartNoAxesCombined,
  },
  {
    name: "Settings",
    shortName: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <nav
      className="
        fixed
        bottom-0
        left-0
        right-0
        z-[70]
        lg:hidden
        border-t
        border-white/[0.08]
        bg-[#070908]/95
        backdrop-blur-2xl
        supports-[backdrop-filter]:bg-[#070908]/80
      "
    >
      {/* Top subtle glow */}
      <div
        className="
          pointer-events-none
          absolute
          -top-px
          left-0
          right-0
          h-px
          bg-gradient-to-r
          from-transparent
          via-[#00A67E]/30
          to-transparent
        "
      />

      <div
        className="
          mx-auto
          flex
          h-[68px]
          max-w-lg
          items-center
          justify-around
          px-2
          pb-[env(safe-area-inset-bottom)]
        "
      >
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
              className="relative flex h-full flex-1 items-center justify-center"
            >
              <motion.div
                whileTap={{ scale: 0.9 }}
                className="
                  relative
                  flex
                  min-w-[56px]
                  flex-col
                  items-center
                  justify-center
                  gap-1
                "
              >
                {/* Active background */}
                <motion.div
                  initial={false}
                  animate={{
                    opacity: active ? 1 : 0,
                    scale: active ? 1 : 0.7,
                  }}
                  transition={{
                    duration: 0.2,
                    ease: "easeOut",
                  }}
                  className="
                    absolute
                    top-1
                    h-8
                    w-12
                    rounded-xl
                    bg-[#00A67E]/10
                  "
                />

                {/* Active glow */}
                {active && (
                  <motion.div
                    layoutId="mobile-nav-glow"
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 35,
                    }}
                    className="
                      absolute
                      -top-0.5
                      h-[2px]
                      w-6
                      rounded-full
                      bg-[#00A67E]
                      shadow-[0_0_12px_rgba(0,166,126,0.7)]
                    "
                  />
                )}

                {/* Icon */}
                <motion.div
                  animate={{
                    y: active ? -1 : 0,
                    scale: active ? 1.05 : 1,
                  }}
                  transition={{
                    duration: 0.2,
                  }}
                  className={`
                    relative
                    z-10
                    flex
                    h-8
                    w-12
                    items-center
                    justify-center
                    rounded-xl
                    transition-colors
                    ${
                      active
                        ? "text-[#00A67E]"
                        : "text-white/35"
                    }
                  `}
                >
                  <Icon
                    size={19}
                    strokeWidth={active ? 2.2 : 1.8}
                  />
                </motion.div>

                {/* Label */}
                <span
                  className={`
                    relative
                    z-10
                    text-[9px]
                    font-medium
                    transition-colors
                    ${
                      active
                        ? "text-[#00A67E]"
                        : "text-white/30"
                    }
                  `}
                >
                  {item.shortName}
                </span>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}