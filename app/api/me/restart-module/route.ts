import { NextResponse, NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
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

        const user = await prisma.user.findUnique({
            where: { clerkId: userId },
        });

        if (!user || !user.activeModuleId) {
            return NextResponse.json(
                { error: "User or active module not found." },
                { status: 404 }
            );
        }

        // Supprimer toutes les soumissions de l'utilisateur pour ce module
        await prisma.submission.deleteMany({
            where: {
                userId: user.id,
                question: {
                    moduleId: user.activeModuleId
                }
            }
        });

        // Remettre à zéro la question active
        await prisma.user.update({
            where: { id: user.id },
            data: { activeQuestionId: null }
        });

        return NextResponse.json({
            message: "Module restarted successfully"
        });

    } catch (error) {
        console.error("[RESTART_MODULE_POST]", error);
        return NextResponse.json(
            { error: "An internal error occurred" },
            { status: 500 }
        );
    }
}
