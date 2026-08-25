"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import {
  Car,
  Edit3,
  Home,
  MoreHorizontal,
  Plus,
  ShoppingBag,
  Trash2,
  Utensils,
  Wallet,
  X,
} from "lucide-react";

type Category = {
  id: string;
  name: string;
  icon: string | null;
  color: string | null;
};

type BudgetCategory = {
  id: string;
  categoryId: string;
  name: string;
  icon: string | null;
  color: string | null;
  limit: number;
  spent: number;
  remaining: number;
  percentage: number;
};

type Budget = {
  id: string;
  name: string;
  amount: number;
  period: "MONTHLY" | "YEARLY";
  startDate: string;
  endDate: string;
  totalLimit: number;
  totalSpent: number;
  remaining: number;
  percentage: number;
  categories: BudgetCategory[];
};

type CreateBudgetData = {
  name: string;
  amount: number;
  categoryId: string;
  period: "MONTHLY" | "YEARLY";
};

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [editingBudget, setEditingBudget] = useState<Budget | null>(
    null
  );

  const [error, setError] = useState("");

  // ==========================================
  // FETCH DATA
  // ==========================================

  async function fetchData() {
    try {
      setLoading(true);
      setError("");

      const [budgetsResponse, categoriesResponse] =
        await Promise.all([
          fetch("/api/budgets", {
            cache: "no-store",
          }),

          fetch("/api/categories", {
            cache: "no-store",
          }),
        ]);

      const budgetsData = await budgetsResponse.json();
      const categoriesData = await categoriesResponse.json();

      if (!budgetsResponse.ok) {
        throw new Error(
          budgetsData.error || "Failed to fetch budgets"
        );
      }

      if (!categoriesResponse.ok) {
        throw new Error(
          categoriesData.error || "Failed to fetch categories"
        );
      }

      setBudgets(budgetsData.budgets || []);
      setCategories(categoriesData.categories || []);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  // ==========================================
  // TOTALS
  // ==========================================

  const totalLimit = useMemo(() => {
    return budgets.reduce(
      (sum, budget) => sum + budget.totalLimit,
      0
    );
  }, [budgets]);

  const totalSpent = useMemo(() => {
    return budgets.reduce(
      (sum, budget) => sum + budget.totalSpent,
      0
    );
  }, [budgets]);

  const remaining = totalLimit - totalSpent;

  const percentage =
    totalLimit > 0
      ? Math.round((totalSpent / totalLimit) * 100)
      : 0;

  // ==========================================
  // CREATE BUDGET
  // ==========================================

  async function createBudget(data: CreateBudgetData) {
    try {
      const response = await fetch("/api/budgets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || "Failed to create budget"
        );
      }

      setShowModal(false);

      await fetchData();
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Failed to create budget"
      );
    }
  }

  // ==========================================
  // UPDATE BUDGET
  // ==========================================

  async function updateBudget(
    id: string,
    data: CreateBudgetData
  ) {
    try {
      const response = await fetch(`/api/budgets/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || "Failed to update budget"
        );
      }

      setEditingBudget(null);

      await fetchData();
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Failed to update budget"
      );
    }
  }

  // ==========================================
  // DELETE BUDGET
  // ==========================================

  async function deleteBudget(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this budget?"
    );

    if (!confirmed) return;

    try {
      const response = await fetch(
        `/api/budgets/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to delete budget"
        );
      }

      setBudgets((current) =>
        current.filter(
          (budget) => budget.id !== id
        )
      );
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Failed to delete budget"
      );
    }
  }

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return <BudgetSkeleton />;
  }

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="space-y-6">

      {/* HEADER */}

      <motion.div
        initial={{
          opacity: 0,
          y: 15,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"
      >
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#00A67E]">
            Budgets
          </p>

          <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            Control your spending
          </h1>

          <p className="mt-2 max-w-xl text-sm text-white/35">
            Set spending limits and keep your expenses
            under control.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingBudget(null);
            setShowModal(true);
          }}
          className="flex items-center justify-center gap-2 rounded-xl bg-[#00A67E] px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-[#00b889]"
        >
          <Plus size={17} />

          Create budget
        </button>
      </motion.div>

      {/* ERROR */}

      {error && (
        <div className="rounded-xl border border-red-400/10 bg-red-400/5 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {/* OVERVIEW */}

      <div className="grid gap-4 sm:grid-cols-3">

        <BudgetStat
          label="Total budget"
          value={totalLimit}
          description="Total spending limit"
          delay={0}
        />

        <BudgetStat
          label="Total spent"
          value={totalSpent}
          description={`${percentage}% of your budget used`}
          delay={0.08}
        />

        <BudgetStat
          label="Remaining"
          value={remaining}
          description="Available to spend"
          delay={0.16}
          green
        />

      </div>

      {/* OVERALL PROGRESS */}

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
          delay: 0.2,
        }}
        className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 sm:p-6"
      >

        <div className="flex items-center justify-between">

          <div>
            <p className="text-sm font-medium">
              Overall spending
            </p>

            <p className="mt-1 text-xs text-white/30">
              {new Date().toLocaleDateString(
                "en-IN",
                {
                  month: "long",
                  year: "numeric",
                }
              )}
            </p>
          </div>

          <p className="text-sm font-semibold">
            ₹
            {totalSpent.toLocaleString("en-IN")}

            <span className="font-normal text-white/25">
              {" "}
              / ₹
              {totalLimit.toLocaleString("en-IN")}
            </span>
          </p>

        </div>

        <div className="mt-5 h-3 overflow-hidden rounded-full bg-white/[0.06]">

          <motion.div
            initial={{
              width: 0,
            }}
            animate={{
              width: `${Math.min(
                percentage,
                100
              )}%`,
            }}
            transition={{
              duration: 1,
              ease: "easeOut",
            }}
            className={`h-full rounded-full ${
              percentage >= 100
                ? "bg-red-400"
                : percentage >= 80
                ? "bg-yellow-400"
                : "bg-[#00A67E]"
            }`}
          />

        </div>

        <div className="mt-3 flex justify-between">

          <span className="text-[11px] text-white/25">
            {percentage}% used
          </span>

          <span
            className={`text-[11px] ${
              remaining < 0
                ? "text-red-400"
                : "text-[#00A67E]"
            }`}
          >
            ₹
            {Math.max(
              remaining,
              0
            ).toLocaleString("en-IN")}{" "}
            remaining
          </span>

        </div>

      </motion.div>

      {/* BUDGET LIST */}

      <div>

        <div className="mb-4 flex items-center justify-between">

          <div>
            <h2 className="text-sm font-medium">
              Your budgets
            </h2>

            <p className="mt-1 text-xs text-white/30">
              Manage your spending categories
            </p>
          </div>

          <span className="text-xs text-white/25">
            {budgets.length}{" "}
            {budgets.length === 1
              ? "budget"
              : "budgets"}
          </span>

        </div>

        {budgets.length === 0 ? (

          <EmptyBudgets
            onCreate={() => setShowModal(true)}
          />

        ) : (

          <div className="grid gap-4 lg:grid-cols-2">

            {budgets.map(
              (budget, index) => (
                <BudgetCard
                  key={budget.id}
                  budget={budget}
                  index={index}
                  onDelete={deleteBudget}
                  onEdit={(budget) => {
                    setEditingBudget(budget);
                  }}
                />
              )
            )}

          </div>

        )}

      </div>

      {/* CREATE MODAL */}

      {showModal && (
        <CreateBudgetModal
          categories={categories}
          onClose={() =>
            setShowModal(false)
          }
          onCreate={createBudget}
        />
      )}

      {/* EDIT MODAL */}

      {editingBudget && (
        <CreateBudgetModal
          categories={categories}
          budget={editingBudget}
          onClose={() =>
            setEditingBudget(null)
          }
          onCreate={(data) =>
            updateBudget(
              editingBudget.id,
              data
            )
          }
        />
      )}

    </div>
  );
}

