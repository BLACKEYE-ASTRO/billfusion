"use client";

import {
  ArrowDownRight,
  ArrowUpRight,
  IndianRupee,
  PiggyBank,
  Wallet,
  Receipt,
  type LucideIcon,
  icons as lucideIcons,
} from "lucide-react";

import {
  motion,
} from "motion/react";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

import {
  useDashboard,
} from "@/lib/hooks/use-dashboard";

export default function DashboardPage() {
  const {
    data,
    loading,
    error,
  } = useDashboard();

  if (loading) {
    return (
      <DashboardSkeleton />
    );
  }

  if (error || !data) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="rounded-2xl border border-red-400/10 bg-red-400/5 px-6 py-5 text-sm text-red-300">
          {error ||
            "Failed to load dashboard"}
        </div>
      </div>
    );
  }

  const {
    summary,
    chartData,
    spendingByCategory,
    recentTransactions,
    budgets,
    accounts,
  } = data;

  return (
    <div className="space-y-6">
      {/* HEADER */}

      <div>
        <p className="text-sm text-white/40">
          Overview
        </p>

        <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
          Your financial overview
        </h1>

        <p className="mt-2 text-sm text-white/35">
          Keep track of your money,
          spending and financial goals.
        </p>
      </div>

      {/* SUMMARY */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          title="Total Balance"
          value={summary.totalBalance}
          icon={Wallet}
        />

        <SummaryCard
          title="Income"
          value={summary.income}
          icon={ArrowUpRight}
          positive
        />

        <SummaryCard
          title="Expenses"
          value={summary.expenses}
          icon={ArrowDownRight}
          negative
        />

        <SummaryCard
          title="Savings"
          value={summary.savings}
          icon={PiggyBank}
          positive={
            summary.savings >= 0
          }
        />
      </div>

      {/* CHART + SPENDING */}

      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        {/* CHART */}

        <div className="rounded-3xl border border-white/8 bg-white/[0.025] p-5 sm:p-6">
          <div className="mb-6">
            <p className="text-sm font-medium">
              Income vs expenses
            </p>

            <p className="mt-1 text-xs text-white/30">
              Last 6 months
            </p>
          </div>

          <div className="h-[280px]">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <AreaChart
                data={chartData}
              >
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: "rgba(255,255,255,0.3)",
                    fontSize: 11,
                  }}
                />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: "rgba(255,255,255,0.3)",
                    fontSize: 11,
                  }}
                />

                <Tooltip
                  contentStyle={{
                    background:
                      "#0c100e",
                    border:
                      "1px solid rgba(255,255,255,0.08)",
                    borderRadius:
                      "12px",
                    color: "white",
                  }}
                  formatter={(
                    value
                  ) =>
                    `₹${Number(
                      value
                    ).toLocaleString(
                      "en-IN"
                    )}`
                  }
                />

                <Area
                  type="monotone"
                  dataKey="income"
                  stroke="#34d399"
                  fill="#34d399"
                  fillOpacity={0.08}
                  strokeWidth={2}
                />

                <Area
                  type="monotone"
                  dataKey="expense"
                  stroke="#fb7185"
                  fill="#fb7185"
                  fillOpacity={0.05}
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* SPENDING */}

        <div className="rounded-3xl border border-white/8 bg-white/[0.025] p-5 sm:p-6">
          <div className="mb-6">
            <p className="text-sm font-medium">
              Spending breakdown
            </p>

            <p className="mt-1 text-xs text-white/30">
              This month
            </p>
          </div>

          {spendingByCategory.length ===
          0 ? (
            <EmptyState text="No expenses this month." />
          ) : (
            <div className="space-y-5">
              {spendingByCategory
                .slice(0, 6)
                .map((category) => (
                  <div
                    key={
                      category.id
                    }
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className="h-2.5 w-2.5 rounded-full"
                          style={{
                            background:
                              category.color ||
                              "#34d399",
                          }}
                        />

                        <span className="text-sm text-white/70">
                          {
                            category.name
                          }
                        </span>
                      </div>

                      <span className="text-sm font-medium">
                        ₹
                        {category.amount.toLocaleString(
                          "en-IN"
                        )}
                      </span>
                    </div>

                    <div className="h-1.5 overflow-hidden rounded-full bg-white/5">
                      <motion.div
                        initial={{
                          width: 0,
                        }}
                        animate={{
                          width: `${Math.min(
                            category.percentage,
                            100
                          )}%`,
                        }}
                        transition={{
                          duration:
                            0.8,
                        }}
                        className="h-full rounded-full"
                        style={{
                          background:
                            category.color ||
                            "#34d399",
                        }}
                      />
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>

      {/* ACCOUNTS */}

      <div>
        <div className="mb-4">
          <h2 className="text-sm font-medium">
            Your accounts
          </h2>

          <p className="mt-1 text-xs text-white/30">
            Current account balances
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {accounts.map(
            (account) => (
              <div
                key={account.id}
                className="rounded-2xl border border-white/8 bg-white/[0.025] p-5"
              >
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5">
                    <Wallet
                      size={18}
                      className="text-emerald-400"
                    />
                  </div>

                  <span className="text-[10px] uppercase tracking-wider text-white/25">
                    {
                      account.type
                    }
                  </span>
                </div>

                <p className="text-sm text-white/40">
                  {account.name}
                </p>

                <p className="mt-1 text-xl font-semibold">
                  ₹
                  {account.balance.toLocaleString(
                    "en-IN"
                  )}
                </p>
              </div>
            )
          )}
        </div>
      </div>

      {/* BUDGET */}

      <div className="rounded-3xl border border-white/8 bg-white/[0.025] p-5 sm:p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-medium">
              Budget overview
            </h2>

            <p className="mt-1 text-xs text-white/30">
              Your active budgets
            </p>
          </div>

          <a
            href="/dashboard/budgets"
            className="text-xs text-emerald-400 hover:text-emerald-300"
          >
            View all
          </a>
        </div>

        {budgets.length === 0 ? (
          <EmptyState text="You haven't created a budget yet." />
        ) : (
          <div className="space-y-6">
            {budgets
              .slice(0, 3)
              .map((budget) => (
                <div
                  key={budget.id}
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm text-white/70">
                      {budget.name}
                    </span>

                    <span className="text-xs text-white/40">
                      ₹
                      {budget.totalSpent.toLocaleString(
                        "en-IN"
                      )}{" "}
                      / ₹
                      {budget.totalLimit.toLocaleString(
                        "en-IN"
                      )}
                    </span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-white/5">
                    <motion.div
                      initial={{
                        width: 0,
                      }}
                      animate={{
                        width: `${Math.min(
                          budget.percentage,
                          100
                        )}%`,
                      }}
                      transition={{
                        duration: 0.8,
                      }}
                      className="h-full rounded-full bg-emerald-400"
                    />
                  </div>

                  <div className="mt-2 flex justify-between text-[11px] text-white/25">
                    <span>
                      {Math.round(
                        budget.percentage
                      )}
                      % used
                    </span>

                    <span>
                      ₹
                      {Math.max(
                        budget.remaining,
                        0
                      ).toLocaleString(
                        "en-IN"
                      )}{" "}
                      remaining
                    </span>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* RECENT TRANSACTIONS */}

      <div className="rounded-3xl border border-white/8 bg-white/[0.025] p-5 sm:p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-medium">
              Recent transactions
            </h2>

            <p className="mt-1 text-xs text-white/30">
              Your latest activity
            </p>
          </div>

          <a
            href="/dashboard/transactions"
            className="text-xs text-emerald-400 hover:text-emerald-300"
          >
            View all
          </a>
        </div>

        {recentTransactions.length ===
        0 ? (
          <EmptyState text="No transactions yet." />
        ) : (
          <div className="space-y-1">
            {recentTransactions.map(
              (transaction) => {
                const isIncome =
                  transaction.type ===
                  "INCOME";

                return (
                  <div
                    key={
                      transaction.id
                    }
                    className="flex items-center justify-between rounded-2xl px-3 py-3 hover:bg-white/[0.025]"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/5">
                        <CategoryIcon
                          icon={
                            transaction
                              .category
                              ?.icon
                          }
                          isIncome={
                            isIncome
                          }
                        />
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">
                          {transaction.merchant ||
                            transaction.description ||
                            "Transaction"}
                        </p>

                        <p className="mt-1 truncate text-xs text-white/30">
                          {transaction
                            .category
                            ?.name ||
                            transaction
                              .account
                              ?.name ||
                            "General"}
                        </p>
                      </div>
                    </div>

                    <div className="ml-4 shrink-0 text-right">
                      <p
                        className={`text-sm font-medium ${
                          isIncome
                            ? "text-emerald-400"
                            : "text-white"
                        }`}
                      >
                        {isIncome
                          ? "+"
                          : "-"}
                        ₹
                        {transaction.amount.toLocaleString(
                          "en-IN"
                        )}
                      </p>

                      <p className="mt-1 text-[10px] text-white/25">
                        {new Date(
                          transaction.date
                        ).toLocaleDateString(
                          "en-IN"
                        )}
                      </p>
                    </div>
                  </div>
                );
              }
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Renders a category's icon.
 *
 * `category.icon` can come through in a few different shapes depending on
 * where the data originated (seeded categories, user-created categories,
 * import scripts, etc). This resolves all of them instead of silently
 * failing:
 *  - A Lucide icon name, e.g. "ShoppingCart" or "shopping-cart" -> resolved
 *    via the lucide-react icon map and rendered as a real <Icon />.
 *  - An emoji / plain character, e.g. "🍔" -> rendered directly, with a
 *    guaranteed font-size so it isn't invisible at tiny inherited sizes.
 *  - Missing / unknown -> falls back to a neutral icon instead of rendering
 *    nothing.
 */
function CategoryIcon({
  icon,
  isIncome,
}: {
  icon?: string | null;
  isIncome?: boolean;
}) {
  const fallbackClass = isIncome
    ? "text-emerald-400"
    : "text-white/50";

  if (!icon) {
    return (
      <Receipt
        size={18}
        className={fallbackClass}
      />
    );
  }

  // Try to resolve as a Lucide icon name (handles "ShoppingCart",
  // "shopping-cart", "shopping_cart", etc).
  const pascalCaseName = icon
    .replace(/[-_\s]+(.)/g, (_, chr) =>
      chr.toUpperCase()
    )
    .replace(/^(.)/, (chr) =>
      chr.toUpperCase()
    );

  const LucideMatch = (lucideIcons as Record<
    string,
    LucideIcon
  >)[pascalCaseName];

  if (LucideMatch) {
    return (
      <LucideMatch
        size={18}
        className={fallbackClass}
      />
    );
  }

  // Not a recognized icon name — treat it as an emoji/character.
  // Force a visible font-size since it may otherwise inherit a tiny
  // size from a parent (e.g. text-[10px]/text-xs contexts).
  return (
    <span className="text-lg leading-none">
      {icon}
    </span>
  );
}

function SummaryCard({
  title,
  value,
  icon: Icon,
  positive,
  negative,
}: {
  title: string;
  value: number;
  icon: React.ElementType;
  positive?: boolean;
  negative?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-white/8 bg-white/[0.025] p-5">
      <div className="mb-5 flex items-center justify-between">
        <span className="text-xs text-white/35">
          {title}
        </span>

        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5">
          <Icon
            size={16}
            className={
              positive
                ? "text-emerald-400"
                : negative
                ? "text-rose-400"
                : "text-white/50"
            }
          />
        </div>
      </div>

      <div className="flex items-center gap-1">
        <IndianRupee
          size={17}
          className="text-white/40"
        />

        <span className="text-2xl font-semibold tracking-tight">
          {value.toLocaleString(
            "en-IN"
          )}
        </span>
      </div>
    </div>
  );
}

function EmptyState({
  text,
}: {
  text: string;
}) {
  return (
    <div className="flex min-h-[120px] items-center justify-center rounded-2xl border border-dashed border-white/8">
      <p className="text-xs text-white/25">
        {text}
      </p>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-12 w-72 rounded-xl bg-white/5" />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[1, 2, 3, 4].map(
          (item) => (
            <div
              key={item}
              className="h-32 rounded-2xl bg-white/5"
            />
          )
        )}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <div className="h-[370px] rounded-3xl bg-white/5" />

        <div className="h-[370px] rounded-3xl bg-white/5" />
      </div>

      <div className="h-48 rounded-3xl bg-white/5" />

      <div className="h-80 rounded-3xl bg-white/5" />
    </div>
  );
}