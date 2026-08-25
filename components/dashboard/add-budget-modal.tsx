"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Loader2,
  Plus,
  Trash2,
  WalletCards,
  X,
} from "lucide-react";

import {
  AnimatePresence,
  motion,
} from "motion/react";

import {
  createBudget,
} from "@/lib/api/budgets";

type Category = {
  id: string;
  name: string;
  icon: string | null;
  color: string | null;
  isIncome: boolean;
};

type Props = {
  open: boolean;
  onClose: () => void;
  categories: Category[];
  onSuccess: () => void;
};

type BudgetCategoryInput = {
  categoryId: string;
  limit: string;
};

export default function AddBudgetModal({
  open,
  onClose,
  categories,
  onSuccess,
}: Props) {
  const [name, setName] =
    useState("");

  const [amount, setAmount] =
    useState("");

  const [period, setPeriod] =
    useState<
      "MONTHLY" | "YEARLY"
    >("MONTHLY");

  const [categoryRows, setCategoryRows] =
    useState<
      BudgetCategoryInput[]
    >([
      {
        categoryId: "",
        limit: "",
      },
    ]);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  useEffect(() => {
    if (!open) return;

    setName("");
    setAmount("");
    setPeriod("MONTHLY");

    setCategoryRows([
      {
        categoryId: "",
        limit: "",
      },
    ]);

    setError("");
  }, [open]);

  const expenseCategories =
    useMemo(
      () =>
        categories.filter(
          (category) =>
            !category.isIncome
        ),
      [categories]
    );

  const categoryTotal =
    categoryRows.reduce(
      (sum, row) =>
        sum +
        Number(row.limit || 0),
      0
    );

  const addCategory = () => {
    setCategoryRows([
      ...categoryRows,
      {
        categoryId: "",
        limit: "",
      },
    ]);
  };

  const removeCategory = (
    index: number
  ) => {
    if (
      categoryRows.length === 1
    ) {
      return;
    }

    setCategoryRows(
      categoryRows.filter(
        (_, i) => i !== index
      )
    );
  };

  const updateCategory = (
    index: number,
    field:
      | "categoryId"
      | "limit",
    value: string
  ) => {
    setCategoryRows(
      categoryRows.map(
        (row, i) =>
          i === index
            ? {
                ...row,
                [field]: value,
              }
            : row
      )
    );
  };

  const getStartEndDates =
    () => {
      const now = new Date();

      if (
        period === "MONTHLY"
      ) {
        return {
          startDate:
            new Date(
              now.getFullYear(),
              now.getMonth(),
              1
            )
              .toISOString(),

          endDate:
            new Date(
              now.getFullYear(),
              now.getMonth() + 1,
              0,
              23,
              59,
              59
            )
              .toISOString(),
        };
      }

      return {
        startDate:
          new Date(
            now.getFullYear(),
            0,
            1
          ).toISOString(),

        endDate:
          new Date(
            now.getFullYear(),
            11,
            31,
            23,
            59,
            59
          ).toISOString(),
      };
    };

  const handleSubmit = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    setError("");

    if (!name.trim()) {
      setError(
        "Enter a budget name."
      );
      return;
    }

    if (
      !amount ||
      Number(amount) <= 0
    ) {
      setError(
        "Enter a valid budget amount."
      );
      return;
    }

    const validRows =
      categoryRows.filter(
        (row) =>
          row.categoryId &&
          Number(row.limit) > 0
      );

    if (
      validRows.length === 0
    ) {
      setError(
        "Add at least one category."
      );
      return;
    }

    const categoryIds =
      validRows.map(
        (row) =>
          row.categoryId
      );

    if (
      new Set(categoryIds)
        .size !==
      categoryIds.length
    ) {
      setError(
        "A category can only be added once."
      );
      return;
    }

    if (
      categoryTotal >
      Number(amount)
    ) {
      setError(
        "Category limits cannot exceed the total budget."
      );
      return;
    }

    try {
      setLoading(true);

      const dates =
        getStartEndDates();

      await createBudget({
        name: name.trim(),

        amount: Number(amount),

        period,

        startDate:
          dates.startDate,

        endDate:
          dates.endDate,

        categories:
          validRows.map(
            (row) => ({
              categoryId:
                row.categoryId,

              limit:
                Number(
                  row.limit
                ),
            })
          ),
      });

      onSuccess();
      onClose();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to create budget."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          exit={{
            opacity: 0,
          }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
        >
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.96,
              y: 15,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl border border-white/10 bg-[#0b0e0c] shadow-2xl"
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/8 bg-[#0b0e0c] px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-400">
                  <WalletCards
                    size={18}
                  />
                </div>

                <div>
                  <h2 className="font-semibold">
                    Create budget
                  </h2>

                  <p className="mt-1 text-xs text-white/35">
                    Set limits for your spending.
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="flex h-9 w-9 items-center justify-center rounded-xl text-white/40 hover:bg-white/5 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <form
              onSubmit={
                handleSubmit
              }
              className="space-y-6 p-6"
            >
              <div>
                <label className="mb-2 block text-xs text-white/50">
                  Budget name
                </label>

                <input
                  value={name}
                  onChange={(e) =>
                    setName(
                      e.target.value
                    )
                  }
                  placeholder="August Budget"
                  className="input"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs text-white/50">
                    Total budget
                  </label>

                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">
                      ₹
                    </span>

                    <input
                      type="number"
                      min="1"
                      value={amount}
                      onChange={(e) =>
                        setAmount(
                          e.target.value
                        )
                      }
                      placeholder="30000"
                      className="input pl-9"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-xs text-white/50">
                    Period
                  </label>

                  <select
                    value={period}
                    onChange={(e) =>
                      setPeriod(
                        e.target
                          .value as
                          | "MONTHLY"
                          | "YEARLY"
                      )
                    }
                    className="input"
                  >
                    <option value="MONTHLY">
                      Monthly
                    </option>

                    <option value="YEARLY">
                      Yearly
                    </option>
                  </select>
                </div>
              </div>

              <div>
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <label className="block text-xs text-white/50">
                      Categories
                    </label>

                    <p className="mt-1 text-[11px] text-white/25">
                      Assign a spending limit to each category.
                    </p>
                  </div>

                  <span className="text-xs text-white/40">
                    ₹
                    {categoryTotal.toLocaleString(
                      "en-IN"
                    )}{" "}
                    / ₹
                    {Number(
                      amount || 0
                    ).toLocaleString(
                      "en-IN"
                    )}
                  </span>
                </div>

                <div className="space-y-2">
                  {categoryRows.map(
                    (
                      row,
                      index
                    ) => (
                      <div
                        key={index}
                        className="flex gap-2"
                      >
                        <select
                          value={
                            row.categoryId
                          }
                          onChange={(
                            e
                          ) =>
                            updateCategory(
                              index,
                              "categoryId",
                              e
                                .target
                                .value
                            )
                          }
                          className="input min-w-0 flex-1"
                        >
                          <option value="">
                            Select category
                          </option>

                          {expenseCategories
                            .filter(
                              (
                                category
                              ) =>
                                !categoryRows.some(
                                  (
                                    existing,
                                    existingIndex
                                  ) =>
                                    existingIndex !==
                                      index &&
                                    existing.categoryId ===
                                      category.id
                                )
                            )
                            .map(
                              (
                                category
                              ) => (
                                <option
                                  key={
                                    category.id
                                  }
                                  value={
                                    category.id
                                  }
                                >
                                  {category.icon
                                    ? `${category.icon} `
                                    : ""}
                                  {
                                    category.name
                                  }
                                </option>
                              )
                            )}
                        </select>

                        <div className="relative w-32 shrink-0">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30">
                            ₹
                          </span>

                          <input
                            type="number"
                            min="1"
                            value={
                              row.limit
                            }
                            onChange={(
                              e
                            ) =>
                              updateCategory(
                                index,
                                "limit",
                                e
                                  .target
                                  .value
                              )
                            }
                            placeholder="5000"
                            className="input pl-8"
                          />
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            removeCategory(
                              index
                            )
                          }
                          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/8 text-white/25 hover:border-red-400/20 hover:bg-red-400/5 hover:text-red-400"
                        >
                          <Trash2
                            size={15}
                          />
                        </button>
                      </div>
                    )
                  )}
                </div>

                <button
                  type="button"
                  onClick={
                    addCategory
                  }
                  className="mt-3 flex h-10 items-center gap-2 rounded-xl border border-dashed border-white/10 px-4 text-xs text-white/40 hover:border-emerald-400/30 hover:text-emerald-400"
                >
                  <Plus size={15} />
                  Add category
                </button>
              </div>

              {error && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-xs text-red-300">
                  {error}
                </div>
              )}

              <div className="flex gap-3 border-t border-white/8 pt-5">
                <button
                  type="button"
                  onClick={
                    onClose
                  }
                  disabled={
                    loading
                  }
                  className="h-11 flex-1 rounded-xl border border-white/10 text-sm text-white/60 hover:bg-white/5"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={
                    loading
                  }
                  className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-400 text-sm font-semibold text-black hover:bg-emerald-300 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2
                        size={16}
                        className="animate-spin"
                      />
                      Creating...
                    </>
                  ) : (
                    "Create budget"
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