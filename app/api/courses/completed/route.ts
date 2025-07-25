import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "../../../generated/prisma";

const prisma = new PrismaClient();

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
            where: { clerkId: userId },
        });

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        // Récupérer tous les modules que l'utilisateur a commencés
        const completedModules = await prisma.module.findMany({
            where: {
                Question: {
                    some: {
                        Submission: {
                            some: {
                                userId: user.id
                            }
                        }
                    }
                }
            },
            include: {
                Question: {
                    include: {
                        Submission: {
                            where: {
                                userId: user.id
                            }
                        }
                    }
                }
            }
        });

        // Filtrer les modules vraiment terminés (toutes les questions ont au moins une soumission)
        const trulyCompletedModules = completedModules
            .filter(module => {
                const totalQuestions = module.Question.length;
                const answeredQuestions = module.Question.filter(
                    question => question.Submission.length > 0
                ).length;
                return totalQuestions > 0 && answeredQuestions === totalQuestions;
            })
            .map(module => ({
                id: module.id,
                title: module.title,
                description: module.description,
            }));

        return NextResponse.json(trulyCompletedModules);

    } catch (error) {
        console.error("[COMPLETED_COURSES_GET]", error);
        return NextResponse.json(
            { error: "An internal error occurred" },
            { status: 500 }
        );
    }
}
