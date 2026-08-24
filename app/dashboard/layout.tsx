"use client";

import { useState } from "react";
import { motion } from "motion/react";

import DashboardSidebar from "@/components/dashboard/sidebar";
import MobileNav from "@/components/dashboard/mobile-nav";
import DashboardHeader from "@/components/dashboard/dashboard-header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#050706] text-white">
      <DashboardSidebar />

      <MobileNav
        open={sidebarOpen}
        setOpen={setSidebarOpen}
      />

      <main className="lg:pl-[260px]">
        <DashboardHeader />

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="mx-auto max-w-[1600px] p-4 sm:p-6 lg:p-8"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}