import { NextResponse, NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "../../generated/prisma";

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
        // Le `submittedAnswerText` n'est pas utilisé pour la validation,
        // mais il est inclus comme demandé.
        const { questionId, submittedAnswer, submittedAnswerText } = body;

        if (!questionId || submittedAnswer === undefined) {
            return NextResponse.json(
                { error: "Question ID and answer are required" },
                { status: 400 }
            );
        }

        const question = await prisma.question.findUnique({
            where: { id: questionId },
            include: {
                options: true,
                correctTextAnswers: true,
                explanation: true,
            },
        });

        if (!question) {
            return NextResponse.json(
                { error: "Question not found" },
                { status: 404 }
            );
        }

        let isCorrect = false;

        switch (question.type) {
            case "SINGLE_CHOICE": {
                const correctOption = question.options.find(
                    (opt) => opt.isCorrect
                );
                isCorrect = correctOption?.id === submittedAnswer;
                break;
            }
            case "MULTIPLE_CHOICE": {
                const correctOptions = question.options
                    .filter((opt) => opt.isCorrect)
                    .map((opt) => opt.id);
                const submittedOptions = new Set(submittedAnswer as string[]);
                isCorrect =
                    correctOptions.length === submittedOptions.size &&
                    correctOptions.every((id) => submittedOptions.has(id));
                break;
            }
            case "TRUE_FALSE":
                isCorrect =
                    question.correctBooleanAnswer ===
                    (submittedAnswer === "true");
                break;
            case "TEXT": {
                const correctAnswers = question.correctTextAnswers.map((ans) =>
                    ans.text.toLowerCase()
                );
                isCorrect = correctAnswers.includes(
                    (submittedAnswer as string).toLowerCase()
                );
                break;
            }
        }

        const user = await prisma.user.findUnique({
            where: { clerkId: userId },
        });

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        await prisma.submission.create({
            data: {
                userId: user.id,
                questionId,
                isCorrect,
                submittedAnswer,
                durationInSeconds: 0,
            },
        });

        // ✅ Si la réponse est fausse, on renvoie l'explication
        if (!isCorrect) {
            return NextResponse.json({
                isCorrect: false,
                explanation:
                    question.explanation?.content ||
                    "Aucune explication disponible pour cette question.",
            });
        }

        // ✅ Si la réponse est correcte, on continue sans reset de activeQuestionId
        // La prochaine question sera déterminée par l'API next-question

        // On incrémente le niveau de l'utilisateur
        const increment: number = 5; // Valeur d'incrémentation
        await prisma.user.update({
            where: { id: user.id },
            data: {
                level: {
                    increment: increment,
                },
            },
        });

        return NextResponse.json({ isCorrect: true });
    } catch (error) {
        console.error("[SUBMIT_ANSWER_POST]", error);
        return NextResponse.json(
            { error: "An internal error occurred" },
            { status: 500 }
        );
    }
}
