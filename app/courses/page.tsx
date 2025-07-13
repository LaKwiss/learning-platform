"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Question from "../../components/Question";
import ProgressBar from "../../components/ProgressBar";
import FeedbackSheet from "../../components/FeedbackSheet";

type FeedbackState = "AWAITING_INPUT" | "CORRECT" | "INCORRECT";

export default function CoursesPage() {
    const { user } = useUser();
    const router = useRouter();

    // State for the question and progress
    const [questionData, setQuestionData] = useState<any>(null);
    const [answer, setAnswer] = useState<any>(null);
    const [progress, setProgress] = useState({ completed: 0, total: 1 });

    // State for the UI and feedback
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [feedbackState, setFeedbackState] =
        useState<FeedbackState>("AWAITING_INPUT");

    // Fetch the next question from the API
    const fetchNextQuestion = useCallback(async () => {
        setLoading(true);
        setError(null);
        setFeedbackState("AWAITING_INPUT");
        setAnswer(null);

        try {
            const response = await fetch("/api/me/next-question");
            if (!response.ok) throw new Error("Failed to fetch data.");

            const data = await response.json();
            if (data.question) {
                setQuestionData(data.question);
                setProgress(data.progress);
            } else {
                // Module is complete
                setQuestionData(null);
                alert("Félicitations, vous avez terminé le module !");
                router.push("/home"); // Redirect home
            }
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    }, [router]);

    useEffect(() => {
        if (user) {
            fetchNextQuestion();
        }
    }, [user, fetchNextQuestion]);

    // Handle the "Check" button click
    const handleCheck = async () => {
        if (!answer) return;

        const response = await fetch("/api/submit-answer", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                questionId: questionData.id,
                submittedAnswer: answer,
            }),
        });
        const result = await response.json();

        setFeedbackState(result.isCorrect ? "CORRECT" : "INCORRECT");
    };

    // Handle the "Continue" button click
    const handleContinue = () => {
        fetchNextQuestion();
    };

    // Handle the "Try again" button click
    const handleTryAgain = () => {
        setFeedbackState("AWAITING_INPUT");
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                Chargement...
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                Erreur: {error}
            </div>
        );
    }

    if (!questionData) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                Module terminé ! Redirection...
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen">
            <header className="p-4">
                <ProgressBar
                    progress={(progress.completed / progress.total) * 100}
                />
            </header>

            <main className="flex-grow flex flex-col items-center justify-center p-4">
                <Question
                    question={questionData}
                    value={answer}
                    onChange={setAnswer}
                    disabled={feedbackState !== "AWAITING_INPUT"}
                    // ✅ CORRIGÉ : On passe la fonction pour que l'enfant puisse réinitialiser l'état
                    onTryAgain={handleTryAgain}
                />
            </main>

            <footer className="w-full">
                <FeedbackSheet
                    state={feedbackState}
                    onCheck={handleCheck}
                    onContinue={handleContinue}
                    onTryAgain={handleTryAgain}
                    isCheckDisabled={
                        answer === null ||
                        (Array.isArray(answer) && answer.length === 0)
                    }
                />
            </footer>
        </div>
    );
}
