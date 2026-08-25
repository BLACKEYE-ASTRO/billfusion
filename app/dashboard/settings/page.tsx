"use client";

import { useEffect, useState } from "react";

import { motion } from "motion/react";

import {
    Bell,
    Check,
    ChevronRight,
    CreditCard,
    Globe,
    Lock,
    Palette,
    Shield,
    User,
    Mail,
    CalendarDays,
    Loader2,
    Save,
} from "lucide-react";

import { UserButton, useUser } from "@clerk/nextjs";

export default function SettingsPage() {
    const { isLoaded, isSignedIn, user } = useUser();

    const [currency, setCurrency] = useState("INR");
    const [notifications, setNotifications] = useState(true);
    const [weeklyReport, setWeeklyReport] = useState(true);

    const [loadingSettings, setLoadingSettings] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState("");

    /*
    |--------------------------------------------------------------------------
    | Load settings from backend
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        if (!isLoaded || !isSignedIn) return;

        async function loadSettings() {
            try {
                setLoadingSettings(true);
                setError("");

                const response = await fetch("/api/settings", {
                    method: "GET",
                    cache: "no-store",
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.error || "Failed to load settings"
                    );
                }

                setCurrency(data.currency ?? "INR");
                setNotifications(data.notifications ?? true);
                setWeeklyReport(data.weeklyReport ?? true);
            } catch (error) {
                console.error(error);

                setError(
                    error instanceof Error
                        ? error.message
                        : "Failed to load settings"
                );
            } finally {
                setLoadingSettings(false);
            }
        }

        loadSettings();
    }, [isLoaded, isSignedIn]);

    /*
    |--------------------------------------------------------------------------
    | Save one setting
    |--------------------------------------------------------------------------
    */

    async function updateSetting(
        key: "currency" | "notifications" | "weeklyReport",
        value: string | boolean
    ) {
        try {
            setSaving(true);
            setSaved(false);
            setError("");

            const response = await fetch("/api/settings", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    [key]: value,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.error || "Failed to update setting"
                );
            }

            setCurrency(data.currency);
            setNotifications(data.notifications);
            setWeeklyReport(data.weeklyReport);

            setSaved(true);

            setTimeout(() => {
                setSaved(false);
            }, 2000);
        } catch (error) {
            console.error(error);

            setError(
                error instanceof Error
                    ? error.message
                    : "Failed to update setting"
            );
        } finally {
            setSaving(false);
        }
    }

    /*
    |--------------------------------------------------------------------------
    | Loading
    |--------------------------------------------------------------------------
    */

    if (!isLoaded) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <div className="h-7 w-7 animate-spin rounded-full border-2 border-white/10 border-t-[#00A67E]" />
            </div>
        );
    }

    if (!isSignedIn || !user) {
        return null;
    }

    if (loadingSettings) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <div className="flex items-center gap-3 text-sm text-white/40">
                    <Loader2
                        size={18}
                        className="animate-spin text-[#00A67E]"
                    />
                    Loading your preferences...
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">

            {/* ---------------------------------------------------------------- */}
            {/* Header */}
            {/* ---------------------------------------------------------------- */}

            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#00A67E]">
                    Settings
                </p>

                <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
                    Account preferences
                </h1>

                <p className="mt-2 max-w-xl text-sm text-white/35">
                    Manage your profile, preferences, notifications and
                    security.
                </p>
            </motion.div>

            {/* ---------------------------------------------------------------- */}
            {/* Save status */}
            {/* ---------------------------------------------------------------- */}

            {(saving || saved || error) && (
                <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex items-center gap-2 rounded-xl border px-4 py-3 text-xs ${error
                            ? "border-red-400/10 bg-red-400/[0.04] text-red-300"
                            : "border-[#00A67E]/10 bg-[#00A67E]/[0.04] text-[#00A67E]"
                        }`}
                >
                    {saving ? (
                        <>
                            <Loader2
                                size={14}
                                className="animate-spin"
                            />
                            Saving changes...
                        </>
                    ) : error ? (
                        error
                    ) : (
                        <>
                            <Check size={14} />
                            Changes saved
                        </>
                    )}
                </motion.div>
            )}

            {/* ---------------------------------------------------------------- */}
            {/* Main */}
            {/* ---------------------------------------------------------------- */}

            <div className="grid gap-6 xl:grid-cols-[1fr_380px]">

                {/* ============================================================ */}
                {/* LEFT */}
                {/* ============================================================ */}

                <div className="space-y-6">

                    {/* -------------------------------------------------------- */}
                    {/* Appearance */}
                    {/* -------------------------------------------------------- */}

                    {/* <SettingsSection
                        icon={Palette}
                        title="Appearance"
                        description="Customize how BillFusion looks."
                    >
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <p className="text-sm font-medium">
                                    Theme
                                </p>

                                <p className="mt-1 text-xs text-white/25">
                                    Choose your preferred appearance.
                                </p>
                            </div>

                            <div className="flex rounded-xl border border-white/[0.07] bg-white/[0.025] p-1">
                                <button
                                    className="
                                        rounded-lg
                                        bg-[#00A67E]/10
                                        px-3 py-2
                                        text-xs
                                        text-[#00A67E]
                                    "
                                >
                                    Dark
                                </button>

                                <button
                                    disabled
                                    className="
                                        rounded-lg
                                        px-3 py-2
                                        text-xs
                                        text-white/20
                                    "
                                >
                                    Light
                                </button>
                            </div>
                        </div>
                    </SettingsSection> */}

                    {/* -------------------------------------------------------- */}
                    {/* Currency */}
                    {/* -------------------------------------------------------- */}

                    <SettingsSection
                        icon={Globe}
                        title="Regional preferences"
                        description="Control currency and regional formatting."
                    >
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <p className="text-sm font-medium">
                                    Default currency
                                </p>

                                <p className="mt-1 text-xs text-white/25">
                                    Used throughout your financial dashboard.
                                </p>
                            </div>

                            <select
                                value={currency}
                                disabled={saving}
                                onChange={(e) => {
                                    const value = e.target.value;

                                    setCurrency(value);

                                    updateSetting(
                                        "currency",
                                        value
                                    );
                                }}
                                className="
                                    h-10
                                    rounded-xl
                                    border border-white/[0.07]
                                    bg-[#0c100e]
                                    px-3
                                    text-xs
                                    text-white/60
                                    outline-none
                                    transition
                                    focus:border-[#00A67E]/30
                                    disabled:opacity-50
                                "
                            >
                                <option value="INR">
                                    INR — ₹
                                </option>

                                <option value="USD">
                                    USD — $
                                </option>

                                <option value="EUR">
                                    EUR — €
                                </option>

                                <option value="GBP">
                                    GBP — £
                                </option>
                            </select>
                        </div>
                    </SettingsSection>

                    {/* -------------------------------------------------------- */}
                    {/* Notifications */}
                    {/* -------------------------------------------------------- */}

                    <SettingsSection
                        icon={Bell}
                        title="Notifications"
                        description="Choose what BillFusion should notify you about."
                    >
                        <div className="divide-y divide-white/[0.06]">

                            <SettingToggle
                                title="Push notifications"
                                description="Get notified about important account activity."
                                enabled={notifications}
                                disabled={saving}
                                onChange={(value) => {
                                    setNotifications(value);

                                    updateSetting(
                                        "notifications",
                                        value
                                    );
                                }}
                            />

                            <SettingToggle
                                title="Weekly financial report"
                                description="Receive a summary of your weekly spending."
                                enabled={weeklyReport}
                                disabled={saving}
                                onChange={(value) => {
                                    setWeeklyReport(value);

                                    updateSetting(
                                        "weeklyReport",
                                        value
                                    );
                                }}
                            />

                        </div>
                    </SettingsSection>

                    {/* -------------------------------------------------------- */}
                    {/* Security */}
                    {/* -------------------------------------------------------- */}

                    <SettingsSection
                        icon={Shield}
                        title="Security"
                        description="Manage account security and authentication."
                    >
                        <div className="space-y-2">

                            <SettingsLink
                                icon={Lock}
                                title="Password & security"
                                description="Manage your authentication settings."
                            />

                            <SettingsLink
                                icon={CreditCard}
                                title="Connected accounts"
                                description="Manage connected financial accounts."
                            />

                        </div>
                    </SettingsSection>
                </div>

                {/* ============================================================ */}
                {/* RIGHT */}
                {/* ============================================================ */}

                <div className="space-y-6">

                    {/* -------------------------------------------------------- */}
                    {/* Profile */}
                    {/* -------------------------------------------------------- */}

                    <motion.div
                        initial={{ opacity: 0, x: 15 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.15 }}
                        className="
                            overflow-hidden
                            rounded-2xl
                            border border-white/[0.07]
                            bg-white/[0.025]
                        "
                    >

                        <div className="border-b border-white/[0.06] p-5">
                            <div className="flex items-center justify-between">

                                <div className="flex items-center gap-3">

                                    <div className="
                                        flex h-10 w-10
                                        items-center justify-center
                                        rounded-xl
                                        bg-[#00A67E]/10
                                    ">
                                        <User
                                            size={18}
                                            className="text-[#00A67E]"
                                        />
                                    </div>

                                    <div>
                                        <p className="text-sm font-medium text-white">
                                            Your profile
                                        </p>

                                        <p className="mt-0.5 text-[11px] text-white/25">
                                            Account information
                                        </p>
                                    </div>

                                </div>

                                <UserButton
                                    appearance={{
                                        elements: {
                                            avatarBox: "h-9 w-9",
                                        },
                                    }}
                                />

                            </div>
                        </div>

                        <div className="p-5">

                            {/* Avatar */}

                            <div className="flex items-center gap-4">

                                <div className="relative">

                                    <img
                                        src={user.imageUrl}
                                        alt={user.fullName || "Profile"}
                                        className="
                                            h-16 w-16
                                            rounded-2xl
                                            border border-white/[0.08]
                                            object-cover
                                        "
                                    />

                                    <span className="
                                        absolute
                                        -bottom-1
                                        -right-1
                                        h-4
                                        w-4
                                        rounded-full
                                        border-2
                                        border-[#0a0d0b]
                                        bg-[#00A67E]
                                    " />

                                </div>

                                <div className="min-w-0">

                                    <h3 className="truncate text-base font-semibold text-white">
                                        {user.fullName ||
                                            user.username ||
                                            "BillFusion User"}
                                    </h3>

                                    <p className="mt-1 truncate text-xs text-white/30">
                                        {user.primaryEmailAddress?.emailAddress}
                                    </p>

                                </div>

                            </div>

                            {/* Account information */}

                            <div className="mt-6 space-y-2">

                                {/* Email */}

                                <div className="
                                    flex items-center gap-3
                                    rounded-xl
                                    border border-white/[0.05]
                                    bg-white/[0.02]
                                    p-3
                                ">

                                    <div className="
                                        flex h-8 w-8
                                        items-center justify-center
                                        rounded-lg
                                        bg-white/[0.04]
                                    ">
                                        <Mail
                                            size={14}
                                            className="text-white/35"
                                        />
                                    </div>

                                    <div className="min-w-0 flex-1">

                                        <p className="text-[10px] uppercase tracking-wider text-white/20">
                                            Email
                                        </p>

                                        <p className="mt-1 truncate text-xs text-white/55">
                                            {user.primaryEmailAddress?.emailAddress}
                                        </p>

                                    </div>
                                </div>

                                {/* Member since */}

                                <div className="
                                    flex items-center gap-3
                                    rounded-xl
                                    border border-white/[0.05]
                                    bg-white/[0.02]
                                    p-3
                                ">

                                    <div className="
                                        flex h-8 w-8
                                        items-center justify-center
                                        rounded-lg
                                        bg-white/[0.04]
                                    ">
                                        <CalendarDays
                                            size={14}
                                            className="text-white/35"
                                        />
                                    </div>

                                    <div>

                                        <p className="text-[10px] uppercase tracking-wider text-white/20">
                                            Member since
                                        </p>

                                        <p className="mt-1 text-xs text-white/55">
                                            {user.createdAt
                                                ? new Date(user.createdAt).toLocaleDateString("en-IN")
                                                : "Not available"}
                                        </p>

                                    </div>
                                </div>
                            </div>

                            {/* Account secured */}

                            <div className="mt-5">

                                <div className="
                                    flex items-center
                                    justify-between
                                    rounded-xl
                                    border border-[#00A67E]/10
                                    bg-[#00A67E]/[0.04]
                                    p-3
                                ">

                                    <div className="flex items-center gap-3">

                                        <div className="
                                            flex h-8 w-8
                                            items-center justify-center
                                            rounded-lg
                                            bg-[#00A67E]/10
                                        ">
                                            <Shield
                                                size={14}
                                                className="text-[#00A67E]"
                                            />
                                        </div>

                                        <div>

                                            <p className="text-xs font-medium text-white">
                                                Account secured
                                            </p>

                                            <p className="mt-0.5 text-[10px] text-white/25">
                                                Protected by Clerk
                                            </p>

                                        </div>

                                    </div>

                                    <Check
                                        size={15}
                                        className="text-[#00A67E]"
                                    />

                                </div>
                            </div>

                            {/* Edit profile */}

                            <div className="mt-4">

                                <UserButton
                                    userProfileMode="modal"
                                    showName
                                    appearance={{
                                        elements: {
                                            rootBox: "w-full",

                                            userButtonTrigger:
                                                "w-full justify-center rounded-xl border border-white/[0.07] bg-white/[0.04] px-4 py-2.5 text-xs font-medium text-white hover:bg-white/[0.07]",

                                            userButtonOuterIdentifier:
                                                "text-white",

                                            avatarBox:
                                                "h-5 w-5",
                                        },
                                    }}
                                />

                            </div>
                        </div>
                    </motion.div>

                    {/* -------------------------------------------------------- */}
                    {/* Account status */}
                    {/* -------------------------------------------------------- */}

                    <motion.div
                        initial={{ opacity: 0, x: 15 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.25 }}
                        className="
                            rounded-2xl
                            border border-[#00A67E]/15
                            bg-[#00A67E]/[0.04]
                            p-5
                        "
                    >
                        <div className="flex items-start gap-3">

                            <div className="
                                flex h-9 w-9 shrink-0
                                items-center justify-center
                                rounded-xl
                                bg-[#00A67E]/10
                            ">
                                <Check
                                    size={17}
                                    className="text-[#00A67E]"
                                />
                            </div>

                            <div>

                                <p className="text-sm font-medium">
                                    Account secured
                                </p>

                                <p className="mt-1 text-xs leading-5 text-white/30">
                                    Your account is protected with Clerk
                                    authentication.
                                </p>

                            </div>

                        </div>
                    </motion.div>

                </div>
            </div>
        </div>
    );
}

/* ==========================================================================
   Settings Section
   ========================================================================== */

function SettingsSection({
    icon: Icon,
    title,
    description,
    children,
}: {
    icon: React.ElementType;
    title: string;
    description: string;
    children: React.ReactNode;
}) {
    return (
        <motion.section
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="
                rounded-2xl
                border border-white/[0.07]
                bg-white/[0.025]
                p-5 sm:p-6
            "
        >
            <div className="mb-6 flex items-start gap-3">

                <div className="
                    flex h-9 w-9 shrink-0
                    items-center justify-center
                    rounded-xl
                    bg-white/[0.05]
                ">
                    <Icon
                        size={17}
                        className="text-[#00A67E]"
                    />
                </div>

                <div>

                    <h2 className="text-sm font-medium">
                        {title}
                    </h2>

                    <p className="mt-1 text-xs text-white/25">
                        {description}
                    </p>

                </div>
            </div>

            {children}
        </motion.section>
    );
}

/* ==========================================================================
   Toggle
   ========================================================================== */

function SettingToggle({
    title,
    description,
    enabled,
    disabled,
    onChange,
}: {
    title: string;
    description: string;
    enabled: boolean;
    disabled?: boolean;
    onChange: (value: boolean) => void;
}) {
    return (
        <div className="
            flex items-center
            justify-between
            gap-4
            py-4
            first:pt-0
            last:pb-0
        ">

            <div>

                <p className="text-sm font-medium">
                    {title}
                </p>

                <p className="mt-1 text-xs text-white/25">
                    {description}
                </p>

            </div>

            <button
                disabled={disabled}
                onClick={() => onChange(!enabled)}
                aria-label={`Toggle ${title}`}
                className={`
                    relative
                    h-6
                    w-11
                    shrink-0
                    rounded-full
                    transition
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                    ${enabled
                        ? "bg-[#00A67E]"
                        : "bg-white/[0.12]"
                    }
                `}
            >
                <motion.span
                    animate={{
                        x: enabled ? 20 : 3,
                    }}
                    transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                    }}
                    className="
                        absolute
                        left-0
                        top-1
                        h-4
                        w-4
                        rounded-full
                        bg-white
                    "
                />
            </button>
        </div>
    );
}

/* ==========================================================================
   Settings Link
   ========================================================================== */

function SettingsLink({
    icon: Icon,
    title,
    description,
}: {
    icon: React.ElementType;
    title: string;
    description: string;
}) {
    return (
        <button
            className="
                flex w-full
                items-center gap-3
                rounded-xl
                p-3
                text-left
                transition
                hover:bg-white/[0.03]
            "
        >
            <div className="
                flex h-9 w-9
                items-center justify-center
                rounded-xl
                bg-white/[0.04]
            ">
                <Icon
                    size={16}
                    className="text-white/40"
                />
            </div>

            <div className="flex-1">

                <p className="text-xs font-medium">
                    {title}
                </p>

                <p className="mt-1 text-[10px] text-white/25">
                    {description}
                </p>

            </div>

            <ChevronRight
                size={15}
                className="text-white/20"
            />
        </button>
    );
}