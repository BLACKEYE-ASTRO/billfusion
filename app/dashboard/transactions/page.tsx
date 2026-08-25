"use client";

import { useMemo, useState } from "react";
import {
    ArrowDownLeft,
    ArrowUpRight,
    ArrowLeftRight,
    Search,
    Plus,
    Trash2,
    Receipt,
    Loader2,
    Filter,
} from "lucide-react";
import { motion } from "motion/react";
import {
    useCategories,
} from "@/lib/hooks/use-categories";

import AddTransactionModal from "@/components/dashboard/add-transaction-modal";

import {
    useTransactions,
} from "@/lib/hooks/use-transactions";

import {
    useAccounts,
} from "@/lib/hooks/use-accounts";

import {
    deleteTransaction,
} from "@/lib/api/transactions";

export default function TransactionsPage() {
    const [modalOpen, setModalOpen] =
        useState(false);

    const [search, setSearch] =
        useState("");

    const {
        categories,
        loading: categoriesLoading,
    } = useCategories();

    const [typeFilter, setTypeFilter] =
        useState("");

    const [deletingId, setDeletingId] =
        useState<string | null>(null);

    const {
        transactions,
        loading,
        error,
        refetch,
    } = useTransactions({
        search,
        type: typeFilter,
    });

    const {
        accounts,
        loading: accountsLoading,
    } = useAccounts();

    const totalIncome = useMemo(() => {
        return transactions
            .filter(
                (transaction) =>
                    transaction.type === "INCOME"
            )
            .reduce(
                (total, transaction) =>
                    total + Number(transaction.amount),
                0
            );
    }, [transactions]);

    const totalExpenses = useMemo(() => {
        return transactions
            .filter(
                (transaction) =>
                    transaction.type === "EXPENSE"
            )
            .reduce(
                (total, transaction) =>
                    total + Number(transaction.amount),
                0
            );
    }, [transactions]);

    const handleDelete = async (
        id: string
    ) => {
        const confirmed = window.confirm(
            "Delete this transaction? This will also reverse its effect on the account balance."
        );

        if (!confirmed) return;

        try {
            setDeletingId(id);

            await deleteTransaction(id);

            await refetch();
        } catch (error) {
            alert(
                error instanceof Error
                    ? error.message
                    : "Failed to delete transaction"
            );
        } finally {
            setDeletingId(null);
        }
    };

    const formatMoney = (
        amount: number,
        symbol = "₹"
    ) => {
        return `${symbol}${amount.toLocaleString(
            "en-IN",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }
        )}`;
    };

    return (
        <>
            <div className="space-y-6">
                {/* Header */}

                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="mb-2 text-xs font-medium uppercase tracking-[0.18em] text-emerald-400/70">
                            Finance
                        </p>

                        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                            Transactions
                        </h1>

                        <p className="mt-2 text-sm text-white/40">
                            Track every income, expense and transfer.
                        </p>
                    </div>

                    <button
                        onClick={() =>
                            setModalOpen(true)
                        }
                        disabled={accountsLoading || categoriesLoading}
                        className="flex h-11 items-center justify-center gap-2 rounded-xl bg-emerald-400 px-5 text-sm font-semibold text-black transition hover:bg-emerald-300 disabled:opacity-50"
                    >
                        <Plus size={17} />
                        Add transaction
                    </button>
                </div>

                {/* Summary */}

                <div className="grid gap-3 sm:grid-cols-3">
                    <SummaryCard
                        label="Transactions"
                        value={transactions.length.toString()}
                    />

                    <SummaryCard
                        label="Income"
                        value={formatMoney(
                            totalIncome
                        )}
                        positive
                    />

                    <SummaryCard
                        label="Expenses"
                        value={formatMoney(
                            totalExpenses
                        )}
                        negative
                    />
                </div>

                {/* Filters */}

                <div className="flex flex-col gap-3 rounded-2xl border border-white/8 bg-white/[0.025] p-3 sm:flex-row">
                    <div className="relative flex-1">
                        <Search
                            size={16}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25"
                        />

                        <input
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                            placeholder="Search transactions..."
                            className="h-10 w-full rounded-xl border border-white/8 bg-black/20 pl-9 pr-3 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-emerald-400/30"
                        />
                    </div>

                    <div className="relative">
                        <Filter
                            size={15}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30"
                        />

                        <select
                            value={typeFilter}
                            onChange={(e) =>
                                setTypeFilter(e.target.value)
                            }
                            className="h-10 w-full min-w-[150px] appearance-none rounded-xl border border-white/8 bg-black/20 pl-9 pr-8 text-sm text-white/60 outline-none focus:border-emerald-400/30 sm:w-auto"
                        >
                            <option
                                value=""
                                className="bg-[#0b0e0c]"
                            >
                                All transactions
                            </option>

                            <option
                                value="EXPENSE"
                                className="bg-[#0b0e0c]"
                            >
                                Expenses
                            </option>

                            <option
                                value="INCOME"
                                className="bg-[#0b0e0c]"
                            >
                                Income
                            </option>

                            <option
                                value="TRANSFER"
                                className="bg-[#0b0e0c]"
                            >
                                Transfers
                            </option>
                        </select>
                    </div>
                </div>

                {/* Transactions */}

                <div className="overflow-hidden rounded-2xl border border-white/8 bg-white/[0.02]">
                    {loading ? (
                        <div className="flex min-h-[400px] items-center justify-center">
                            <Loader2
                                className="animate-spin text-emerald-400"
                                size={24}
                            />
                        </div>
                    ) : error ? (
                        <div className="flex min-h-[300px] flex-col items-center justify-center px-6 text-center">
                            <p className="text-sm text-red-300">
                                {error}
                            </p>

                            <button
                                onClick={() => refetch()}
                                className="mt-4 rounded-lg border border-white/10 px-4 py-2 text-xs text-white/60 hover:bg-white/5"
                            >
                                Try again
                            </button>
                        </div>
                    ) : transactions.length === 0 ? (
                        <EmptyState
                            onAdd={() =>
                                setModalOpen(true)
                            }
                        />
                    ) : (
                        <>
                            {/* Desktop heading */}

                            <div className="hidden border-b border-white/8 px-5 py-3 text-[11px] uppercase tracking-wider text-white/30 md:grid md:grid-cols-[1fr_180px_150px_130px_50px]">
                                <span>Transaction</span>
                                <span>Account</span>
                                <span>Date</span>
                                <span className="text-right">
                                    Amount
                                </span>
                                <span />
                            </div>

                            <div>
                                {transactions.map(
                                    (transaction, index) => {
                                        const isIncome =
                                            transaction.type ===
                                            "INCOME";

                                        const isTransfer =
                                            transaction.type ===
                                            "TRANSFER";

                                        const amount =
                                            Number(
                                                transaction.amount
                                            );

                                        return (
                                            <motion.div
                                                key={transaction.id}
                                                initial={{
                                                    opacity: 0,
                                                    y: 8,
                                                }}
                                                animate={{
                                                    opacity: 1,
                                                    y: 0,
                                                }}
                                                transition={{
                                                    delay:
                                                        index * 0.025,
                                                }}
                                                className="group border-b border-white/6 px-4 py-4 last:border-b-0 md:grid md:grid-cols-[1fr_180px_150px_130px_50px] md:items-center md:px-5"
                                            >
                                                {/* Transaction */}

                                                <div className="flex min-w-0 items-center gap-3">
                                                    <TransactionIcon
                                                        type={
                                                            transaction.type
                                                        }
                                                    />

                                                    <div className="min-w-0">
                                                        <p className="truncate text-sm font-medium text-white">
                                                            {transaction.description ||
                                                                transaction.merchant ||
                                                                transaction.category
                                                                    ?.name ||
                                                                "Transaction"}
                                                        </p>

                                                        <p className="mt-1 truncate text-xs text-white/35">
                                                            {transaction.merchant ||
                                                                transaction.category
                                                                    ?.name ||
                                                                transaction.type}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Account */}

                                                <div className="mt-3 text-xs text-white/45 md:mt-0">
                                                    {isTransfer &&
                                                        transaction.transferAccount ? (
                                                        <span>
                                                            {transaction.account.name}
                                                            {" → "}
                                                            {
                                                                transaction
                                                                    .transferAccount
                                                                    .name
                                                            }
                                                        </span>
                                                    ) : (
                                                        transaction.account
                                                            .name
                                                    )}
                                                </div>

                                                {/* Date */}

                                                <div className="mt-2 text-xs text-white/35 md:mt-0">
                                                    {new Date(
                                                        transaction.date
                                                    ).toLocaleDateString(
                                                        "en-IN",
                                                        {
                                                            day: "2-digit",
                                                            month: "short",
                                                            year: "numeric",
                                                        }
                                                    )}
                                                </div>

                                                {/* Amount */}

                                                <div
                                                    className={`mt-2 text-sm font-semibold md:mt-0 md:text-right ${isIncome
                                                        ? "text-emerald-400"
                                                        : isTransfer
                                                            ? "text-white/70"
                                                            : "text-white"
                                                        }`}
                                                >
                                                    {isIncome
                                                        ? "+"
                                                        : isTransfer
                                                            ? ""
                                                            : "-"}
                                                    {formatMoney(
                                                        amount,
                                                        transaction.account
                                                            .currencySymbol
                                                    )}
                                                </div>

                                                {/* Delete */}

                                                <div className="absolute right-4 top-1/2 hidden -translate-y-1/2 md:relative md:right-auto md:top-auto md:block md:translate-y-0">
                                                    <button
                                                        onClick={() =>
                                                            handleDelete(
                                                                transaction.id
                                                            )
                                                        }
                                                        disabled={
                                                            deletingId ===
                                                            transaction.id
                                                        }
                                                        className="flex h-8 w-8 items-center justify-center rounded-lg text-white/20 opacity-0 transition hover:bg-red-500/10 hover:text-red-400 group-hover:opacity-100 disabled:opacity-50"
                                                    >
                                                        {deletingId ===
                                                            transaction.id ? (
                                                            <Loader2
                                                                size={14}
                                                                className="animate-spin"
                                                            />
                                                        ) : (
                                                            <Trash2
                                                                size={14}
                                                            />
                                                        )}
                                                    </button>
                                                </div>
                                            </motion.div>
                                        );
                                    }
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Modal */}

            <AddTransactionModal
                open={modalOpen}
                onClose={() =>
                    setModalOpen(false)
                }
                accounts={accounts}
                categories={categories}
                onSuccess={refetch}
            />
        </>
    );
}

function SummaryCard({
    label,
    value,
    positive,
    negative,
}: {
    label: string;
    value: string;
    positive?: boolean;
    negative?: boolean;
}) {
    return (
        <div className="rounded-2xl border border-white/8 bg-white/[0.025] p-4">
            <p className="text-xs text-white/35">
                {label}
            </p>

            <p
                className={`mt-2 text-xl font-semibold ${positive
                    ? "text-emerald-400"
                    : negative
                        ? "text-red-400"
                        : "text-white"
                    }`}
            >
                {value}
            </p>
        </div>
    );
}

function TransactionIcon({
    type,
}: {
    type: string;
}) {
    if (type === "INCOME") {
        return (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-400">
                <ArrowUpRight size={18} />
            </div>
        );
    }

    if (type === "TRANSFER") {
        return (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/5 text-white/50">
                <ArrowLeftRight size={18} />
            </div>
        );
    }

    return (
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-400/10 text-red-400">
            <ArrowDownLeft size={18} />
        </div>
    );
}

function EmptyState({
    onAdd,
}: {
    onAdd: () => void;
}) {
    return (
        <div className="flex min-h-[400px] flex-col items-center justify-center px-6 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/8 bg-white/[0.03]">
                <Receipt
                    size={23}
                    className="text-white/30"
                />
            </div>

            <h3 className="mt-5 text-sm font-semibold">
                No transactions yet
            </h3>

            <p className="mt-2 max-w-sm text-xs leading-5 text-white/35">
                Start tracking your finances by adding
                your first income or expense.
            </p>

            <button
                onClick={onAdd}
                className="mt-5 flex h-10 items-center gap-2 rounded-xl bg-emerald-400 px-4 text-xs font-semibold text-black hover:bg-emerald-300"
            >
                <Plus size={15} />
                Add transaction
            </button>
        </div>
    );
}