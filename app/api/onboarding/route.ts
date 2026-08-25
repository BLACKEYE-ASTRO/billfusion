import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { DEFAULT_CATEGORIES } from "@/lib/default-categories";

export async function POST(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();

    const currency =
      typeof body.currency === "string"
        ? body.currency
        : "INR";

    const currencySymbol =
      typeof body.currencySymbol === "string"
        ? body.currencySymbol
        : "₹";

    const clerkUser = await currentUser();

    if (!clerkUser) {
      return NextResponse.json(
        { error: "Clerk user not found" },
        { status: 404 }
      );
    }

    const email =
      clerkUser.emailAddresses[0]?.emailAddress ?? null;

    const existingUser = await prisma.user.findUnique({
      where: {
        clerkUserId: userId,
      },
    });

    if (existingUser) {
      return NextResponse.json({
        success: true,
        message: "User already exists",
      });
    }

    const user = await prisma.user.create({
      data: {
        clerkUserId: userId,

        email,

        firstName: clerkUser.firstName,
        lastName: clerkUser.lastName,
        imageUrl: clerkUser.imageUrl,

        settings: {
          create: {
            currency,
            currencySymbol,
            dateFormat: "DD/MM/YYYY",
          },
        },

        categories: {
          create: DEFAULT_CATEGORIES.map((category) => ({
            name: category.name,
            isIncome: category.isIncome,
            icon: category.icon,
            isDefault: true,
          })),
        },
      },

      include: {
        settings: true,
        categories: true,
      },
    });

    return NextResponse.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("ONBOARDING_ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to create your account",
      },
      { status: 500 }
    );
  }
}