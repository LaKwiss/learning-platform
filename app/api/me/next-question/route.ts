import { NextResponse, NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "../../../generated/prisma";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
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

        const answeredQuestionIds = (
            await prisma.submission.findMany({
                where: { userId: user.id, isCorrect: true },
                select: { questionId: true },
            })
        ).map((s) => s.questionId);

        const question = await prisma.question.findFirst({
            where: {
                moduleId: user.activeModuleId,
                id: { notIn: answeredQuestionIds },
            },
            include: { options: true, correctTextAnswers: true },
        });

        const totalQuestionsInModule = await prisma.question.count({
            where: { moduleId: user.activeModuleId },
        });

        // Si l'utilisateur a tout fini, on ne renvoie plus de question
        if (!question) {
            return NextResponse.json({
                message: "Module completed!",
                progress: {
                    completed: answeredQuestionIds.length,
                    total: totalQuestionsInModule,
                },
            });
        }

        return NextResponse.json({
            question,
            progress: {
                completed: answeredQuestionIds.length,
                total: totalQuestionsInModule,
            },
        });
    } catch (error) {
        console.error("[NEXT_QUESTION_GET]", error);
        return NextResponse.json(
            { error: "An internal error occurred" },
            { status: 500 }
        );
    }
}
