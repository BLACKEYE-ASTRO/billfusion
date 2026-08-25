"use client";

import { motion } from "motion/react";

import DashboardSidebar from "@/components/dashboard/sidebar";
import MobileNav from "@/components/dashboard/mobile-nav";
import DashboardHeader from "@/components/dashboard/dashboard-header";

export default function DashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#050706] text-white">
      {/* Desktop Sidebar */}
      <DashboardSidebar />

      {/* Mobile Bottom Navigation */}
      <MobileNav />

      {/* Main Content */}
      <main className="lg:pl-[260px]">
        {/* Header */}
        <DashboardHeader />

        {/* Page Content */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="
            mx-auto
            max-w-[1600px]
            p-4
            pb-24
            sm:p-6
            sm:pb-24
            lg:p-8
            lg:pb-8
          "
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}