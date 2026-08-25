"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  ArrowDownLeft,
  ArrowUpRight,
  PiggyBank,
  TrendingUp,
  RefreshCw,
} from "lucide-react";

type Transaction = {
  id: string;
  type: "INCOME" | "EXPENSE";
  amount: number;
  description?: string | null;
  date: string;
  category?: {
    id?: string;
    name: string;
    color?: string | null;
    icon?: string | null;
  } | null;
};

type MonthlyData = {
  month: string;
  income: number;
  expense: number;
};

type CategoryData = {
  name: string;
  value: number;
  amount: number;
};

const CATEGORY_COLORS = [
  "#00A67E",
  "#5B8DEF",
  "#F59E0B",
  "#EF4444",
  "#A855F7",
  "#EC4899",
  "#14B8A6",
  "#F97316",
];

export default function AnalyticsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [period, setPeriod] = useState("8");

  async function fetchTransactions() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/transactions", {
        method: "GET",
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to fetch transactions"
        );
      }

      setTransactions(data.transactions || []);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to load analytics"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTransactions();
  }, []);

  /*
   * -------------------------------------------------------
   * FILTER TRANSACTIONS
   * -------------------------------------------------------
   */

  const filteredTransactions = useMemo(() => {
    const months = Number(period);

    const startDate = new Date();

    startDate.setMonth(startDate.getMonth() - months + 1);

    startDate.setDate(1);
    startDate.setHours(0, 0, 0, 0);

    return transactions.filter((transaction) => {
      const date = new Date(transaction.date);

      return date >= startDate;
    });
  }, [transactions, period]);

  /*
   * -------------------------------------------------------
   * CURRENT MONTH
   * -------------------------------------------------------
   */

  const currentMonthTransactions = useMemo(() => {
    const now = new Date();

    return transactions.filter((transaction) => {
      const date = new Date(transaction.date);

      return (
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear()
      );
    });
  }, [transactions]);

  /*
   * -------------------------------------------------------
   * TOTAL INCOME
   * -------------------------------------------------------
   */

  const totalIncome = useMemo(() => {
    return currentMonthTransactions
      .filter((transaction) => transaction.type === "INCOME")
      .reduce((sum, transaction) => sum + Number(transaction.amount), 0);
  }, [currentMonthTransactions]);

  /*
   * -------------------------------------------------------
   * TOTAL EXPENSE
   * -------------------------------------------------------
   */

  const totalExpenses = useMemo(() => {
    return currentMonthTransactions
      .filter((transaction) => transaction.type === "EXPENSE")
      .reduce((sum, transaction) => sum + Number(transaction.amount), 0);
  }, [currentMonthTransactions]);

  /*
   * -------------------------------------------------------
   * SAVINGS
   * -------------------------------------------------------
   */

  const savings = Math.max(totalIncome - totalExpenses, 0);

  /*
   * -------------------------------------------------------
   * SAVINGS RATE
   * -------------------------------------------------------
   */

  const savingsRate =
    totalIncome > 0
      ? Math.round((savings / totalIncome) * 100)
      : 0;

  /*
   * -------------------------------------------------------
   * MONTHLY CASH FLOW
   * -------------------------------------------------------
   */

  const cashFlowData = useMemo<MonthlyData[]>(() => {
    const months = Number(period);

    const result: MonthlyData[] = [];

    for (let i = months - 1; i >= 0; i--) {
      const date = new Date();

      date.setMonth(date.getMonth() - i);

      const year = date.getFullYear();
      const month = date.getMonth();

      const monthTransactions = filteredTransactions.filter(
        (transaction) => {
          const transactionDate = new Date(transaction.date);

          return (
            transactionDate.getFullYear() === year &&
            transactionDate.getMonth() === month
          );
        }
      );

      const income = monthTransactions
        .filter(
          (transaction) => transaction.type === "INCOME"
        )
        .reduce(
          (sum, transaction) =>
            sum + Number(transaction.amount),
          0
        );

      const expense = monthTransactions
        .filter(
          (transaction) => transaction.type === "EXPENSE"
        )
        .reduce(
          (sum, transaction) =>
            sum + Number(transaction.amount),
          0
        );

      result.push({
        month: date.toLocaleDateString("en-IN", {
          month: "short",
        }),
        income,
        expense,
      });
    }

    return result;
  }, [filteredTransactions, period]);

  /*
   * -------------------------------------------------------
   * CATEGORY SPENDING
   * -------------------------------------------------------
   */

  const categoryData = useMemo<CategoryData[]>(() => {
    const map = new Map<string, number>();

    filteredTransactions
      .filter(
        (transaction) =>
          transaction.type === "EXPENSE"
      )
      .forEach((transaction) => {
        const category =
          transaction.category?.name || "Other";

        const amount = Number(transaction.amount);

        map.set(
          category,
          (map.get(category) || 0) + amount
        );
      });

    const total = Array.from(map.values()).reduce(
      (sum, amount) => sum + amount,
      0
    );

    return Array.from(map.entries())
      .map(([name, amount]) => ({
        name,
        amount,
        value:
          total > 0
            ? Math.round((amount / total) * 100)
            : 0,
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [filteredTransactions]);

  /*
   * -------------------------------------------------------
   * PREVIOUS MONTH COMPARISON
   * -------------------------------------------------------
   */

  const previousMonthData = useMemo(() => {
    const now = new Date();

    const previousMonth = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      1
    );

    const month = previousMonth.getMonth();
    const year = previousMonth.getFullYear();

    const previousTransactions = transactions.filter(
      (transaction) => {
        const date = new Date(transaction.date);

        return (
          date.getMonth() === month &&
          date.getFullYear() === year
        );
      }
    );

    const income = previousTransactions
      .filter(
        (transaction) =>
          transaction.type === "INCOME"
      )
      .reduce(
        (sum, transaction) =>
          sum + Number(transaction.amount),
        0
      );

    const expenses = previousTransactions
      .filter(
        (transaction) =>
          transaction.type === "EXPENSE"
      )
      .reduce(
        (sum, transaction) =>
          sum + Number(transaction.amount),
        0
      );

    const savings = Math.max(income - expenses, 0);

    const savingsRate =
      income > 0
        ? (savings / income) * 100
        : 0;

    return {
      income,
      expenses,
      savings,
      savingsRate,
    };
  }, [transactions]);

  /*
   * -------------------------------------------------------
   * PERCENTAGE CHANGE
   * -------------------------------------------------------
   */

  function percentageChange(
    current: number,
    previous: number
  ) {
    if (previous === 0) {
      return current > 0 ? 100 : 0;
    }

    return Math.round(
      ((current - previous) / previous) * 100
    );
  }

  const incomeChange = percentageChange(
    totalIncome,
    previousMonthData.income
  );

  const expenseChange = percentageChange(
    totalExpenses,
    previousMonthData.expenses
  );

  const savingsChange = percentageChange(
    savings,
    previousMonthData.savings
  );

  const savingsRateChange = Math.round(
    savingsRate - previousMonthData.savingsRate
  );

  /*
   * -------------------------------------------------------
   * LOADING
   * -------------------------------------------------------
   */

  if (loading) {
    return <AnalyticsSkeleton />;
  }

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
            Analytics
          </p>

          <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            Understand your money
          </h1>

          <p className="mt-2 max-w-xl text-sm text-white/35">
            Discover spending patterns and see how your
            financial health changes over time.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={period}
            onChange={(event) =>
              setPeriod(event.target.value)
            }
            className="
              h-10
              rounded-xl
              border border-white/[0.07]
              bg-white/[0.025]
              px-3
              text-xs
              text-white/60
              outline-none
            "
          >
            <option value="3">
              Last 3 months
            </option>

            <option value="6">
              Last 6 months
            </option>

            <option value="8">
              Last 8 months
            </option>

            <option value="12">
              Last 12 months
            </option>
          </select>

          <button
            onClick={fetchTransactions}
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-xl
              border
              border-white/[0.07]
              bg-white/[0.025]
              text-white/40
              transition
              hover:bg-white/[0.05]
              hover:text-white
            "
          >
            <RefreshCw size={15} />
          </button>
        </div>
      </motion.div>

      {/* ERROR */}

      {error && (
        <div className="rounded-xl border border-red-400/10 bg-red-400/5 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {/* STATS */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <AnalyticsStat
          title="Income"
          value={totalIncome}
          change={`${incomeChange >= 0 ? "+" : ""}${incomeChange}%`}
          icon={ArrowDownLeft}
          positive={incomeChange >= 0}
          delay={0}
        />

        <AnalyticsStat
          title="Expenses"
          value={totalExpenses}
          change={`${expenseChange >= 0 ? "+" : ""}${expenseChange}%`}
          icon={ArrowUpRight}
          positive={expenseChange <= 0}
          delay={0.06}
        />

        <AnalyticsStat
          title="Savings"
          value={savings}
          change={`${savingsChange >= 0 ? "+" : ""}${savingsChange}%`}
          icon={PiggyBank}
          positive={savingsChange >= 0}
          delay={0.12}
        />

        <AnalyticsStat
          title="Savings rate"
          value={`${savingsRate}%`}
          change={`${savingsRateChange >= 0 ? "+" : ""}${savingsRateChange}%`}
          icon={TrendingUp}
          positive={savingsRateChange >= 0}
          delay={0.18}
        />
      </div>

      {/* CASH FLOW */}

      <motion.div
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          delay: 0.2,
        }}
        className="
          rounded-2xl
          border
          border-white/[0.07]
          bg-white/[0.025]
          p-5
          sm:p-6
        "
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">
              Income vs expenses
            </p>

            <p className="mt-1 text-xs text-white/30">
              Your monthly cash flow
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Legend
              label="Income"
              color="#00A67E"
            />

            <Legend
              label="Expenses"
              color="rgba(255,255,255,0.35)"
            />
          </div>
        </div>

        <div className="mt-6 h-[320px]">
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <AreaChart data={cashFlowData}>
              <defs>
                <linearGradient
                  id="analyticsIncome"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    stopColor="#00A67E"
                    stopOpacity={0.2}
                  />

                  <stop
                    offset="100%"
                    stopColor="#00A67E"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>

              <CartesianGrid
                vertical={false}
                stroke="rgba(255,255,255,0.05)"
              />

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
                  background: "#0c100e",
                  border:
                    "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 12,
                  color: "#fff",
                }}
                formatter={(value) =>
                  `₹${Number(value).toLocaleString(
                    "en-IN"
                  )}`
                }
              />

              <Area
                type="monotone"
                dataKey="income"
                stroke="#00A67E"
                strokeWidth={2}
                fill="url(#analyticsIncome)"
              />

              <Area
                type="monotone"
                dataKey="expense"
                stroke="rgba(255,255,255,0.35)"
                strokeWidth={2}
                fill="transparent"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* LOWER ANALYTICS */}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* CATEGORY DISTRIBUTION */}

        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.25,
          }}
          className="
            rounded-2xl
            border
            border-white/[0.07]
            bg-white/[0.025]
            p-5
            sm:p-6
          "
        >
          <div>
            <p className="text-sm font-medium">
              Spending distribution
            </p>

            <p className="mt-1 text-xs text-white/30">
              Where your money goes
            </p>
          </div>

          {categoryData.length === 0 ? (
            <EmptyChart text="No expense data available yet." />
          ) : (
            <div className="mt-5 flex flex-col items-center gap-6 sm:flex-row">
              <div className="h-[230px] w-full sm:w-[50%]">
                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >
                  <PieChart>
                    <Pie
                      data={categoryData}
                      dataKey="amount"
                      nameKey="name"
                      innerRadius={65}
                      outerRadius={90}
                      paddingAngle={3}
                    >
                      {categoryData.map(
                        (category, index) => (
                          <Cell
                            key={category.name}
                            fill={
                              CATEGORY_COLORS[
                                index %
                                  CATEGORY_COLORS.length
                              ]
                            }
                          />
                        )
                      )}
                    </Pie>

                    <Tooltip
                      contentStyle={{
                        background: "#0c100e",
                        border:
                          "1px solid rgba(255,255,255,0.08)",
                        borderRadius: 12,
                      }}
                      formatter={(value) =>
                        `₹${Number(
                          value
                        ).toLocaleString("en-IN")}`
                      }
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="w-full space-y-3 sm:w-[50%]">
                {categoryData.map(
                  (category, index) => (
                    <div
                      key={category.name}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="h-2 w-2 rounded-full"
                          style={{
                            backgroundColor:
                              CATEGORY_COLORS[
                                index %
                                  CATEGORY_COLORS.length
                              ],
                          }}
                        />

                        <span className="text-xs text-white/45">
                          {category.name}
                        </span>
                      </div>

                      <span className="text-xs font-medium">
                        {category.value}%
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>
          )}
        </motion.div>

        {/* CATEGORY SPENDING */}

        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.3,
          }}
          className="
            rounded-2xl
            border
            border-white/[0.07]
            bg-white/[0.025]
            p-5
            sm:p-6
          "
        >
          <div>
            <p className="text-sm font-medium">
              Spending by category
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

          {categoryData.length === 0 ? (
            <EmptyChart text="No expense data available yet." />
          ) : (
            <div className="mt-6 h-[260px]">
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <BarChart
                  data={categoryData.slice(0, 6)}
                  layout="vertical"
                >
                  <CartesianGrid
                    horizontal={false}
                    stroke="rgba(255,255,255,0.05)"
                  />

                  <XAxis
                    type="number"
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fill: "rgba(255,255,255,0.25)",
                      fontSize: 10,
                    }}
                  />

                  <YAxis
                    type="category"
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    width={80}
                    tick={{
                      fill: "rgba(255,255,255,0.4)",
                      fontSize: 10,
                    }}
                  />

                  <Tooltip
                    cursor={{
                      fill: "rgba(255,255,255,0.02)",
                    }}
                    contentStyle={{
                      background: "#0c100e",
                      border:
                        "1px solid rgba(255,255,255,0.08)",
                      borderRadius: 12,
                    }}
                    formatter={(value) =>
                      `₹${Number(
                        value
                      ).toLocaleString("en-IN")}`
                    }
                  />

                  <Bar
                    dataKey="amount"
                    fill="#00A67E"
                    radius={[0, 6, 6, 0]}
                    barSize={18}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </motion.div>
      </div>

      {/* INSIGHT */}

      <motion.div
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          delay: 0.35,
        }}
        className="
          rounded-2xl
          border
          border-[#00A67E]/15
          bg-[#00A67E]/[0.04]
          p-5
          sm:p-6
        "
      >
        <p className="text-xs font-medium uppercase tracking-[0.15em] text-[#00A67E]">
          Financial insight
        </p>

        <h3 className="mt-3 text-lg font-semibold">
          {generateInsight(
            totalIncome,
            totalExpenses,
            savingsRate,
            categoryData
          )}
        </h3>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-white/35">
          {categoryData.length > 0
            ? `Your largest spending category is ${
                categoryData[0].name
              }, accounting for ${
                categoryData[0].value
              }% of your tracked expenses.`
            : "Start adding transactions to see personalized financial insights."}
        </p>
      </motion.div>
    </div>
  );
}

