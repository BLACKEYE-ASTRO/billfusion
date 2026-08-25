import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = {
  params: Promise<{
    id: string;
  }>;
};

// ============================================================
// PUT - UPDATE BUDGET
// ============================================================

export async function PUT(
  request: Request,
  { params }: Params
) {
  try {
    // --------------------------------------------------------
    // AUTH
    // --------------------------------------------------------

    const { userId: clerkUserId } = await auth();

    if (!clerkUserId) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    // --------------------------------------------------------
    // PARAMS
    // --------------------------------------------------------

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        {
          error: "Budget ID is required",
        },
        {
          status: 400,
        }
      );
    }

    // --------------------------------------------------------
    // FIND USER
    // --------------------------------------------------------

    const user = await prisma.user.findUnique({
      where: {
        clerkUserId,
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

    // --------------------------------------------------------
    // FIND BUDGET
    // --------------------------------------------------------

    const existingBudget =
      await prisma.budget.findFirst({
        where: {
          id,
          userId: user.id,
        },
        include: {
          categories: true,
        },
      });

    if (!existingBudget) {
      return NextResponse.json(
        {
          error: "Budget not found",
        },
        {
          status: 404,
        }
      );
    }

    // --------------------------------------------------------
    // REQUEST BODY
    // --------------------------------------------------------

    const body = await request.json();

    const {
      name,
      amount,
      period,
      categoryId,
    } = body;

    // --------------------------------------------------------
    // VALIDATION
    // --------------------------------------------------------

    if (!name || !String(name).trim()) {
      return NextResponse.json(
        {
          error: "Budget name is required",
        },
        {
          status: 400,
        }
      );
    }

    if (
      amount === undefined ||
      amount === null ||
      amount === ""
    ) {
      return NextResponse.json(
        {
          error: "Budget amount is required",
        },
        {
          status: 400,
        }
      );
    }

    const numericAmount = Number(amount);

    if (
      !Number.isFinite(numericAmount) ||
      numericAmount <= 0
    ) {
      return NextResponse.json(
        {
          error:
            "Budget amount must be greater than zero",
        },
        {
          status: 400,
        }
      );
    }

    if (!categoryId) {
      return NextResponse.json(
        {
          error: "Category is required",
        },
        {
          status: 400,
        }
      );
    }

    const validPeriods = [
      "MONTHLY",
      "YEARLY",
    ];

    const selectedPeriod =
      period || existingBudget.period;

    if (!validPeriods.includes(selectedPeriod)) {
      return NextResponse.json(
        {
          error: "Invalid budget period",
        },
        {
          status: 400,
        }
      );
    }

    // --------------------------------------------------------
    // CHECK CATEGORY
    // --------------------------------------------------------

    const category =
      await prisma.category.findFirst({
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

    // --------------------------------------------------------
    // CALCULATE DATES
    // --------------------------------------------------------

    const now = new Date();

    const startDate =
      selectedPeriod === "YEARLY"
        ? new Date(
            now.getFullYear(),
            0,
            1
          )
        : new Date(
            now.getFullYear(),
            now.getMonth(),
            1
          );

    const endDate =
      selectedPeriod === "YEARLY"
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

    // --------------------------------------------------------
    // UPDATE DATABASE
    // --------------------------------------------------------

    const updatedBudget =
      await prisma.$transaction(
        async (tx) => {
          // ----------------------------------------------
          // UPDATE BUDGET
          // ----------------------------------------------

          const budget =
            await tx.budget.update({
              where: {
                id: existingBudget.id,
              },
              data: {
                name: String(name).trim(),
                amount: numericAmount,
                period: selectedPeriod,
                startDate,
                endDate,
              },
            });

          // ----------------------------------------------
          // UPDATE CATEGORY
          // ----------------------------------------------

          const existingBudgetCategory =
            await tx.budgetCategory.findFirst({
              where: {
                budgetId: existingBudget.id,
              },
            });

          if (existingBudgetCategory) {
            await tx.budgetCategory.update({
              where: {
                id: existingBudgetCategory.id,
              },
              data: {
                categoryId,
                limit: numericAmount,
              },
            });
          } else {
            await tx.budgetCategory.create({
              data: {
                budgetId: existingBudget.id,
                categoryId,
                limit: numericAmount,
              },
            });
          }

          // ----------------------------------------------
          // RETURN FULL BUDGET
          // ----------------------------------------------

          return tx.budget.findUnique({
            where: {
              id: budget.id,
            },
            include: {
              categories: {
                include: {
                  category: true,
                },
              },
            },
          });
        }
      );

    // --------------------------------------------------------
    // RESPONSE
    // --------------------------------------------------------

    return NextResponse.json({
      success: true,
      budget: updatedBudget,
    });
  } catch (error) {
    console.error(
      "UPDATE_BUDGET_ERROR:",
      error
    );

    return NextResponse.json(
      {
        error: "Failed to update budget",
      },
      {
        status: 500,
      }
    );
  }
}

// ============================================================
// DELETE - DELETE BUDGET
// ============================================================

export async function DELETE(
  request: Request,
  { params }: Params
) {
  try {
    // --------------------------------------------------------
    // AUTH
    // --------------------------------------------------------

    const { userId: clerkUserId } = await auth();

    if (!clerkUserId) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    // --------------------------------------------------------
    // PARAMS
    // --------------------------------------------------------

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        {
          error: "Budget ID is required",
        },
        {
          status: 400,
        }
      );
    }

    // --------------------------------------------------------
    // FIND USER
    // --------------------------------------------------------

    const user = await prisma.user.findUnique({
      where: {
        clerkUserId,
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

    // --------------------------------------------------------
    // FIND BUDGET
    // --------------------------------------------------------

    const budget =
      await prisma.budget.findFirst({
        where: {
          id,
          userId: user.id,
        },
      });

    if (!budget) {
      return NextResponse.json(
        {
          error: "Budget not found",
        },
        {
          status: 404,
        }
      );
    }

    // --------------------------------------------------------
    // DELETE
    // --------------------------------------------------------

    await prisma.budget.delete({
      where: {
        id: budget.id,
      },
    });

    // --------------------------------------------------------
    // RESPONSE
    // --------------------------------------------------------

    return NextResponse.json({
      success: true,
      message: "Budget deleted successfully",
    });
  } catch (error) {
    console.error(
      "DELETE_BUDGET_ERROR:",
      error
    );

    return NextResponse.json(
      {
        error: "Failed to delete budget",
      },
      {
        status: 500,
      }
    );
  }
}