// =====================================================
// STAT CARD
// =====================================================

function BudgetStat({
  label,
  value,
  description,
  delay,
  green = false,
}: {
  label: string;
  value: number;
  description: string;
  delay: number;
  green?: boolean;
}) {
  return (
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
        delay,
      }}
      className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5"
    >

      <p className="text-xs text-white/35">
        {label}
      </p>

      <p
        className={`mt-4 text-2xl font-semibold ${
          green
            ? "text-[#00A67E]"
            : "text-white"
        }`}
      >
        ₹
        {value.toLocaleString("en-IN")}
      </p>

      <p className="mt-1 text-[11px] text-white/25">
        {description}
      </p>

    </motion.div>
  );
}

// =====================================================
// BUDGET CARD
// =====================================================

function BudgetCard({
  budget,
  index,
  onDelete,
  onEdit,
}: {
  budget: Budget;
  index: number;
  onDelete: (id: string) => void;
  onEdit: (budget: Budget) => void;
}) {
  const category = budget.categories[0];

  const Icon = getCategoryIcon(
    category?.name
  );

  const percentage = Math.min(
    budget.percentage,
    100
  );

  const exceeded =
    budget.totalSpent >
    budget.totalLimit;

  return (
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
        delay: index * 0.07,
      }}
      className="group rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 transition hover:border-white/[0.1]"
    >

      {/* TOP */}

      <div className="flex items-start justify-between">

        <div className="flex items-center gap-3">

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/[0.05]">
            <Icon
              size={18}
              className="text-[#00A67E]"
            />
          </div>

          <div>

            <p className="text-sm font-medium">
              {budget.name}
            </p>

            <p className="mt-1 text-[11px] text-white/25">
              {category?.name ||
                "General"}
            </p>

          </div>

        </div>

        <button
          className="flex h-8 w-8 items-center justify-center rounded-lg text-white/20 transition hover:bg-white/[0.05] hover:text-white"
        >
          <MoreHorizontal size={17} />
        </button>

      </div>

      {/* AMOUNT */}

      <div className="mt-6 flex items-end justify-between">

        <div>

          <p className="text-xl font-semibold">
            ₹
            {budget.totalSpent.toLocaleString(
              "en-IN"
            )}
          </p>

          <p className="mt-1 text-[11px] text-white/25">
            of ₹
            {budget.totalLimit.toLocaleString(
              "en-IN"
            )}
          </p>

        </div>

        <span
          className={`text-xs font-medium ${
            exceeded
              ? "text-red-400"
              : budget.percentage >= 80
              ? "text-yellow-400"
              : "text-[#00A67E]"
          }`}
        >
          {budget.percentage}%
        </span>

      </div>

      {/* PROGRESS */}

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/[0.06]">

        <motion.div
          initial={{
            width: 0,
          }}
          animate={{
            width: `${percentage}%`,
          }}
          transition={{
            duration: 0.8,
            ease: "easeOut",
          }}
          className={`h-full rounded-full ${
            exceeded
              ? "bg-red-400"
              : budget.percentage >= 80
              ? "bg-yellow-400"
              : "bg-[#00A67E]"
          }`}
        />

      </div>

      {/* BOTTOM */}

      <div className="mt-4 flex items-center justify-between">

        <p className="text-[10px] text-white/25">

          {exceeded
            ? `₹${(
                budget.totalSpent -
                budget.totalLimit
              ).toLocaleString(
                "en-IN"
              )} over budget`
            : `₹${Math.max(
                budget.remaining,
                0
              ).toLocaleString(
                "en-IN"
              )} remaining`}

        </p>

        <div className="flex gap-1">

          <button
            onClick={() =>
              onEdit(budget)
            }
            className="flex h-8 w-8 items-center justify-center rounded-lg text-white/25 hover:bg-white/[0.05] hover:text-white"
          >
            <Edit3 size={14} />
          </button>

          <button
            onClick={() =>
              onDelete(budget.id)
            }
            className="flex h-8 w-8 items-center justify-center rounded-lg text-white/25 hover:bg-red-400/10 hover:text-red-400"
          >
            <Trash2 size={14} />
          </button>

        </div>

      </div>

    </motion.div>
  );
}