/*
 * -------------------------------------------------------
 * STAT CARD
 * -------------------------------------------------------
 */

function AnalyticsStat({
  title,
  value,
  change,
  icon: Icon,
  positive,
  delay,
}: {
  title: string;
  value: number | string;
  change: string;
  icon: React.ElementType;
  positive: boolean;
  delay: number;
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
      className="
        rounded-2xl
        border
        border-white/[0.07]
        bg-white/[0.025]
        p-5
      "
    >
      <div className="flex items-center justify-between">
        <span className="text-xs text-white/35">
          {title}
        </span>

        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.05]">
          <Icon
            size={17}
            className="text-[#00A67E]"
          />
        </div>
      </div>

      <div className="mt-5 flex items-end justify-between">
        <p className="text-xl font-semibold">
          {typeof value === "number"
            ? `₹${value.toLocaleString("en-IN")}`
            : value}
        </p>

        <span
          className={`text-xs ${
            positive
              ? "text-[#00A67E]"
              : "text-red-400"
          }`}
        >
          {change}
        </span>
      </div>
    </motion.div>
  );
}

/*
 * -------------------------------------------------------
 * LEGEND
 * -------------------------------------------------------
 */

function Legend({
  label,
  color,
}: {
  label: string;
  color: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <span
        className="h-2 w-2 rounded-full"
        style={{
          backgroundColor: color,
        }}
      />

      <span className="text-[10px] text-white/30">
        {label}
      </span>
    </div>
  );
}

