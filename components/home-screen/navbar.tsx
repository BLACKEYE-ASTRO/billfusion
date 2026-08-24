"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { MdArrowOutward } from "react-icons/md";
import { useUser, UserButton } from "@clerk/nextjs";

export default function Navbar() {
  const { isSignedIn, isLoaded } = useUser();

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="fixed left-0 right-0 top-0 z-50 px-4 pt-4 sm:px-6"
    >
      <nav className="mx-auto max-w-6xl">
        <div
          className="
            group relative overflow-hidden
            rounded-2xl
            border border-white/[0.08]
            bg-black/35
            px-4 py-3
            backdrop-blur-2xl
            backdrop-saturate-150
            shadow-[0_8px_40px_rgba(0,0,0,0.25)]
            transition-all duration-500
            hover:border-white/[0.12]
            sm:px-5 sm:py-3.5
          "
        >
          {/* Top reflection */}
          <div
            className="
              pointer-events-none
              absolute inset-x-0 top-0
              h-px
              bg-gradient-to-r
              from-transparent
              via-white/20
              to-transparent
            "
          />

          {/* Green ambient light */}
          <div
            className="
              pointer-events-none
              absolute -left-24 -top-24
              h-40 w-40
              rounded-full
              bg-[#00A67E]/[0.035]
              blur-3xl
            "
          />

          <div className="relative flex items-center justify-between">

            {/* Logo */}
            <Link
              href="/"
              className="group/logo flex items-center gap-2.5"
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

            {/* Right side */}
            {!isLoaded ? (
              /* Loading state */
              <div
                className="
                  h-10 w-10
                  animate-pulse
                  rounded-xl
                  bg-white/[0.08]
                "
              />
            ) : isSignedIn ? (
              /* Logged in */
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 20,
                }}
                className="
                  flex items-center
                  rounded-xl
                  border border-white/[0.08]
                  bg-white/[0.04]
                  p-1
                "
              >
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: "h-9 w-9",
                    },
                  }}
                />
              </motion.div>
            ) : (
              /* Logged out */
              <Link
                href="/login"
                className="group/button"
              >
                <motion.div
                  whileHover={{
                    y: -2,
                    scale: 1.02,
                  }}
                  whileTap={{
                    scale: 0.97,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 20,
                  }}
                  className="
                    relative flex items-center
                    gap-2
                    overflow-hidden
                    rounded-xl
                    border border-white/[0.10]
                    bg-white
                    px-4 py-2.5
                    text-sm
                    font-semibold
                    text-black
                    shadow-[0_4px_20px_rgba(0,0,0,0.15)]
                    transition-all duration-300
                    hover:shadow-[0_6px_25px_rgba(0,0,0,0.25)]
                    sm:px-5
                  "
                >
                  {/* Button shine */}
                  <span
                    className="
                      pointer-events-none
                      absolute inset-0
                      -translate-x-full
                      bg-gradient-to-r
                      from-transparent
                      via-black/[0.06]
                      to-transparent
                      transition-transform
                      duration-700
                      group-hover/button:translate-x-full
                    "
                  />

                  <span className="relative">
                    Get Started
                  </span>

                  <motion.span
                    className="relative"
                    whileHover={{
                      x: 3,
                      y: -3,
                    }}
                  >
                    <MdArrowOutward size={17} />
                  </motion.span>
                </motion.div>
              </Link>
            )}
          </div>
        </div>
      </nav>
    </motion.header>
  );
}