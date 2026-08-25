import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

const VALID_TYPES = [
  "INCOME",
  "EXPENSE",
  "TRANSFER",
] as const;

export async function GET(request: Request) {
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

    const { searchParams } = new URL(request.url);

    const type = searchParams.get("type");
    const accountId = searchParams.get("accountId");
    const categoryId = searchParams.get("categoryId");
    const search = searchParams.get("search");

    const from = searchParams.get("from");
    const to = searchParams.get("to");

    const limitParam = Number(
      searchParams.get("limit") ?? "50"
    );

    const limit = Math.min(
      Math.max(limitParam || 50, 1),
      100
    );

    if (
      type &&
      !VALID_TYPES.includes(
        type as (typeof VALID_TYPES)[number]
      )
    ) {
      return NextResponse.json(
        { error: "Invalid transaction type" },
        { status: 400 }
      );
    }

    const transactions =
      await prisma.transaction.findMany({
        where: {
          userId: user.id,

          ...(type && {
            type: type as
              | "INCOME"
              | "EXPENSE"
              | "TRANSFER",
          }),

          ...(accountId && {
            accountId,
          }),

          ...(categoryId && {
            categoryId,
          }),

          ...(search && {
            OR: [
              {
                description: {
                  contains: search,
                  mode: "insensitive",
                },
              },
              {
                merchant: {
                  contains: search,
                  mode: "insensitive",
                },
              },
            ],
          }),

          ...(from || to
            ? {
                date: {
                  ...(from && {
                    gte: new Date(from),
                  }),
                  ...(to && {
                    lte: new Date(to),
                  }),
                },
              }
            : {}),
        },

        include: {
          account: {
            select: {
              id: true,
              name: true,
              type: true,
              currency: true,
              currencySymbol: true,
            },
          },

          transferAccount: {
            select: {
              id: true,
              name: true,
              type: true,
            },
          },

          category: {
            select: {
              id: true,
              name: true,
              icon: true,
              color: true,
              isIncome: true,
            },
          },
        },

        orderBy: {
          date: "desc",
        },

        take: limit,
      });

    return NextResponse.json({
      success: true,
      transactions,
    });
  } catch (error) {
    console.error("GET_TRANSACTIONS_ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch transactions",
      },
      { status: 500 }
    );
  }
}
export async function POST(request: Request) {
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

    const body = await request.json();

    const {
      accountId,
      categoryId,
      transferAccountId,
      type,
      amount,
      description,
      merchant,
      date,
      notes,
      isRecurring,
    } = body;

    // --------------------------------------------------
    // VALIDATION
    // --------------------------------------------------

    if (!accountId || !type || amount === undefined) {
      return NextResponse.json(
        {
          error:
            "Account, transaction type and amount are required",
        },
        { status: 400 }
      );
    }

    if (!VALID_TYPES.includes(type)) {
      return NextResponse.json(
        {
          error: "Invalid transaction type",
        },
        { status: 400 }
      );
    }

    const numericAmount = Number(amount);

    if (
      !Number.isFinite(numericAmount) ||
      numericAmount <= 0
    ) {
      return NextResponse.json(
        {
          error: "Amount must be greater than zero",
        },
        { status: 400 }
      );
    }

    if (
      type === "TRANSFER" &&
      !transferAccountId
    ) {
      return NextResponse.json(
        {
          error:
            "Destination account is required for transfers",
        },
        { status: 400 }
      );
    }

    if (
      type !== "TRANSFER" &&
      transferAccountId
    ) {
      return NextResponse.json(
        {
          error:
            "Destination account can only be used for transfers",
        },
        { status: 400 }
      );
    }

    // --------------------------------------------------
    // DATABASE TRANSACTION
    // --------------------------------------------------

    const result = await prisma.$transaction(
      async (tx) => {
        // ----------------------------------------------
        // SOURCE ACCOUNT
        // ----------------------------------------------

        const account = await tx.account.findFirst({
          where: {
            id: accountId,
            userId: user.id,
            isActive: true,
          },
        });

        if (!account) {
          throw new Error(
            "SOURCE_ACCOUNT_NOT_FOUND"
          );
        }

        // ----------------------------------------------
        // CATEGORY
        // ----------------------------------------------

        let category = null;

        if (categoryId) {
          category = await tx.category.findFirst({
            where: {
              id: categoryId,
              userId: user.id,
            },
          });

          if (!category) {
            throw new Error(
              "CATEGORY_NOT_FOUND"
            );
          }
        }

        // ----------------------------------------------
        // DESTINATION ACCOUNT
        // ----------------------------------------------

        let destinationAccount = null;

        if (transferAccountId) {
          destinationAccount =
            await tx.account.findFirst({
              where: {
                id: transferAccountId,
                userId: user.id,
                isActive: true,
              },
            });

          if (!destinationAccount) {
            throw new Error(
              "DESTINATION_ACCOUNT_NOT_FOUND"
            );
          }

          if (
            destinationAccount.id === account.id
          ) {
            throw new Error(
              "TRANSFER_SAME_ACCOUNT"
            );
          }
        }

        // ----------------------------------------------
        // CREATE TRANSACTION
        // ----------------------------------------------

        const transaction =
          await tx.transaction.create({
            data: {
              userId: user.id,

              accountId,

              categoryId:
                type === "TRANSFER"
                  ? null
                  : categoryId ?? null,

              transferAccountId:
                type === "TRANSFER"
                  ? transferAccountId
                  : null,

              type,

              amount: numericAmount,

              description:
                description?.trim() || null,

              merchant:
                merchant?.trim() || null,

              date: date
                ? new Date(date)
                : new Date(),

              notes:
                notes?.trim() || null,

              isRecurring:
                Boolean(isRecurring),
            },

            include: {
              account: true,
              category: true,
              transferAccount: true,
            },
          });

        // ----------------------------------------------
        // UPDATE ACCOUNT BALANCES
        // ----------------------------------------------

        if (type === "EXPENSE") {
          await tx.account.update({
            where: {
              id: account.id,
            },
            data: {
              balance: {
                decrement: numericAmount,
              },
            },
          });
        }

        if (type === "INCOME") {
          await tx.account.update({
            where: {
              id: account.id,
            },
            data: {
              balance: {
                increment: numericAmount,
              },
            },
          });
        }

        if (
          type === "TRANSFER" &&
          destinationAccount
        ) {
          await tx.account.update({
            where: {
              id: account.id,
            },
            data: {
              balance: {
                decrement: numericAmount,
              },
            },
          });

          await tx.account.update({
            where: {
              id: destinationAccount.id,
            },
            data: {
              balance: {
                increment: numericAmount,
              },
            },
          });
        }

        // ==================================================
        // NOTIFICATIONS
        // ==================================================

        const formattedAmount =
          new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: account.currency || "INR",
            maximumFractionDigits: 2,
          }).format(numericAmount);

        // ----------------------------------------------
        // INCOME NOTIFICATION
        // ----------------------------------------------

        if (type === "INCOME") {
          await tx.notification.create({
            data: {
              userId: user.id,

              type: "TRANSACTION",

              title: "Income received",

              message: `${formattedAmount} was added to ${account.name}.`,
            },
          });
        }

        // ----------------------------------------------
        // LARGE EXPENSE NOTIFICATION
        // ----------------------------------------------

        const LARGE_EXPENSE_THRESHOLD = 1000;

        if (
          type === "EXPENSE" &&
          numericAmount >=
            LARGE_EXPENSE_THRESHOLD
        ) {
          const expenseName =
            merchant?.trim() ||
            description?.trim() ||
            "an expense";

          await tx.notification.create({
            data: {
              userId: user.id,

              type: "TRANSACTION",

              title: "Large expense recorded",

              message: `${formattedAmount} was spent on ${expenseName}.`,
            },
          });
        }

        // ----------------------------------------------
        // TRANSFER NOTIFICATION
        // ----------------------------------------------

        if (
          type === "TRANSFER" &&
          destinationAccount
        ) {
          await tx.notification.create({
            data: {
              userId: user.id,

              type: "TRANSACTION",

              title: "Money transferred",

              message: `${formattedAmount} was transferred from ${account.name} to ${destinationAccount.name}.`,
            },
          });
        }

        return transaction;
      }
    );

    // --------------------------------------------------
    // RESPONSE
    // --------------------------------------------------

    return NextResponse.json(
      {
        success: true,
        transaction: result,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "CREATE_TRANSACTION_ERROR:",
      error
    );

    if (
      error instanceof Error &&
      error.message ===
        "SOURCE_ACCOUNT_NOT_FOUND"
    ) {
      return NextResponse.json(
        {
          error: "Source account not found",
        },
        { status: 404 }
      );
    }

    if (
      error instanceof Error &&
      error.message ===
        "CATEGORY_NOT_FOUND"
    ) {
      return NextResponse.json(
        {
          error: "Category not found",
        },
        { status: 404 }
      );
    }

    if (
      error instanceof Error &&
      error.message ===
        "DESTINATION_ACCOUNT_NOT_FOUND"
    ) {
      return NextResponse.json(
        {
          error:
            "Destination account not found",
        },
        { status: 404 }
      );
    }

    if (
      error instanceof Error &&
      error.message ===
        "TRANSFER_SAME_ACCOUNT"
    ) {
      return NextResponse.json(
        {
          error:
            "Source and destination accounts must be different",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error:
          "Failed to create transaction",
      },
      { status: 500 }
    );
  }
}