import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "../../../generated/prisma";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { duration, motivation, focusAreas } = body;

        const existingUser = await prisma.user.findUnique({
            where: { clerkId: userId },
        });

        if (existingUser) {
            return NextResponse.json(
                { message: "User already exists" },
                { status: 200 }
            );
        }

        let dailyGoal = null;
        if (duration) {
            switch (duration) {
                case 5:
                    dailyGoal = "FIVE_MIN";
                    break;
                case 10:
                    dailyGoal = "TEN_MIN";
                    break;
                case 15:
                    dailyGoal = "FIFTEEN_MIN";
                    break;
                case 20:
                    dailyGoal = "TWENTY_MIN";
                    break;
                default:
                    dailyGoal = null;
            }
        }

        const onboardingOptions = {
            motivation: motivation || null,
            focusAreas: focusAreas || [],
        };

        const user = await prisma.user.upsert({
            where: { clerkId: userId },
            update: {
                dailyGoal: dailyGoal as any,
                onboardingOptions: onboardingOptions,
            },
            create: {
                clerkId: userId,
                dailyGoal: dailyGoal as any,
                onboardingOptions: onboardingOptions,
            },
        });

        return NextResponse.json(
            {
                message: "User created successfully",
                user: {
                    id: user.id,
                    clerkId: user.clerkId,
                    dailyGoal: user.dailyGoal,
                    onboardingOptions: user.onboardingOptions,
                },
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating user:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
