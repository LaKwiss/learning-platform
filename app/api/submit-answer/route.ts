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
        const { questionId, submittedAnswer } = body;

        if (!questionId || submittedAnswer === undefined) {
            return NextResponse.json(
                { error: "Question ID and answer are required" },
                { status: 400 }
            );
        }

        const question = await prisma.question.findUnique({
            where: { id: questionId },
            include: { options: true, correctTextAnswers: true },
        });

        if (!question) {
            return NextResponse.json(
                { error: "Question not found" },
                { status: 404 }
            );
        }

        let isCorrect = false;

        // Déterminer la correction en fonction du type de question
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

        // Créer l'enregistrement de la soumission
        await prisma.submission.create({
            data: {
                userId: user.id,
                questionId,
                isCorrect,
                submittedAnswer,
                durationInSeconds: 0, // Placeholder
            },
        });

        return NextResponse.json({ isCorrect });
    } catch (error) {
        console.error("[SUBMIT_ANSWER_POST]", error);
        return NextResponse.json(
            { error: "An internal error occurred" },
            { status: 500 }
        );
    }
}
