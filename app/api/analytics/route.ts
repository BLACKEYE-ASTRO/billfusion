import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        clerkUserId: userId,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const now = new Date();

    // Last 8 months
    const startDate = new Date(
      now.getFullYear(),
      now.getMonth() - 7,
      1
    );

    const transactions = await prisma.transaction.findMany({
      where: {
        userId: user.id,
        date: {
          gte: startDate,
          lte: now,
        },
        type: {
          in: ["INCOME", "EXPENSE"],
        },
      },
      include: {
        category: true,
      },
      orderBy: {
        date: "asc",
      },
    });

    // ---------------------------------------
    // MONTHLY CASH FLOW
    // ---------------------------------------

    const monthlyMap = new Map<
      string,
      {
        month: string;
        income: number;
        expense: number;
      }
    >();

    for (let i = 7; i >= 0; i--) {
      const date = new Date(
        now.getFullYear(),
        now.getMonth() - i,
        1
      );

      const key = `${date.getFullYear()}-${date.getMonth()}`;

      monthlyMap.set(key, {
        month: date.toLocaleDateString("en-US", {
          month: "short",
        }),
        income: 0,
        expense: 0,
      });
    }

    for (const transaction of transactions) {
      const date = new Date(transaction.date);

      const key = `${date.getFullYear()}-${date.getMonth()}`;

      const month = monthlyMap.get(key);

      if (!month) continue;

      const amount = Number(transaction.amount);

      if (transaction.type === "INCOME") {
        month.income += amount;
      }

      if (transaction.type === "EXPENSE") {
        month.expense += amount;
      }
    }

    const cashFlowData = Array.from(
      monthlyMap.values()
    );

    // ---------------------------------------
    // TOTALS
    // ---------------------------------------

    const totalIncome = transactions
      .filter((transaction) => transaction.type === "INCOME")
      .reduce(
        (sum, transaction) =>
          sum + Number(transaction.amount),
        0
      );

    const totalExpenses = transactions
      .filter((transaction) => transaction.type === "EXPENSE")
      .reduce(
        (sum, transaction) =>
          sum + Number(transaction.amount),
        0
      );

    const savings = totalIncome - totalExpenses;

    const savingsRate =
      totalIncome > 0
        ? (savings / totalIncome) * 100
        : 0;

    // ---------------------------------------
    // CATEGORY SPENDING
    // ---------------------------------------

    const categoryMap = new Map<
      string,
      number
    >();

    for (const transaction of transactions) {
      if (transaction.type !== "EXPENSE") continue;

      const categoryName =
        transaction.category?.name || "Other";

      const current =
        categoryMap.get(categoryName) || 0;

      categoryMap.set(
        categoryName,
        current + Number(transaction.amount)
      );
    }

    const totalCategorySpending = Array.from(
      categoryMap.values()
    ).reduce((sum, amount) => sum + amount, 0);

    const categoryData = Array.from(
      categoryMap.entries()
    )
      .map(([name, amount]) => ({
        name,
        amount,
        value:
          totalCategorySpending > 0
            ? Math.round(
                (amount / totalCategorySpending) * 100
              )
            : 0,
      }))
      .sort((a, b) => b.amount - a.amount);

    // ---------------------------------------
    // TOP SPENDING CATEGORIES
    // ---------------------------------------

    const spendingData = categoryData
      .slice(0, 6)
      .map((category) => ({
        category: category.name,
        amount: category.amount,
      }));

    // ---------------------------------------
    // CURRENT MONTH
    // ---------------------------------------

    const currentMonthTransactions =
      transactions.filter((transaction) => {
        const date = new Date(transaction.date);

        return (
          date.getMonth() === now.getMonth() &&
          date.getFullYear() === now.getFullYear()
        );
      });

    const currentIncome =
      currentMonthTransactions
        .filter(
          (transaction) =>
            transaction.type === "INCOME"
        )
        .reduce(
          (sum, transaction) =>
            sum + Number(transaction.amount),
          0
        );

    const currentExpenses =
      currentMonthTransactions
        .filter(
          (transaction) =>
            transaction.type === "EXPENSE"
        )
        .reduce(
          (sum, transaction) =>
            sum + Number(transaction.amount),
          0
        );

    const currentSavings =
      currentIncome - currentExpenses;

    const currentSavingsRate =
      currentIncome > 0
        ? (currentSavings / currentIncome) * 100
        : 0;

    // ---------------------------------------
    // PREVIOUS MONTH
    // ---------------------------------------

    const previousMonthDate = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      1
    );

    const previousMonthTransactions =
      transactions.filter((transaction) => {
        const date = new Date(transaction.date);

        return (
          date.getMonth() ===
            previousMonthDate.getMonth() &&
          date.getFullYear() ===
            previousMonthDate.getFullYear()
        );
      });

    const previousIncome =
      previousMonthTransactions
        .filter(
          (transaction) =>
            transaction.type === "INCOME"
        )
        .reduce(
          (sum, transaction) =>
            sum + Number(transaction.amount),
          0
        );

    const previousExpenses =
      previousMonthTransactions
        .filter(
          (transaction) =>
            transaction.type === "EXPENSE"
        )
        .reduce(
          (sum, transaction) =>
            sum + Number(transaction.amount),
          0
        );

    const previousSavings =
      previousIncome - previousExpenses;

    // ---------------------------------------
    // CHANGES
    // ---------------------------------------

    const calculateChange = (
      current: number,
      previous: number
    ) => {
      if (previous === 0) {
        return current > 0 ? 100 : 0;
      }

      return ((current - previous) / previous) * 100;
    };

    const incomeChange = calculateChange(
      currentIncome,
      previousIncome
    );

    const expenseChange = calculateChange(
      currentExpenses,
      previousExpenses
    );

    const savingsChange = calculateChange(
      currentSavings,
      previousSavings
    );

    // ---------------------------------------
    // INSIGHT
    // ---------------------------------------

    let insight =
      "Start tracking your transactions to receive personalized financial insights.";

    if (
      currentSavings >
      previousSavings
    ) {
      insight =
        "You are saving more than last month. Keep maintaining your spending discipline.";
    } else if (
      currentExpenses >
      previousExpenses
    ) {
      insight =
        "Your expenses increased compared to last month. Review your largest spending categories.";
    } else if (currentSavingsRate >= 30) {
      insight =
        "Great job! You are maintaining a healthy savings rate.";
    }

    return NextResponse.json({
      stats: {
        income: currentIncome,
        expenses: currentExpenses,
        savings: currentSavings,
        savingsRate: currentSavingsRate,
        incomeChange,
        expenseChange,
        savingsChange,
      },

      cashFlowData,

      categoryData,

      spendingData,

      insight,

      period: {
        start: startDate,
        end: now,
      },
    });
  } catch (error) {
    console.error("Analytics API error:", error);

    return NextResponse.json(
      {
        error: "Failed to load analytics",
      },
      {
        status: 500,
      }
    );
  }
}