"use client";

import { Bell, Search } from "lucide-react";
import { UserButton } from "@clerk/nextjs";

export default function DashboardHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-white/[0.06] bg-[#050706]/80 backdrop-blur-xl">

      <div className="flex h-[76px] items-center justify-between px-4 sm:px-6 lg:px-8">

        <div>
          <p className="text-xs text-white/30">
            Monday, August 24
          </p>

          <h1 className="mt-1 text-lg font-semibold">
            Good evening 👋
          </h1>
        </div>

        <div className="flex items-center gap-2">

          <button className="hidden h-10 items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.025] px-3 text-xs text-white/35 transition hover:bg-white/[0.05] sm:flex">
            <Search size={15} />
            Search
          </button>

          <button className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.025] text-white/50 transition hover:bg-white/[0.05]">
            <Bell size={17} />

            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#00A67E]" />
          </button>

          <div className="lg:hidden">
            <UserButton />
          </div>

        </div>

      </div>

    </header>
  );
}