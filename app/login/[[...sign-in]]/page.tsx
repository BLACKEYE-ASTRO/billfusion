"use client";

import { SignIn } from "@clerk/nextjs";
import { motion } from "motion/react";

export default function LoginPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#050505] px-4 py-10 text-white">
      {/* ================= BACKGROUND ================= */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.045]"
          style={{
            backgroundImage: `
              linear-gradient(
                rgba(255,255,255,0.8) 1px,
                transparent 1px
              ),
              linear-gradient(
                90deg,
                rgba(255,255,255,0.8) 1px,
                transparent 1px
              )
            `,
            backgroundSize: "48px 48px",
          }}
        />

        {/* Main emerald glow */}
        <motion.div
          className="
            absolute
            left-1/2
            top-[10%]
            h-[550px]
            w-[550px]
            -translate-x-1/2
            rounded-full
            bg-emerald-500/10
            blur-[140px]
          "
          animate={{
            scale: [1, 1.12, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Blue glow */}
        <motion.div
          className="
            absolute
            -left-[15%]
            top-[45%]
            h-[400px]
            w-[400px]
            rounded-full
            bg-blue-500/[0.06]
            blur-[120px]
          "
          animate={{
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Purple glow */}
        <motion.div
          className="
            absolute
            -right-[15%]
            top-[25%]
            h-[450px]
            w-[450px]
            rounded-full
            bg-purple-500/[0.05]
            blur-[140px]
          "
          animate={{
            x: [0, -30, 0],
            y: [0, 25, 0],
          }}
          transition={{
            duration: 11,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,#050505_100%)]" />
      </div>

      {/* ================= LOGIN CONTENT ================= */}
      <motion.div
        initial={{
          opacity: 0,
          y: 25,
          scale: 0.97,
          filter: "blur(8px)",
        }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
        }}
        transition={{
          duration: 0.8,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="
          relative
          z-10
          flex
          w-full
          max-w-[430px]
          flex-col
          items-center
        "
      >
        {/* ================= HEADING ================= */}
        <motion.div
          initial={{
            opacity: 0,
            y: -10,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.15,
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="mb-7 text-center"
        >
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome back
          </h1>

          <p className="mt-2 text-sm text-white/35">
            Sign in to continue managing your finances.
          </p>
        </motion.div>

        {/* ================= CLERK ================= */}
        <motion.div
          initial={{
            opacity: 0,
            y: 15,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.25,
            duration: 0.7,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="relative w-full"
        >
          {/* Animated card glow */}
          <motion.div
            animate={{
              opacity: [0.25, 0.45, 0.25],
              scale: [1, 1.03, 1],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="
              absolute
              -inset-8
              -z-10
              rounded-[40px]
              bg-emerald-500/[0.06]
              blur-3xl
            "
          />

          <SignIn
            forceRedirectUrl="/dashboard"
            appearance={{

              variables: {
                colorPrimary: "#00A67E",
                colorBackground: "#0b0c0c",
                colorForeground: "#ffffff",
                colorMutedForeground: "rgba(255,255,255,0.45)",
                colorInput: "rgba(255,255,255,0.035)",
                colorInputForeground: "#ffffff",
                borderRadius: "14px",
              },

              elements: {
                /* Main card */
                rootBox: "w-full",

                card: `
                  w-full
                  border
                  border-white/[0.08]
                  bg-[#0b0c0c]/95
                  shadow-[0_30px_100px_rgba(0,0,0,0.55)]
                  backdrop-blur-2xl
                `,

                /* Header */
                headerTitle: `
                  text-white
                  font-semibold
                `,

                headerSubtitle: `
                  text-white/40
                `,

                /* Google / social button */
                socialButtonsBlockButton: `
                  !border
                  !border-white/[0.08]
                  !bg-white/[0.035]
                  !text-white
                  transition-all
                  duration-300
                  hover:!border-white/[0.14]
                  hover:!bg-white/[0.07]
                `,

                socialButtonsBlockButtonText: `
                  !text-white/80
                `,

                /* Divider */
                dividerLine: `
                  !bg-white/[0.08]
                `,

                dividerText: `
                  !text-white/30
                `,

                /* Form */
                formFieldLabel: `
                  !text-white/60
                `,

                formFieldInput: `
                  !border
                  !border-white/[0.08]
                  !bg-white/[0.035]
                  !text-white
                  !placeholder:text-white/20
                  transition-all
                  duration-300
                  focus:!border-[#00A67E]/60
                  focus:!ring-[#00A67E]/10
                `,

                /* Continue button */
                formButtonPrimary: `
                  !bg-[#00A67E]
                  !text-black
                  font-semibold
                  transition-all
                  duration-300
                  hover:!bg-[#00B88A]
                  hover:!shadow-[0_0_30px_rgba(0,166,126,0.20)]
                `,

                /* Footer */
                footerActionText: `
                  !text-white/35
                `,

                footerActionLink: `
                  !text-[#00A67E]
                  transition-colors
                  duration-300
                  hover:!text-[#00B88A]
                `,

                /* Identity preview */
                identityPreviewText: `
                  !text-white
                `,

                identityPreviewEditButtonIcon: `
                  !text-white/40
                `,

                /* Errors */
                alert: `
                  !border-red-400/20
                  !bg-red-400/10
                  !text-red-300
                `,
              },
            }}
          />
        </motion.div>

        {/* ================= SECURITY ================= */}
        <motion.p
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            delay: 0.8,
            duration: 0.6,
          }}
          className="
            mt-6
            flex
            items-center
            gap-2
            text-[11px]
            text-white/20
          "
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/40" />

            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400/70" />
          </span>

          Your account is protected by Clerk
        </motion.p>
      </motion.div>
    </main>
  );
}