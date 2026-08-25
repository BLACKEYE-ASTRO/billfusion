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

    const account = await prisma.account.findFirst({
      where: {
        id,
        userId: user.id,
      },
      include: {
        transactions: {
          orderBy: {
            date: "desc",
          },
          take: 20,
        },
      },
    });

    if (!account) {
      return NextResponse.json(
        { error: "Account not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      account,
    });
  } catch (error) {
    console.error("GET_ACCOUNT_ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch account",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(
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

    const existingAccount =
      await prisma.account.findFirst({
        where: {
          id,
          userId: user.id,
        },
      });

    if (!existingAccount) {
      return NextResponse.json(
        { error: "Account not found" },
        { status: 404 }
      );
    }

    const body = await request.json();

    const {
      name,
      type,
      color,
      icon,
      isActive,
    } = body;

    const account = await prisma.account.update({
      where: {
        id,
      },
      data: {
        ...(name !== undefined && {
          name: name.trim(),
        }),

        ...(type !== undefined && {
          type,
        }),

        ...(color !== undefined && {
          color,
        }),

        ...(icon !== undefined && {
          icon,
        }),

        ...(isActive !== undefined && {
          isActive,
        }),
      },
    });

    return NextResponse.json({
      success: true,
      account,
    });
  } catch (error) {
    console.error("UPDATE_ACCOUNT_ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to update account",
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

    const account = await prisma.account.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!account) {
      return NextResponse.json(
        { error: "Account not found" },
        { status: 404 }
      );
    }

    await prisma.account.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    console.error("DELETE_ACCOUNT_ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to delete account",
      },
      { status: 500 }
    );
  }
}