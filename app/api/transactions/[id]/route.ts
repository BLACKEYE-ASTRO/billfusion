import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(
  request: Request,
  { params }: RouteContext
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;

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

    const transaction =
      await prisma.transaction.findFirst({
        where: {
          id,
          userId: user.id,
        },

        include: {
          account: true,
          category: true,
          transferAccount: true,
        },
      });

    if (!transaction) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      transaction,
    });
  } catch (error) {
    console.error(
      "GET_TRANSACTION_ERROR:",
      error
    );

    return NextResponse.json(
      {
        error: "Failed to fetch transaction",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: RouteContext
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;

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

    const result = await prisma.$transaction(
      async (tx) => {
        const transaction =
          await tx.transaction.findFirst({
            where: {
              id,
              userId: user.id,
            },
          });

        if (!transaction) {
          throw new Error(
            "TRANSACTION_NOT_FOUND"
          );
        }

        const amount = transaction.amount;

        if (transaction.type === "EXPENSE") {
          await tx.account.update({
            where: {
              id: transaction.accountId,
            },
            data: {
              balance: {
                increment: amount,
              },
            },
          });
        }

        if (transaction.type === "INCOME") {
          await tx.account.update({
            where: {
              id: transaction.accountId,
            },
            data: {
              balance: {
                decrement: amount,
              },
            },
          });
        }

        if (
          transaction.type === "TRANSFER" &&
          transaction.transferAccountId
        ) {
          await tx.account.update({
            where: {
              id: transaction.accountId,
            },
            data: {
              balance: {
                increment: amount,
              },
            },
          });

          await tx.account.update({
            where: {
              id: transaction.transferAccountId,
            },
            data: {
              balance: {
                decrement: amount,
              },
            },
          });
        }

        await tx.transaction.delete({
          where: {
            id: transaction.id,
          },
        });

        return transaction;
      }
    );

    return NextResponse.json({
      success: true,
      transaction: result,
    });
  } catch (error) {
    console.error(
      "DELETE_TRANSACTION_ERROR:",
      error
    );

    if (
      error instanceof Error &&
      error.message ===
        "TRANSACTION_NOT_FOUND"
    ) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        error: "Failed to delete transaction",
      },
      { status: 500 }
    );
  }
}