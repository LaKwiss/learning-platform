import { NextResponse, NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "../../generated/prisma";

const prisma = new PrismaClient();

// GET /api/courses
export async function GET() {
    try {
        const courses = await prisma.module.findMany();
        return NextResponse.json(courses);
    } catch (error) {
        console.error("[COURSES_GET]", error);
        return NextResponse.json(
            { error: "An internal error occurred" },
            { status: 500 }
        );
    }
}

// POST /api/courses
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
        const { courseId } = body;

        if (!courseId) {
            return NextResponse.json(
                { error: "Course ID is required" },
                { status: 400 }
            );
        }

        const updatedUser = await prisma.user.upsert({
            where: { clerkId: userId },
            update: { activeModuleId: courseId },
            create: { clerkId: userId, activeModuleId: courseId },
        });

        return NextResponse.json(updatedUser);
    } catch (error) {
        console.error("[COURSES_POST]", error);
        return NextResponse.json(
            { error: "An internal error occurred" },
            { status: 500 }
        );
    }
}
