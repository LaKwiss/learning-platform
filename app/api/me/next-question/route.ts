import { NextResponse, NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
// Assurez-vous que le chemin d'importation est correct pour votre projet
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

        // 1. Trouver toutes les questions auxquelles l'utilisateur a déjà répondu correctement
        const correctSubmissions = await prisma.submission.findMany({
            where: {
                user: { clerkId: userId }, // On trouve l'utilisateur par son ID Clerk
                isCorrect: true,
            },
            select: {
                questionId: true, // On ne récupère que les IDs des questions
            },
        });

        const answeredQuestionIds = correctSubmissions.map(
            (submission) => submission.questionId
        );

        // 2. Essayer de trouver une question qui N'EST PAS dans la liste des questions réussies
        let question = await prisma.question.findFirst({
            where: {
                id: {
                    notIn: answeredQuestionIds,
                },
            },
        });

        // 3. Si aucune question non répondue n'est trouvée (l'utilisateur a tout réussi)
        if (!question) {
            const totalQuestions = await prisma.question.count();
            if (totalQuestions === 0) {
                return NextResponse.json(
                    { error: "No questions available in the database." },
                    { status: 404 }
                );
            }
            // On prend une question au hasard parmi toutes les questions existantes
            const randomSkip = Math.floor(Math.random() * totalQuestions);
            question = await prisma.question.findFirst({
                skip: randomSkip,
            });
        }

        return NextResponse.json(question);
    } catch (error) {
        console.error("[QUESTION_GET]", error);
        return NextResponse.json(
            { error: "An internal error occurred" },
            { status: 500 }
        );
    }
}
