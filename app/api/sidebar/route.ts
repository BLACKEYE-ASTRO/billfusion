import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // ============================================================
    // AUTH
    // ============================================================

    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    // ============================================================
    // FIND USER
    // ============================================================

    const user = await prisma.user.findUnique({
      where: {
        clerkUserId: userId,
      },
      select: {
        id: true,

        settings: {
          select: {
            currency: true,
            currencySymbol: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          error: "User not found",
        },
        {
          status: 404,
        }
      );
    }

    // ============================================================
    // CURRENT MONTH
    // ============================================================

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

    // ============================================================
    // GET ONLY ACTIVE MONTHLY BUDGETS
    // ============================================================

    const budgets = await prisma.budget.findMany({
      where: {
        userId: user.id,

        // IMPORTANT:
        // Only MONTHLY budgets
        period: "MONTHLY",

        // Budget must be active during current month
        startDate: {
          lt: startOfNextMonth,
        },

        endDate: {
          gte: startOfMonth,
        },

        isActive: true,
      },

      select: {
        id: true,
        amount: true,
        period: true,
        startDate: true,
        endDate: true,

        categories: {
          select: {
            categoryId: true,
            limit: true,
          },
        },
      },
    });

    // ============================================================
    // TOTAL MONTHLY BUDGET
    // ============================================================

    const budget = budgets.reduce(
      (total, currentBudget) => {
        return (
          total +
          Number(currentBudget.amount)
        );
      },
      0
    );

    // ============================================================
    // GET CATEGORY IDS FROM MONTHLY BUDGETS
    // ============================================================

    const categoryIds = [
      ...new Set(
        budgets.flatMap((currentBudget) =>
          currentBudget.categories
            .map(
              (budgetCategory) =>
                budgetCategory.categoryId
            )
            .filter(
              (id): id is string =>
                Boolean(id)
            )
        )
      ),
    ];

    // ============================================================
    // GET CURRENT MONTH EXPENSES
    // ============================================================

    const expenseResult =
      await prisma.transaction.aggregate({
        where: {
          userId: user.id,

          type: "EXPENSE",

          date: {
            gte: startOfMonth,
            lt: startOfNextMonth,
          },

          // Only count expenses from
          // categories that have a monthly budget
          categoryId:
            categoryIds.length > 0
              ? {
                  in: categoryIds,
                }
              : {
                  in: [],
                },
        },

        _sum: {
          amount: true,
        },
      });

    const spent = Number(
      expenseResult._sum.amount ?? 0
    );

    // ============================================================
    // PERCENTAGE
    // ============================================================

    const percentage =
      budget > 0
        ? (spent / budget) * 100
        : 0;

    // ============================================================
    // RESPONSE
    // ============================================================

    return NextResponse.json(
      {
        budget,

        spent,

        percentage: Number(
          percentage.toFixed(1)
        ),

        currency:
          user.settings?.currency ?? "INR",

        currencySymbol:
          user.settings?.currencySymbol ?? "₹",

        // Optional useful information
        budgetCount: budgets.length,

        categories: categoryIds,
      },
      {
        headers: {
          "Cache-Control":
            "no-store, no-cache, must-revalidate",
        },
      }
    );
  } catch (error) {
    console.error(
      "================================"
    );

    console.error(
      "GET /api/sidebar ERROR:"
    );

    console.error(error);

    console.error(
      "================================"
    );

    return NextResponse.json(
      {
        error: "Failed to load sidebar data",
      },
      {
        status: 500,
      }
    );
  }
}