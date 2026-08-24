"use client";

import { motion } from "motion/react";
import {
    ArrowRight,
    BarChart3,
    Check,
    ChevronRight,
    CircleDollarSign,
    CreditCard,
    TrendingUp,
    Wallet,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

const stats = [
    {
        label: "Total Balance",
        value: "$84,240.32",
        change: "+12.8%",
        icon: Wallet,
    },
    {
        label: "Investments",
        value: "$42,680.12",
        change: "+18.4%",
        icon: TrendingUp,
    },
    {
        label: "Monthly Income",
        value: "$8,420.00",
        change: "+8.2%",
        icon: CircleDollarSign,
    },
];

const chartBars = [35, 48, 42, 58, 52, 68, 62, 76, 69, 84, 78, 94];

export default function Hero() {
    const router = useRouter();
    const { isSignedIn, isLoaded } = useUser();

    const handleExploreDashboard = () => {
        if (!isLoaded) return;

        if (isSignedIn) {
            router.push("/dashboard");
        } else {
            router.push("/login");
        }
    };

    return (
        <section className="relative min-h-screen overflow-hidden bg-[#050505] text-white">
            {/* Background */}
            <div className="pointer-events-none absolute inset-0">
                {/* Grid */}
                <div
                    className="absolute inset-0 opacity-[0.045]"
                    style={{
                        backgroundImage: `
              linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)
            `,
                        backgroundSize: "48px 48px",
                    }}
                />

                {/* Glow */}
                <motion.div
                    className="absolute left-1/2 top-[20%] h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-emerald-500/10 blur-[140px]"
                    animate={{
                        scale: [1, 1.12, 1],
                        opacity: [0.35, 0.55, 0.35],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />

                <div className="absolute left-[-15%] top-[40%] h-[400px] w-[400px] rounded-full bg-blue-500/[0.06] blur-[120px]" />

                <div className="absolute right-[-15%] top-[30%] h-[450px] w-[450px] rounded-full bg-purple-500/[0.05] blur-[140px]" />
            </div>

            <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-5 pb-20 pt-28 sm:px-8 lg:px-10 lg:pt-36">
                {/* Top badge */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                        duration: 0.7,
                        ease: [0.22, 1, 0.36, 1],
                    }}
                    className="mx-auto mb-8"
                >
                    <div className="group flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/[0.035] px-3 py-1.5 backdrop-blur-xl">
                        <span className="relative flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                        </span>

                        <span className="text-xs font-medium tracking-wide text-white/60">
                            Your money, visualized beautifully
                        </span>

                        <ChevronRight className="h-3.5 w-3.5 text-white/30 transition-transform duration-300 group-hover:translate-x-0.5" />
                    </div>
                </motion.div>

                {/* Heading */}
                <div className="mx-auto max-w-5xl text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 35, filter: "blur(8px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        transition={{
                            duration: 0.9,
                            delay: 0.08,
                            ease: [0.22, 1, 0.36, 1],
                        }}
                        className="text-balance text-5xl font-semibold leading-[0.98] tracking-[-0.055em] sm:text-6xl md:text-7xl lg:text-[88px]"
                    >
                        Take control of your{" "}
                        <span className="relative inline-block">
                            <span className="bg-gradient-to-r from-emerald-300 via-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                                money.
                            </span>

                            <motion.span
                                className="absolute -bottom-1 left-0 h-px w-full bg-gradient-to-r from-transparent via-emerald-400 to-transparent"
                                initial={{ scaleX: 0, opacity: 0 }}
                                animate={{ scaleX: 1, opacity: 1 }}
                                transition={{
                                    delay: 0.9,
                                    duration: 1,
                                    ease: [0.22, 1, 0.36, 1],
                                }}
                            />
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                            duration: 0.7,
                            delay: 0.25,
                            ease: [0.22, 1, 0.36, 1],
                        }}
                        className="mx-auto mt-7 max-w-2xl text-base leading-7 text-white/45 sm:text-lg"
                    >
                        Track your income, expenses, savings and investments in one
                        intelligent dashboard. Turn complicated financial data into
                        decisions you can actually understand.
                    </motion.p>

                    {/* CTA */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                            duration: 0.7,
                            delay: 0.38,
                            ease: [0.22, 1, 0.36, 1],
                        }}
                        className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
                    >
                        <motion.button
                            whileHover={{
                                y: -2,
                                scale: 1.015,
                            }}
                            whileTap={{
                                scale: 0.98,
                            }}
                            transition={{
                                type: "spring",
                                stiffness: 400,
                                damping: 25,
                            }}
                            className="group relative flex h-12 items-center gap-2 overflow-hidden rounded-xl bg-emerald-400 px-6 text-sm font-semibold text-black shadow-[0_0_35px_rgba(52,211,153,0.15)]"
                            onClick={() => router.push("/login")}
                        >
                            <span className="relative z-10">Start visualizing</span>

                            <ArrowRight className="relative z-10 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />

                            <span className="absolute inset-0 -translate-x-full bg-white/25 transition-transform duration-500 group-hover:translate-x-0" />
                        </motion.button>

                        <motion.button
                            whileHover={{
                                y: -2,
                                backgroundColor: "rgba(255,255,255,0.07)",
                            }}
                            whileTap={{
                                scale: 0.98,
                            }}
                            transition={{
                                type: "spring",
                                stiffness: 400,
                                damping: 25,
                            }}
                            className="flex h-12 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.025] px-6 text-sm font-medium text-white/75 backdrop-blur-xl "
                            onClick={handleExploreDashboard}
                        >
                            <BarChart3 className="h-4 w-4 text-white/50" />
                            Explore dashboard
                        </motion.button>
                    </motion.div>
                </div>

                {/* Dashboard */}
                <motion.div
                    initial={{
                        opacity: 0,
                        y: 80,
                        scale: 0.94,
                        rotateX: 8,
                    }}
                    animate={{
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        rotateX: 0,
                    }}
                    transition={{
                        duration: 1.15,
                        delay: 0.5,
                        ease: [0.16, 1, 0.3, 1],
                    }}
                    style={{
                        perspective: "1200px",
                    }}
                    className="relative mx-auto mt-20 w-full max-w-6xl"
                >
                    {/* Dashboard glow */}
                    <div className="absolute -inset-10 -z-10 rounded-[40px] bg-emerald-500/[0.07] blur-[80px]" />

                    {/* Floating card - balance */}
                    <motion.div
                        initial={{ opacity: 0, x: -35, y: 20 }}
                        animate={{
                            opacity: 1,
                            x: 0,
                            y: [0, -8, 0],
                        }}
                        transition={{
                            opacity: {
                                duration: 0.7,
                                delay: 1,
                            },
                            x: {
                                duration: 0.7,
                                delay: 1,
                                ease: [0.22, 1, 0.36, 1],
                            },
                            y: {
                                duration: 5,
                                repeat: Infinity,
                                ease: "easeInOut",
                            },
                        }}
                        className="absolute -left-4 top-[24%] z-20 hidden w-48 rounded-2xl border border-white/10 bg-[#0d0e0e]/90 p-4 shadow-2xl backdrop-blur-2xl lg:block"
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-[11px] text-white/40">
                                Monthly growth
                            </span>

                            <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
                        </div>

                        <div className="mt-2 text-xl font-semibold">+18.42%</div>

                        <div className="mt-3 flex items-end gap-1">
                            {[30, 45, 35, 55, 48, 65, 58, 80].map((height, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ height: 0 }}
                                    animate={{ height }}
                                    transition={{
                                        delay: 1.1 + index * 0.05,
                                        duration: 0.5,
                                        ease: [0.22, 1, 0.36, 1],
                                    }}
                                    className="flex-1 rounded-sm bg-emerald-400/50"
                                />
                            ))}
                        </div>
                    </motion.div>

                    {/* Floating card - income */}
                    <motion.div
                        initial={{ opacity: 0, x: 35, y: 20 }}
                        animate={{
                            opacity: 1,
                            x: 0,
                            y: [0, 8, 0],
                        }}
                        transition={{
                            opacity: {
                                duration: 0.7,
                                delay: 1.1,
                            },
                            x: {
                                duration: 0.7,
                                delay: 1.1,
                                ease: [0.22, 1, 0.36, 1],
                            },
                            y: {
                                duration: 5.5,
                                repeat: Infinity,
                                ease: "easeInOut",
                            },
                        }}
                        className="absolute -right-5 top-[42%] z-20 hidden w-48 rounded-2xl border border-white/10 bg-[#0d0e0e]/90 p-4 shadow-2xl backdrop-blur-2xl lg:block"
                    >
                        <div className="flex items-center gap-2">
                            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-400/10">
                                <CircleDollarSign className="h-3.5 w-3.5 text-emerald-400" />
                            </div>

                            <span className="text-[11px] text-white/40">
                                Savings rate
                            </span>
                        </div>

                        <div className="mt-3 text-xl font-semibold">32.8%</div>

                        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/5">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: "68%" }}
                                transition={{
                                    delay: 1.5,
                                    duration: 1,
                                    ease: [0.22, 1, 0.36, 1],
                                }}
                                className="h-full rounded-full bg-emerald-400"
                            />
                        </div>
                    </motion.div>

                    {/* Main dashboard */}
                    <div className="relative overflow-hidden rounded-[24px] border border-white/10 bg-[#0b0c0c] shadow-[0_30px_100px_rgba(0,0,0,0.55)]">
                        {/* Browser bar */}
                        <div className="flex h-12 items-center border-b border-white/[0.07] px-4">
                            <div className="flex gap-1.5">
                                <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
                                <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
                                <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
                            </div>

                            <div className="mx-auto hidden rounded-md border border-white/[0.06] bg-white/[0.025] px-24 py-1.5 sm:block">
                                <span className="text-[9px] text-white/20">
                                    app.billfusion.com/dashboard
                                </span>
                            </div>
                        </div>

                        <div className="flex min-h-[500px]">
                            {/* Sidebar */}
                            <aside className="hidden w-48 border-r border-white/[0.06] p-4 md:block">
                                <Link
                                    href="/"
                                    className="group/logo flex items-center gap-2.5 mb-3"
                                >
                                    <motion.div
                                        whileHover={{
                                            scale: 1.05,
                                            rotate: -4,
                                        }}
                                        transition={{
                                            type: "spring",
                                            stiffness: 400,
                                            damping: 18,
                                        }}
                                        className="
                  relative flex h-10 w-10
                  shrink-0
                  items-center justify-center
                  overflow-hidden
                  rounded-xl
                  border border-white/[0.08]
                  bg-white/[0.04]
                  transition-all duration-300
                  group-hover/logo:border-[#00A67E]/30
                  group-hover/logo:bg-[#00A67E]/[0.06]
                "
                                    >
                                        <Image
                                            src="/assets/logo.svg"
                                            alt="BillFusion"
                                            width={100}
                                            height={100}
                                            className="relative z-10 h-7 w-7 object-contain"
                                        />

                                        {/* Logo shine */}
                                        <motion.div
                                            className="
                    pointer-events-none
                    absolute inset-0
                    -translate-x-full
                    bg-gradient-to-r
                    from-transparent
                    via-white/15
                    to-transparent
                  "
                                            whileHover={{
                                                translateX: "100%",
                                            }}
                                            transition={{
                                                duration: 0.6,
                                                ease: "easeInOut",
                                            }}
                                        />
                                    </motion.div>

                                    {/* Brand */}
                                    <div className="flex flex-col">
                                        <div
                                            className="
                    text-[15px]
                    font-semibold
                    leading-tight
                    tracking-[-0.02em]
                    text-white
                  "
                                        >
                                            Bill<span className="text-[#00A67E]">Fusion</span>
                                        </div>

                                        <div
                                            className="
                    mt-0.5
                    text-[8px]
                    font-medium
                    uppercase
                    leading-none
                    tracking-[0.18em]
                    text-white/35
                  "
                                        >
                                            Finance smarter
                                        </div>
                                    </div>
                                </Link>


                                <div className="space-y-1">
                                    {[
                                        ["Overview", true],
                                        ["Transactions", false],
                                        ["Budgets", false],
                                        ["Investments", false],
                                        ["Analytics", false],
                                    ].map(([label, active]) => (
                                        <div
                                            key={label as string}
                                            className={`rounded-lg px-3 py-2 text-[10px] ${active
                                                ? "bg-white/[0.07] text-white"
                                                : "text-white/30"
                                                }`}
                                        >
                                            {label as string}
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-10 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
                                    <div className="text-[9px] text-white/30">
                                        Monthly budget
                                    </div>

                                    <div className="mt-2 text-sm font-semibold">
                                        $4,280
                                    </div>

                                    <div className="mt-2 h-1 rounded-full bg-white/5">
                                        <div className="h-full w-[72%] rounded-full bg-emerald-400" />
                                    </div>

                                    <div className="mt-1 text-[8px] text-white/20">
                                        72% used
                                    </div>
                                </div>
                            </aside>

                            {/* Content */}
                            <main className="flex-1 p-5 sm:p-7">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-[10px] text-white/30">
                                            Monday, August 24
                                        </p>

                                        <h2 className="mt-1 text-lg font-semibold">
                                            Good evening, Akash
                                        </h2>
                                    </div>

                                    <div className="hidden rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-[9px] text-white/40 sm:block">
                                        This month ▾
                                    </div>
                                </div>

                                {/* Stats */}
                                <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
                                    {stats.map((stat, index) => {
                                        const Icon = stat.icon;

                                        return (
                                            <motion.div
                                                key={stat.label}
                                                initial={{
                                                    opacity: 0,
                                                    y: 15,
                                                }}
                                                animate={{
                                                    opacity: 1,
                                                    y: 0,
                                                }}
                                                transition={{
                                                    delay: 1 + index * 0.1,
                                                    duration: 0.6,
                                                    ease: [0.22, 1, 0.36, 1],
                                                }}
                                                className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <span className="text-[9px] text-white/30">
                                                        {stat.label}
                                                    </span>

                                                    <Icon className="h-3.5 w-3.5 text-white/20" />
                                                </div>

                                                <div className="mt-2 text-base font-semibold">
                                                    {stat.value}
                                                </div>

                                                <div className="mt-1 text-[9px] text-emerald-400">
                                                    {stat.change}
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>

                                {/* Chart */}
                                <div className="mt-4 rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-[9px] text-white/30">
                                                Net worth
                                            </p>

                                            <p className="mt-1 text-xl font-semibold">
                                                $84,240.32
                                            </p>
                                        </div>

                                        <div className="rounded-lg bg-emerald-400/10 px-2.5 py-1.5 text-[9px] text-emerald-400">
                                            +12.8%
                                        </div>
                                    </div>

                                    <div className="relative mt-8 h-44">
                                        {/* horizontal lines */}
                                        <div className="absolute inset-0 flex flex-col justify-between">
                                            {[1, 2, 3, 4, 5].map((line) => (
                                                <div
                                                    key={line}
                                                    className="h-px w-full bg-white/[0.035]"
                                                />
                                            ))}
                                        </div>

                                        {/* bars */}
                                        <div className="absolute inset-0 flex items-end justify-between gap-2 px-2">
                                            {chartBars.map((height, index) => (
                                                <motion.div
                                                    key={index}
                                                    initial={{
                                                        height: 0,
                                                    }}
                                                    animate={{
                                                        height: `${height}%`,
                                                    }}
                                                    transition={{
                                                        delay: 1.15 + index * 0.035,
                                                        duration: 0.75,
                                                        ease: [0.22, 1, 0.36, 1],
                                                    }}
                                                    className="group relative w-full max-w-[32px] rounded-t-md bg-gradient-to-t from-emerald-400/10 to-emerald-400/50"
                                                >
                                                    <div className="absolute inset-x-0 top-0 h-px bg-emerald-300/80 opacity-0 transition-opacity group-hover:opacity-100" />
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="mt-3 flex justify-between text-[8px] text-white/20">
                                        <span>Jan</span>
                                        <span>Mar</span>
                                        <span>May</span>
                                        <span>Jul</span>
                                        <span>Aug</span>
                                    </div>
                                </div>

                                {/* Bottom cards */}
                                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                                    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                                        <div className="flex items-center gap-2">
                                            <CreditCard className="h-3.5 w-3.5 text-white/30" />
                                            <span className="text-[9px] text-white/30">
                                                Recent spending
                                            </span>
                                        </div>

                                        <div className="mt-3 flex items-center justify-between">
                                            <span className="text-xs text-white/60">
                                                Shopping
                                            </span>
                                            <span className="text-xs font-medium">
                                                -$284.20
                                            </span>
                                        </div>

                                        <div className="mt-2 flex items-center justify-between">
                                            <span className="text-xs text-white/60">
                                                Investment
                                            </span>
                                            <span className="text-xs font-medium">
                                                -$520.00
                                            </span>
                                        </div>
                                    </div>

                                    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                                        <div className="flex items-center gap-2">
                                            <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
                                            <span className="text-[9px] text-white/30">
                                                Investment performance
                                            </span>
                                        </div>

                                        <div className="mt-3 text-lg font-semibold">
                                            +$7,420.18
                                        </div>

                                        <div className="mt-1 text-[9px] text-emerald-400">
                                            Portfolio is up 21.4%
                                        </div>
                                    </div>
                                </div>
                            </main>
                        </div>

                        {/* Reflection */}
                        <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-white/[0.025] to-transparent" />
                    </div>
                </motion.div>

                {/* Trust line */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{
                        delay: 1.5,
                        duration: 0.8,
                    }}
                    className="mx-auto mt-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-[11px] text-white/25"
                >
                    <span className="flex items-center gap-1.5">
                        <Check className="h-3.5 w-3.5 text-emerald-400/70" />
                        Track everything
                    </span>

                    <span className="flex items-center gap-1.5">
                        <Check className="h-3.5 w-3.5 text-emerald-400/70" />
                        Smart analytics
                    </span>

                    <span className="flex items-center gap-1.5">
                        <Check className="h-3.5 w-3.5 text-emerald-400/70" />
                        Private & secure
                    </span>
                </motion.div>
            </div>
        </section>
    );
}