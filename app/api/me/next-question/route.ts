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

        // Récupérer toutes les questions du module dans l'ordre
        const allQuestions = await prisma.question.findMany({
            where: { moduleId: user.activeModuleId },
            orderBy: { orderIndex: 'asc' },
            select: { id: true, orderIndex: true }
        });

        const totalQuestionsInModule = allQuestions.length;

        // Récupérer toutes les questions répondues (peu importe si correctes ou non)
        const answeredQuestionIds = (
            await prisma.submission.findMany({
                where: { 
                    userId: user.id,
                    question: { moduleId: user.activeModuleId }
                },
                select: { questionId: true },
                distinct: ['questionId']
            })
        ).map((s) => s.questionId);

        // Trouver la première question non répondue dans l'ordre
        const nextQuestionData = allQuestions.find(q => !answeredQuestionIds.includes(q.id));
        
        // Calculer la progression basée sur le nombre de questions répondues
        const answeredCount = answeredQuestionIds.length;
        const progress = {
            completed: answeredCount,
            total: totalQuestionsInModule,
        };

        // Si l'utilisateur a tout fini, on ne renvoie plus de question
        if (!nextQuestionData) {
            return NextResponse.json({
                message: "Module completed!",
                progress,
            });
        }

        // Récupérer la question complète
        const question = await prisma.question.findUnique({
            where: { id: nextQuestionData.id },
            include: { options: true, correctTextAnswers: true },
        });

        if (!question) {
            return NextResponse.json(
                { error: "Question not found" },
                { status: 404 }
            );
        }

        // Si l'utilisateur avait déjà une question active et qu'elle correspond à la prochaine question
        if (user.activeQuestionId === question.id) {
            return NextResponse.json({
                question,
                progress,
            });
        }

        // Mettre à jour la question active
        await prisma.user.update({
            where: { id: user.id },
            data: { activeQuestionId: question.id },
        });

        return NextResponse.json({
            question,
            progress,
        });
    } catch (error) {
        console.error("[NEXT_QUESTION_GET]", error);
        return NextResponse.json(
            { error: "An internal error occurred" },
            { status: 500 }
        );
    }
}
