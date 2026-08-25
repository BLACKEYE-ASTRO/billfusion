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

        const accounts =
            await prisma.account.findMany({
                where: {
                    userId: user.id,
                    isActive: true,
                },

                orderBy: {
                    createdAt: "asc",
                },
            });

        return NextResponse.json({
            success: true,
            accounts,
        });
    } catch (error) {
        console.error(
            "GET_ACCOUNTS_ERROR:",
            error
        );

        return NextResponse.json(
            {
                error: "Failed to fetch accounts",
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
            name,
            type,
            balance,
            color,
            icon,
        } = body;

        if (!name || !type) {
            return NextResponse.json(
                {
                    error: "Account name and type are required",
                },
                { status: 400 }
            );
        }

        const validTypes = [
            "CASH",
            "BANK",
            "CREDIT_CARD",
            "DEBIT_CARD",
            "WALLET",
            "INVESTMENT",
            "LOAN",
            "OTHER",
        ];

        if (!validTypes.includes(type)) {
            return NextResponse.json(
                {
                    error: "Invalid account type",
                },
                { status: 400 }
            );
        }

        const settings = await prisma.userSettings.findUnique({
            where: {
                userId: user.id,
            },
        });

        const account = await prisma.account.create({
            data: {
                userId: user.id,

                name: name.trim(),

                type,

                balance: balance ?? 0,

                currency: settings?.currency ?? "INR",

                currencySymbol:
                    settings?.currencySymbol ?? "₹",

                color: color ?? null,

                icon: icon ?? null,
            },
        });

        return NextResponse.json(
            {
                success: true,
                account,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("CREATE_ACCOUNT_ERROR:", error);

        return NextResponse.json(
            {
                error: "Failed to create account",
            },
            { status: 500 }
        );
    }
}