// =====================================================
// CREATE / EDIT MODAL
// =====================================================

function CreateBudgetModal({
  categories,
  budget,
  onClose,
  onCreate,
}: {
  categories: Category[];
  budget?: Budget;
  onClose: () => void;
  onCreate: (
    data: CreateBudgetData
  ) => void;
}) {
  const [name, setName] = useState(
    budget?.name || ""
  );

  const [amount, setAmount] =
    useState(
      budget
        ? String(budget.amount)
        : ""
    );

  const [categoryId, setCategoryId] =
    useState(
      budget?.categories[0]
        ?.categoryId || ""
    );

  const [period, setPeriod] =
    useState<
      "MONTHLY" | "YEARLY"
    >(
      budget?.period ||
        "MONTHLY"
    );

  const [submitting, setSubmitting] =
    useState(false);

  async function handleSubmit(
    event: React.FormEvent
  ) {
    event.preventDefault();

    if (
      !name.trim() ||
      !amount ||
      !categoryId
    ) {
      return;
    }

    setSubmitting(true);

    try {
      await onCreate({
        name: name.trim(),
        amount: Number(amount),
        categoryId,
        period,
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">

      <motion.div
        initial={{
          opacity: 0,
          scale: 0.95,
          y: 10,
        }}
        animate={{
          opacity: 1,
          scale: 1,
          y: 0,
        }}
        className="w-full max-w-md rounded-2xl border border-white/[0.08] bg-[#0a0d0b] p-6 shadow-2xl"
      >

        {/* HEADER */}

        <div className="flex items-center justify-between">

          <div>

            <h2 className="text-lg font-semibold">
              {budget
                ? "Edit budget"
                : "Create budget"}
            </h2>

            <p className="mt-1 text-xs text-white/30">
              {budget
                ? "Update your spending limit."
                : "Set a spending limit for a category."}
            </p>

          </div>

          <button
            onClick={onClose}
            className="text-white/30 hover:text-white"
          >
            <X size={18} />
          </button>

        </div>

        {/* FORM */}

        <form
          onSubmit={handleSubmit}
          className="mt-6 space-y-4"
        >

          {/* NAME */}

          <div>

            <label className="mb-2 block text-xs text-white/40">
              Budget name
            </label>

            <input
              value={name}
              onChange={(event) =>
                setName(
                  event.target.value
                )
              }
              placeholder="e.g. Monthly Food"
              className="h-11 w-full rounded-xl border border-white/[0.07] bg-white/[0.025] px-3 text-sm text-white outline-none placeholder:text-white/20 focus:border-[#00A67E]/30"
            />

          </div>

          {/* CATEGORY */}

          <div>

            <label className="mb-2 block text-xs text-white/40">
              Category
            </label>

            <select
              value={categoryId}
              onChange={(event) =>
                setCategoryId(
                  event.target.value
                )
              }
              className="h-11 w-full rounded-xl border border-white/[0.07] bg-[#0d110f] px-3 text-sm text-white outline-none focus:border-[#00A67E]/30"
            >

              <option value="">
                Select category
              </option>

              {categories.map(
                (category) => (
                  <option
                    key={category.id}
                    value={category.id}
                  >
                    {category.name}
                  </option>
                )
              )}

            </select>

            {categories.length === 0 && (
              <p className="mt-2 text-[11px] text-yellow-400">
                Create a category first
                before creating a budget.
              </p>
            )}

          </div>

          {/* AMOUNT */}

          <div>

            <label className="mb-2 block text-xs text-white/40">
              Budget amount
            </label>

            <div className="flex h-11 items-center rounded-xl border border-white/[0.07] bg-white/[0.025] px-3">

              <span className="text-sm text-white/30">
                ₹
              </span>

              <input
                type="number"
                min="1"
                value={amount}
                onChange={(event) =>
                  setAmount(
                    event.target.value
                  )
                }
                placeholder="5000"
                className="h-full w-full bg-transparent px-2 text-sm text-white outline-none placeholder:text-white/20"
              />

            </div>

          </div>

          {/* PERIOD */}

          <div>

            <label className="mb-2 block text-xs text-white/40">
              Budget period
            </label>

            <div className="grid grid-cols-2 gap-2">

              <button
                type="button"
                onClick={() =>
                  setPeriod("MONTHLY")
                }
                className={`h-11 rounded-xl border text-sm transition ${
                  period === "MONTHLY"
                    ? "border-[#00A67E]/40 bg-[#00A67E]/10 text-[#00A67E]"
                    : "border-white/[0.07] bg-white/[0.025] text-white/40 hover:text-white"
                }`}
              >
                Monthly
              </button>

              <button
                type="button"
                onClick={() =>
                  setPeriod("YEARLY")
                }
                className={`h-11 rounded-xl border text-sm transition ${
                  period === "YEARLY"
                    ? "border-[#00A67E]/40 bg-[#00A67E]/10 text-[#00A67E]"
                    : "border-white/[0.07] bg-white/[0.025] text-white/40 hover:text-white"
                }`}
              >
                Yearly
              </button>

            </div>

          </div>

          {/* SUBMIT */}

          <button
            type="submit"
            disabled={
              submitting ||
              !name.trim() ||
              !amount ||
              !categoryId
            }
            className="mt-2 flex h-11 w-full items-center justify-center rounded-xl bg-[#00A67E] text-sm font-semibold text-black transition hover:bg-[#00b889] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {submitting
              ? "Saving..."
              : budget
              ? "Update budget"
              : "Create budget"}
          </button>

        </form>

      </motion.div>

    </div>
  );
}

// =====================================================
// EMPTY STATE
// =====================================================

function EmptyBudgets({
  onCreate,
}: {
  onCreate: () => void;
}) {
  return (
    <div className="flex min-h-[250px] flex-col items-center justify-center rounded-2xl border border-dashed border-white/[0.08] bg-white/[0.015]">

      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/[0.04]">
        <Wallet
          size={20}
          className="text-white/30"
        />
      </div>

      <p className="mt-4 text-sm text-white/60">
        No budgets yet
      </p>

      <p className="mt-1 text-center text-xs text-white/25">
        Create your first budget to
        start tracking your spending.
      </p>

      <button
        onClick={onCreate}
        className="mt-5 rounded-xl bg-[#00A67E] px-4 py-2 text-xs font-semibold text-black transition hover:bg-[#00b889]"
      >
        Create budget
      </button>

    </div>
  );
}

// =====================================================
// CATEGORY ICON
// =====================================================

function getCategoryIcon(
  categoryName?: string
) {
  if (!categoryName) {
    return Wallet;
  }

  const name =
    categoryName.toLowerCase();

  if (
    name.includes("food") ||
    name.includes("dining") ||
    name.includes("restaurant")
  ) {
    return Utensils;
  }

  if (
    name.includes("shopping") ||
    name.includes("shop")
  ) {
    return ShoppingBag;
  }

  if (
    name.includes("transport") ||
    name.includes("travel") ||
    name.includes("car")
  ) {
    return Car;
  }

  if (
    name.includes("housing") ||
    name.includes("rent") ||
    name.includes("home")
  ) {
    return Home;
  }

  return Wallet;
}

// =====================================================
// LOADING SKELETON
// =====================================================

function BudgetSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">

      <div className="h-16 w-72 rounded-xl bg-white/[0.04]" />

      <div className="grid gap-4 sm:grid-cols-3">

        {[1, 2, 3].map(
          (item) => (
            <div
              key={item}
              className="h-32 rounded-2xl bg-white/[0.04]"
            />
          )
        )}

      </div>

      <div className="h-32 rounded-2xl bg-white/[0.04]" />

      <div className="grid gap-4 lg:grid-cols-2">

        {[1, 2, 3, 4].map(
          (item) => (
            <div
              key={item}
              className="h-52 rounded-2xl bg-white/[0.04]"
            />
          )
        )}

      </div>

    </div>
  );
}