/*
 * -------------------------------------------------------
 * EMPTY CHART
 * -------------------------------------------------------
 */

function EmptyChart({
  text,
}: {
  text: string;
}) {
  return (
    <div className="flex h-[230px] items-center justify-center">
      <p className="text-xs text-white/25">
        {text}
      </p>
    </div>
  );
}

/*
 * -------------------------------------------------------
 * INSIGHT GENERATOR
 * -------------------------------------------------------
 */

function generateInsight(
  income: number,
  expenses: number,
  savingsRate: number,
  categories: CategoryData[]
) {
  if (income === 0 && expenses === 0) {
    return "Add transactions to start understanding your money.";
  }

  if (expenses > income) {
    return "Your expenses are higher than your income this month.";
  }

  if (savingsRate >= 40) {
    return "Excellent work — you are maintaining a strong savings rate.";
  }

  if (savingsRate >= 20) {
    return "You are maintaining a healthy balance between spending and saving.";
  }

  if (categories.length > 0) {
    return `${categories[0].name} is currently your biggest spending category.`;
  }

  return "Keep tracking your transactions to improve your financial visibility.";
}

/*
 * -------------------------------------------------------
 * SKELETON
 * -------------------------------------------------------
 */

function AnalyticsSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex justify-between">
        <div>
          <div className="h-3 w-24 rounded bg-white/[0.04]" />

          <div className="mt-4 h-8 w-72 rounded bg-white/[0.04]" />

          <div className="mt-3 h-4 w-96 rounded bg-white/[0.04]" />
        </div>

        <div className="h-10 w-32 rounded-xl bg-white/[0.04]" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="h-32 rounded-2xl bg-white/[0.04]"
          />
        ))}
      </div>

      <div className="h-[400px] rounded-2xl bg-white/[0.04]" />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="h-[360px] rounded-2xl bg-white/[0.04]" />

        <div className="h-[360px] rounded-2xl bg-white/[0.04]" />
      </div>

      <div className="h-32 rounded-2xl bg-white/[0.04]" />
    </div>
  );
}