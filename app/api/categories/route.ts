import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

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

    const categories =
      await prisma.category.findMany({
        where: {
          userId: user.id,
        },
        orderBy: [
          {
            isIncome: "desc",
          },
          {
            name: "asc",
          },
        ],
      });

    return NextResponse.json({
      success: true,
      categories,
    });
  } catch (error) {
    console.error(
      "GET_CATEGORIES_ERROR:",
      error
    );

    return NextResponse.json(
      {
        error: "Failed to fetch categories",
      },
      { status: 500 }
    );
  }
}