"use client";

import { useEffect, useState } from "react";
import {
    ArrowDownLeft,
    ArrowLeftRight,
    ArrowUpRight,
    Calendar,
    Loader2,
    X,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import {
    createTransaction,
    TransactionType,
} from "@/lib/api/transactions";

type Account = {
    id: string;
    name: string;
    type: string;
    balance: string;
};

type Category = {
    id: string;
    name: string;
    icon: string | null;
    isIncome: boolean;
};

type Props = {
    open: boolean;
    onClose: () => void;
    accounts: Account[];
    categories: Category[];
    onSuccess: () => void;
};

export default function AddTransactionModal({
    open,
    onClose,
    accounts,
    categories,
    onSuccess,
}: Props) {
    const [type, setType] =
        useState<TransactionType>("EXPENSE");

    const [amount, setAmount] = useState("");

    const [accountId, setAccountId] = useState("");

    const [categoryId, setCategoryId] =
        useState("");

    const [transferAccountId, setTransferAccountId] =
        useState("");

    const [description, setDescription] =
        useState("");

    const [merchant, setMerchant] =
        useState("");

    const [date, setDate] =
        useState("");

    const [notes, setNotes] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    useEffect(() => {
        if (!open) return;

        const today = new Date()
            .toISOString()
            .split("T")[0];

        setDate(today);

        if (accounts.length > 0) {
            setAccountId(accounts[0].id);
        }

        setAmount("");
        setDescription("");
        setMerchant("");
        setNotes("");
        setCategoryId("");
        setTransferAccountId("");
        setError("");
        setType("EXPENSE");
    }, [open, accounts]);

    const availableCategories =
        categories.filter((category) => {
            if (type === "INCOME") {
                return category.isIncome;
            }

            if (type === "EXPENSE") {
                return !category.isIncome;
            }

            return false;
        });

    const handleSubmit = async (
        event: React.FormEvent
    ) => {
        event.preventDefault();

        setError("");

        if (!amount || Number(amount) <= 0) {
            setError(
                "Please enter a valid amount."
            );
            return;
        }

        if (!accountId) {
            setError(
                "Please select an account."
            );
            return;
        }

        if (
            type !== "TRANSFER" &&
            !categoryId
        ) {
            setError(
                "Please select a category."
            );
            return;
        }

        if (
            type === "TRANSFER" &&
            !transferAccountId
        ) {
            setError(
                "Please select the destination account."
            );
            return;
        }

        if (
            type === "TRANSFER" &&
            accountId === transferAccountId
        ) {
            setError(
                "Source and destination accounts must be different."
            );
            return;
        }

        try {
            setLoading(true);

            await createTransaction({
                type,
                amount: Number(amount),

                accountId,

                ...(type !== "TRANSFER" && {
                    categoryId,
                }),

                ...(type === "TRANSFER" && {
                    transferAccountId,
                }),

                description:
                    description.trim() || undefined,

                merchant:
                    merchant.trim() || undefined,

                date: date
                    ? new Date(date).toISOString()
                    : undefined,

                notes:
                    notes.trim() || undefined,
            });

            onSuccess();
            onClose();
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Failed to create transaction."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
                    onMouseDown={(event) => {
                        if (
                            event.target === event.currentTarget
                        ) {
                            onClose();
                        }
                    }}
                >
                    <motion.div
                        initial={{
                            opacity: 0,
                            y: 20,
                            scale: 0.97,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                            scale: 1,
                        }}
                        exit={{
                            opacity: 0,
                            y: 20,
                            scale: 0.97,
                        }}
                        transition={{
                            duration: 0.25,
                        }}
                        className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl border border-white/10 bg-[#0b0e0c] shadow-2xl"
                    >
                        {/* Header */}

                        <div className="flex items-center justify-between border-b border-white/8 px-6 py-5">
                            <div>
                                <h2 className="text-lg font-semibold">
                                    Add transaction
                                </h2>

                                <p className="mt-1 text-xs text-white/40">
                                    Record your income, expense or transfer.
                                </p>
                            </div>

                            <button
                                onClick={onClose}
                                className="flex h-9 w-9 items-center justify-center rounded-xl text-white/40 transition hover:bg-white/5 hover:text-white"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <form
                            onSubmit={handleSubmit}
                            className="space-y-6 p-6"
                        >
                            {/* Type */}

                            <div>
                                <label className="mb-2 block text-xs font-medium text-white/50">
                                    Transaction type
                                </label>

                                <div className="grid grid-cols-3 gap-2">
                                    <TypeButton
                                        active={type === "EXPENSE"}
                                        onClick={() =>
                                            setType("EXPENSE")
                                        }
                                        icon={
                                            <ArrowDownLeft size={16} />
                                        }
                                        label="Expense"
                                    />

                                    <TypeButton
                                        active={type === "INCOME"}
                                        onClick={() =>
                                            setType("INCOME")
                                        }
                                        icon={
                                            <ArrowUpRight size={16} />
                                        }
                                        label="Income"
                                    />

                                    <TypeButton
                                        active={type === "TRANSFER"}
                                        onClick={() =>
                                            setType("TRANSFER")
                                        }
                                        icon={
                                            <ArrowLeftRight size={16} />
                                        }
                                        label="Transfer"
                                    />
                                </div>
                            </div>

                            {/* Amount */}

                            <div>
                                <label className="mb-2 block text-xs font-medium text-white/50">
                                    Amount
                                </label>

                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-white/40">
                                        ₹
                                    </span>

                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={amount}
                                        onChange={(e) =>
                                            setAmount(e.target.value)
                                        }
                                        placeholder="0.00"
                                        className="h-14 w-full rounded-xl border border-white/10 bg-white/[0.035] pl-10 pr-4 text-xl font-semibold outline-none transition placeholder:text-white/15 focus:border-emerald-400/40"
                                    />
                                </div>
                            </div>

                            {/* Account */}

                            <div className="grid gap-4 sm:grid-cols-2">
                                <Field label="Account">
                                    <select
                                        value={accountId}
                                        onChange={(e) =>
                                            setAccountId(e.target.value)
                                        }
                                        className="input"
                                    >
                                        <option
                                            value=""
                                            className="bg-[#0b0e0c]"
                                        >
                                            Select account
                                        </option>

                                        {accounts.map(
                                            (account) => (
                                                <option
                                                    key={account.id}
                                                    value={account.id}
                                                    className="bg-[#0b0e0c]"
                                                >
                                                    {account.name}
                                                </option>
                                            )
                                        )}
                                    </select>
                                </Field>

                                <Field label="Date">
                                    <div className="relative">
                                        <Calendar
                                            size={16}
                                            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/30"
                                        />

                                        <input
                                            type="date"
                                            value={date}
                                            onChange={(e) =>
                                                setDate(e.target.value)
                                            }
                                            className="input pl-10"
                                        />
                                    </div>
                                </Field>
                            </div>

                            {/* Category */}

                            {type !== "TRANSFER" && (
                                <Field label="Category">
                                    <select
                                        value={categoryId}
                                        onChange={(e) =>
                                            setCategoryId(e.target.value)
                                        }
                                        className="input"
                                    >
                                        <option
                                            value=""
                                            className="bg-[#0b0e0c]"
                                        >
                                            Select category
                                        </option>

                                        {availableCategories.map(
                                            (category) => (
                                                <option
                                                    key={category.id}
                                                    value={category.id}
                                                    className="bg-[#0b0e0c]"
                                                >
                                                    {category.name}
                                                </option>
                                            )
                                        )}
                                    </select>
                                </Field>
                            )}

                            {/* Transfer account */}

                            {type === "TRANSFER" && (
                                <Field label="Destination account">
                                    <select
                                        value={transferAccountId}
                                        onChange={(e) =>
                                            setTransferAccountId(e.target.value)
                                        }
                                        className="input"
                                    >
                                        <option
                                            value=""
                                            className="bg-[#0b0e0c]"
                                        >
                                            Select destination account
                                        </option>

                                        {accounts
                                            .filter(
                                                (account) =>
                                                    account.id !== accountId
                                            )
                                            .map((account) => (
                                                <option
                                                    key={account.id}
                                                    value={account.id}
                                                    className="bg-[#0b0e0c]"
                                                >
                                                    {account.name} — ₹
                                                    {Number(account.balance).toLocaleString(
                                                        "en-IN"
                                                    )}
                                                </option>
                                            ))}
                                    </select>

                                    {accounts.filter(
                                        (account) =>
                                            account.id !== accountId
                                    ).length === 0 && (
                                            <p className="mt-2 text-xs text-amber-400/70">
                                                You need another account to make a
                                                transfer.
                                            </p>
                                        )}
                                </Field>
                            )}
                            {/* Description + Merchant */}

                            <div className="grid gap-4 sm:grid-cols-2">
                                <Field label="Description">
                                    <input
                                        value={description}
                                        onChange={(e) =>
                                            setDescription(
                                                e.target.value
                                            )
                                        }
                                        placeholder="Lunch, salary..."
                                        className="input"
                                    />
                                </Field>

                                <Field label="Merchant">
                                    <input
                                        value={merchant}
                                        onChange={(e) =>
                                            setMerchant(
                                                e.target.value
                                            )
                                        }
                                        placeholder="Swiggy, Amazon..."
                                        className="input"
                                    />
                                </Field>
                            </div>

                            {/* Notes */}

                            <Field label="Notes">
                                <textarea
                                    value={notes}
                                    onChange={(e) =>
                                        setNotes(e.target.value)
                                    }
                                    placeholder="Optional notes..."
                                    rows={3}
                                    className="input resize-none py-3"
                                />
                            </Field>

                            {/* Error */}

                            {error && (
                                <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                                    {error}
                                </div>
                            )}

                            {/* Actions */}

                            <div className="flex gap-3 border-t border-white/8 pt-5">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    disabled={loading}
                                    className="h-11 flex-1 rounded-xl border border-white/10 text-sm font-medium text-white/60 transition hover:bg-white/5 hover:text-white"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-400 text-sm font-semibold text-black transition hover:bg-emerald-300 disabled:opacity-50"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2
                                                size={16}
                                                className="animate-spin"
                                            />
                                            Saving...
                                        </>
                                    ) : (
                                        "Add transaction"
                                    )}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

function TypeButton({
    active,
    onClick,
    icon,
    label,
}: {
    active: boolean;
    onClick: () => void;
    icon: React.ReactNode;
    label: string;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`flex h-11 items-center justify-center gap-2 rounded-xl border text-xs font-medium transition ${active
                    ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-300"
                    : "border-white/8 bg-white/[0.025] text-white/40 hover:bg-white/5 hover:text-white"
                }`}
        >
            {icon}
            {label}
        </button>
    );
}

function Field({
    label,
    children,
}: {
    label: string;
    children: React.ReactNode;
}) {
    return (
        <div>
            <label className="mb-2 block text-xs font-medium text-white/50">
                {label}
            </label>

            {children}
        </div>
    );
}