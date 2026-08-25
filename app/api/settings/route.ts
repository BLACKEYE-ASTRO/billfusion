import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

const CURRENCIES = {
  INR: "₹",
  USD: "$",
  EUR: "€",
  GBP: "£",
} as const;

type Currency = keyof typeof CURRENCIES;

/**
 * GET /api/settings
 */
export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    /**
     * Find the application user using Clerk user ID.
     *
     * Your Prisma field is clerkUserId,
     * NOT clerkId.
     */
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
        {
          error: "User not found in database",
        },
        { status: 404 }
      );
    }

    /**
     * Make sure settings exist.
     *
     * This is useful for users who were created before
     * the UserSettings model was added.
     */
    const settings = await prisma.userSettings.upsert({
      where: {
        userId: user.id,
      },

      create: {
        userId: user.id,
        currency: "INR",
        currencySymbol: "₹",
        dateFormat: "DD/MM/YYYY",
        notifications: true,
        weeklyReport: true,
      },

      update: {},

      select: {
        currency: true,
        currencySymbol: true,
        dateFormat: true,
        monthlyBudget: true,
        notifications: true,
        weeklyReport: true,
      },
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error("GET /api/settings error:", error);

    return NextResponse.json(
      {
        error: "Failed to load settings",
      },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/settings
 */
export async function PATCH(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    /**
     * Find application user
     */
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
        {
          error: "User not found in database",
        },
        { status: 404 }
      );
    }

    const body = await request.json();

    const data: {
      currency?: Currency;
      currencySymbol?: string;
      notifications?: boolean;
      weeklyReport?: boolean;
    } = {};

    /**
     * Currency
     */
    if (body.currency !== undefined) {
      if (
        typeof body.currency !== "string" ||
        !(body.currency in CURRENCIES)
      ) {
        return NextResponse.json(
          {
            error: "Invalid currency",
          },
          { status: 400 }
        );
      }

      const currency = body.currency as Currency;

      data.currency = currency;
      data.currencySymbol = CURRENCIES[currency];
    }

    /**
     * Notifications
     */
    if (body.notifications !== undefined) {
      if (typeof body.notifications !== "boolean") {
        return NextResponse.json(
          {
            error: "Invalid notifications value",
          },
          { status: 400 }
        );
      }

      data.notifications = body.notifications;
    }

    /**
     * Weekly report
     */
    if (body.weeklyReport !== undefined) {
      if (typeof body.weeklyReport !== "boolean") {
        return NextResponse.json(
          {
            error: "Invalid weeklyReport value",
          },
          { status: 400 }
        );
      }

      data.weeklyReport = body.weeklyReport;
    }

    /**
     * Update settings.
     *
     * Upsert is safer than update because an existing Clerk
     * user might not have a UserSettings row yet.
     */
    const settings = await prisma.userSettings.upsert({
      where: {
        userId: user.id,
      },

      create: {
        userId: user.id,
        currency: data.currency ?? "INR",
        currencySymbol: data.currencySymbol ?? "₹",
        notifications: data.notifications ?? true,
        weeklyReport: data.weeklyReport ?? true,
      },

      update: data,

      select: {
        currency: true,
        currencySymbol: true,
        dateFormat: true,
        monthlyBudget: true,
        notifications: true,
        weeklyReport: true,
      },
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error("PATCH /api/settings error:", error);

    return NextResponse.json(
      {
        error: "Failed to update settings",
      },
      { status: 500 }
    );
  }
}