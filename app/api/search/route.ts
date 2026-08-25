import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);

    const query = searchParams.get("q")?.trim();

    if (!query) {
      return NextResponse.json({
        transactions: [],
        accounts: [],
        categories: [],
        budgets: [],
        goals: [],
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        clerkUserId: userId,
      },
      select: {
        id: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const search = query;

    const [
      transactions,
      accounts,
      categories,
      budgets,
      goals,
    ] = await Promise.all([
      prisma.transaction.findMany({
        where: {
          userId: user.id,
          OR: [
            {
              merchant: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              description: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              notes: {
                contains: search,
                mode: "insensitive",
              },
            },
          ],
        },
        select: {
          id: true,
          merchant: true,
          description: true,
          amount: true,
          type: true,
          date: true,
          account: {
            select: {
              name: true,
            },
          },
          category: {
            select: {
              name: true,
            },
          },
        },
        orderBy: {
          date: "desc",
        },
        take: 8,
      }),

      prisma.account.findMany({
        where: {
          userId: user.id,
          name: {
            contains: search,
            mode: "insensitive",
          },
        },
        select: {
          id: true,
          name: true,
          type: true,
          balance: true,
          currency: true,
          currencySymbol: true,
        },
        take: 5,
      }),

      prisma.category.findMany({
        where: {
          userId: user.id,
          name: {
            contains: search,
            mode: "insensitive",
          },
        },
        select: {
          id: true,
          name: true,
          color: true,
          icon: true,
          isIncome: true,
        },
        take: 5,
      }),

      prisma.budget.findMany({
        where: {
          userId: user.id,
          name: {
            contains: search,
            mode: "insensitive",
          },
        },
        select: {
          id: true,
          name: true,
          amount: true,
          period: true,
          startDate: true,
          endDate: true,
        },
        take: 5,
      }),

      prisma.financialGoal.findMany({
        where: {
          userId: user.id,
          name: {
            contains: search,
            mode: "insensitive",
          },
        },
        select: {
          id: true,
          name: true,
          targetAmount: true,
          currentAmount: true,
          deadline: true,
          status: true,
        },
        take: 5,
      }),
    ]);

    return NextResponse.json({
      transactions,
      accounts,
      categories,
      budgets,
      goals,
    });
  } catch (error) {
    console.error("GET /api/search error:", error);

    return NextResponse.json(
      {
        error: "Failed to search",
      },
      {
        status: 500,
      }
    );
  }
}