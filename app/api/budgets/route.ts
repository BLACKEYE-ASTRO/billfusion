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

    const endOfMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23,
      59,
      59,
      999
    );

    const budgets = await prisma.budget.findMany({
      where: {
        userId: user.id,
        isActive: true,
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

    const transactions = await prisma.transaction.findMany({
      where: {
        userId: user.id,
        type: "EXPENSE",
        date: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
      select: {
        amount: true,
        categoryId: true,
      },
    });

    const formattedBudgets = budgets.map((budget) => {
      const categories = budget.categories.map((budgetCategory) => {
        const spent = transactions
          .filter(
            (transaction) =>
              transaction.categoryId === budgetCategory.categoryId
          )
          .reduce(
            (sum, transaction) =>
              sum + Number(transaction.amount),
            0
          );

        const limit = Number(budgetCategory.limit);

        return {
          id: budgetCategory.id,
          categoryId: budgetCategory.categoryId,
          name: budgetCategory.category.name,
          icon: budgetCategory.category.icon,
          color: budgetCategory.category.color,
          limit,
          spent,
          remaining: limit - spent,
          percentage:
            limit > 0
              ? Math.round((spent / limit) * 100)
              : 0,
        };
      });

      const totalLimit = categories.reduce(
        (sum, category) => sum + category.limit,
        0
      );

      const totalSpent = categories.reduce(
        (sum, category) => sum + category.spent,
        0
      );

      return {
        id: budget.id,
        name: budget.name,
        amount: Number(budget.amount),
        period: budget.period,
        startDate: budget.startDate,
        endDate: budget.endDate,
        totalLimit,
        totalSpent,
        remaining: totalLimit - totalSpent,
        percentage:
          totalLimit > 0
            ? Math.round((totalSpent / totalLimit) * 100)
            : 0,
        categories,
      };
    });

    return NextResponse.json({
      budgets: formattedBudgets,
    });
  } catch (error) {
    console.error("GET_BUDGETS_ERROR", error);

    return NextResponse.json(
      {
        error: "Failed to fetch budgets",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(request: Request) {
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

    const body = await request.json();

    const {
      name,
      amount,
      period = "MONTHLY",
      categoryId,
    } = body;

    if (!name || !amount || !categoryId) {
      return NextResponse.json(
        {
          error:
            "Name, amount and category are required",
        },
        {
          status: 400,
        }
      );
    }

    const category = await prisma.category.findFirst({
      where: {
        id: categoryId,
        userId: user.id,
      },
    });

    if (!category) {
      return NextResponse.json(
        {
          error: "Category not found",
        },
        {
          status: 404,
        }
      );
    }

    const now = new Date();

    const startDate =
      period === "YEARLY"
        ? new Date(now.getFullYear(), 0, 1)
        : new Date(now.getFullYear(), now.getMonth(), 1);

    const endDate =
      period === "YEARLY"
        ? new Date(
            now.getFullYear(),
            11,
            31,
            23,
            59,
            59,
            999
          )
        : new Date(
            now.getFullYear(),
            now.getMonth() + 1,
            0,
            23,
            59,
            59,
            999
          );

    const budget = await prisma.budget.create({
      data: {
        userId: user.id,
        name,
        amount,
        period,
        startDate,
        endDate,

        categories: {
          create: {
            categoryId,
            limit: amount,
          },
        },
      },

      include: {
        categories: {
          include: {
            category: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        budget,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("CREATE_BUDGET_ERROR", error);

    return NextResponse.json(
      {
        error: "Failed to create budget",
      },
      {
        status: 500,
      }
    );
  }
}