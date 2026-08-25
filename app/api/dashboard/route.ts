import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const { userId: clerkUserId } = await auth();

    if (!clerkUserId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        clerkUserId,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const now = new Date();

    const startOfMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      1
    );

    const startOfNextMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      1
    );

    // --------------------------------
    // ACCOUNTS
    // --------------------------------

    const accounts = await prisma.account.findMany({
      where: {
        userId: user.id,
        isActive: true,
      },

      orderBy: {
        balance: "desc",
      },
    });

    // --------------------------------
    // TRANSACTIONS THIS MONTH
    // --------------------------------

    const monthlyTransactions =
      await prisma.transaction.findMany({
        where: {
          userId: user.id,

          date: {
            gte: startOfMonth,
            lt: startOfNextMonth,
          },
        },

        include: {
          category: true,
          account: true,
        },

        orderBy: {
          date: "desc",
        },
      });

    // --------------------------------
    // TOTAL BALANCE
    // --------------------------------

    const totalBalance = accounts.reduce(
      (sum, account) =>
        sum + Number(account.balance),
      0
    );

    // --------------------------------
    // MONTHLY INCOME
    // --------------------------------

    const income = monthlyTransactions
      .filter(
        (transaction) =>
          transaction.type === "INCOME"
      )
      .reduce(
        (sum, transaction) =>
          sum + Number(transaction.amount),
        0
      );

    // --------------------------------
    // MONTHLY EXPENSE
    // --------------------------------

    const expenses = monthlyTransactions
      .filter(
        (transaction) =>
          transaction.type === "EXPENSE"
      )
      .reduce(
        (sum, transaction) =>
          sum + Number(transaction.amount),
        0
      );

    // --------------------------------
    // SAVINGS
    // --------------------------------

    const savings = income - expenses;

    const savingsRate =
      income > 0
        ? (savings / income) * 100
        : 0;

    // --------------------------------
    // EXPENSES BY CATEGORY
    // --------------------------------

    const categoryMap = new Map<
      string,
      {
        id: string;
        name: string;
        color: string | null;
        icon: string | null;
        amount: number;
      }
    >();

    monthlyTransactions
      .filter(
        (transaction) =>
          transaction.type === "EXPENSE"
      )
      .forEach((transaction) => {
        if (!transaction.category) return;

        const category =
          transaction.category;

        const existing =
          categoryMap.get(category.id);

        if (existing) {
          existing.amount += Number(
            transaction.amount
          );
        } else {
          categoryMap.set(category.id, {
            id: category.id,
            name: category.name,
            color: category.color,
            icon: category.icon,
            amount: Number(
              transaction.amount
            ),
          });
        }
      });

    const spendingByCategory = Array.from(
      categoryMap.values()
    )
      .sort(
        (a, b) =>
          b.amount - a.amount
      )
      .map((category) => ({
        ...category,

        percentage:
          expenses > 0
            ? (category.amount /
                expenses) *
              100
            : 0,
      }));

    // --------------------------------
    // RECENT TRANSACTIONS
    // --------------------------------

    const recentTransactions =
      await prisma.transaction.findMany({
        where: {
          userId: user.id,
        },

        include: {
          category: true,
          account: true,
        },

        orderBy: {
          date: "desc",
        },

        take: 8,
      });

    // --------------------------------
    // BUDGETS
    // --------------------------------

    const budgets =
      await prisma.budget.findMany({
        where: {
          userId: user.id,

          isActive: true,

          startDate: {
            lt: startOfNextMonth,
          },

          endDate: {
            gte: startOfMonth,
          },
        },

        include: {
          categories: {
            include: {
              category: true,
            },
          },
        },

        orderBy: {
          createdAt: "desc",
        },
      });

    const budgetData = budgets.map(
      (budget) => {
        const categories =
          budget.categories.map(
            (budgetCategory) => {
              const spent =
                monthlyTransactions
                  .filter(
                    (transaction) =>
                      transaction.type ===
                        "EXPENSE" &&
                      transaction.categoryId ===
                        budgetCategory.categoryId
                  )
                  .reduce(
                    (sum, transaction) =>
                      sum +
                      Number(
                        transaction.amount
                      ),
                    0
                  );

              const limit =
                Number(
                  budgetCategory.limit
                );

              return {
                id: budgetCategory.id,

                categoryId:
                  budgetCategory.categoryId,

                name:
                  budgetCategory.category
                    .name,

                limit,

                spent,

                remaining:
                  limit - spent,

                percentage:
                  limit > 0
                    ? (spent / limit) *
                      100
                    : 0,
              };
            }
          );

        const totalLimit =
          categories.reduce(
            (sum, category) =>
              sum + category.limit,
            0
          );

        const totalSpent =
          categories.reduce(
            (sum, category) =>
              sum + category.spent,
            0
          );

        return {
          id: budget.id,

          name: budget.name,

          amount:
            Number(budget.amount),

          totalLimit,

          totalSpent,

          remaining:
            totalLimit - totalSpent,

          percentage:
            totalLimit > 0
              ? (totalSpent /
                  totalLimit) *
                100
              : 0,

          categories,
        };
      }
    );

    // --------------------------------
    // INCOME / EXPENSE CHART
    // --------------------------------

    const chartData = [];

    for (
      let i = 5;
      i >= 0;
      i--
    ) {
      const date = new Date(
        now.getFullYear(),
        now.getMonth() - i,
        1
      );

      const nextMonth = new Date(
        date.getFullYear(),
        date.getMonth() + 1,
        1
      );

      const transactions =
        await prisma.transaction.findMany({
          where: {
            userId: user.id,

            date: {
              gte: date,
              lt: nextMonth,
            },
          },

          select: {
            type: true,
            amount: true,
          },
        });

      const monthIncome =
        transactions
          .filter(
            (transaction) =>
              transaction.type ===
              "INCOME"
          )
          .reduce(
            (sum, transaction) =>
              sum +
              Number(
                transaction.amount
              ),
            0
          );

      const monthExpense =
        transactions
          .filter(
            (transaction) =>
              transaction.type ===
              "EXPENSE"
          )
          .reduce(
            (sum, transaction) =>
              sum +
              Number(
                transaction.amount
              ),
            0
          );

      chartData.push({
        month: date.toLocaleString(
          "en-IN",
          {
            month: "short",
          }
        ),

        income: monthIncome,

        expense: monthExpense,
      });
    }

    return NextResponse.json({
      success: true,

      summary: {
        totalBalance,

        income,

        expenses,

        savings,

        savingsRate,
      },

      accounts: accounts.map(
        (account) => ({
          id: account.id,

          name: account.name,

          type: account.type,

          balance:
            Number(account.balance),

          currency:
            account.currency,

          currencySymbol:
            account.currencySymbol,

          color: account.color,

          icon: account.icon,
        })
      ),

      recentTransactions:
        recentTransactions.map(
          (transaction) => ({
            id: transaction.id,

            type: transaction.type,

            amount:
              Number(
                transaction.amount
              ),

            description:
              transaction.description,

            merchant:
              transaction.merchant,

            date:
              transaction.date,

            category:
              transaction.category
                ? {
                    id: transaction
                      .category.id,

                    name: transaction
                      .category.name,

                    icon: transaction
                      .category.icon,

                    color: transaction
                      .category.color,
                  }
                : null,

            account:
              transaction.account
                ? {
                    id: transaction
                      .account.id,

                    name: transaction
                      .account.name,
                  }
                : null,
          })
        ),

      spendingByCategory,

      budgets: budgetData,

      chartData,
    });
  } catch (error) {
    console.error(
      "DASHBOARD_API_ERROR",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to load dashboard data",
      },
      { status: 500 }
    );
  }
}