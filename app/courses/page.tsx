"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Question from "../../components/Question";
import ProgressBar from "../../components/ProgressBar";
import FeedbackSheet from "../../components/FeedbackSheet";
import ExplanationSheet from "../../components/ExplanationSheet";
import NextButton from "../../components/NextButton";

type FeedbackState = "AWAITING_INPUT" | "CORRECT" | "INCORRECT";

export default function CoursesPage() {
    const { user } = useUser();
    const router = useRouter();

    const [questionData, setQuestionData] = useState<any>(null);
    const [answer, setAnswer] = useState<any>(null);
    const [progress, setProgress] = useState({ completed: 0, total: 1 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [feedbackState, setFeedbackState] =
        useState<FeedbackState>("AWAITING_INPUT");
    const [showExplanation, setShowExplanation] = useState(false);
    const [explanationText, setExplanationText] = useState(""); // ✅ Pour stocker le texte de l'explication

    const fetchNextQuestion = useCallback(async () => {
        setLoading(true);
        setError(null);
        setFeedbackState("AWAITING_INPUT");
        setAnswer(null);
        setShowExplanation(false);
        setExplanationText(""); // On réinitialise

        try {
            const response = await fetch("/api/me/next-question");
            if (!response.ok) throw new Error("Failed to fetch data.");
            const data = await response.json();
            if (data.question) {
                setQuestionData(data.question);
                setProgress(data.progress);
            } else {
                setQuestionData(null);
                alert("Félicitations, vous avez terminé le module !");
                router.push("/home");
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

    const handleCheck = async () => {
        if (!answer) return;

        const response = await fetch("/api/submit-answer", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                questionId: questionData.id,
                submittedAnswer: answer,
                submittedAnswerText:
                    typeof answer === "string" ? answer : "N/A", // On passe la valeur TXT comme demandé
            }),
        });
        const result = await response.json();

        setFeedbackState(result.isCorrect ? "CORRECT" : "INCORRECT");

        // ✅ Si la réponse est fausse, on récupère l'explication de l'API
        if (!result.isCorrect) {
            setExplanationText(result.explanation);
        }
    };

    const handleContinue = () => {
        fetchNextQuestion();
    };

    const handleShowExplanation = () => {
        setShowExplanation(true);
    };

    const handleTryAgain = () => {
        setFeedbackState("AWAITING_INPUT");
        setAnswer(null);
    };

    if (loading)
        return (
            <div className="flex items-center justify-center min-h-screen">
                Chargement...
            </div>
        );
    if (error)
        return (
            <div className="flex items-center justify-center min-h-screen">
                Erreur: {error}
            </div>
        );
    if (!questionData)
        return (
            <div className="flex items-center justify-center min-h-screen">
                Module terminé !
            </div>
        );

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
                    isRevealed={false}
                    onTryAgain={handleTryAgain}
                />
            </main>

            <footer className="w-full">
                {feedbackState === "AWAITING_INPUT" && (
                    <div className="border-t-2 bg-white p-4">
                        <div className="mx-auto max-w-md">
                            <NextButton
                                onClick={handleCheck}
                                disabled={
                                    answer === null ||
                                    (Array.isArray(answer) &&
                                        answer.length === 0)
                                }
                            >
                                Vérifier
                            </NextButton>
                        </div>
                    </div>
                )}

                {!showExplanation &&
                    (feedbackState === "CORRECT" ||
                        feedbackState === "INCORRECT") && (
                        <FeedbackSheet
                            state={feedbackState}
                            onShowExplanation={handleShowExplanation}
                            onSkipExplanation={handleContinue}
                            onTryAgain={handleTryAgain}
                        />
                    )}

                {showExplanation && (
                    <ExplanationSheet
                        explanation={explanationText} // ✅ On passe l'explication reçue de l'API
                        onContinue={handleContinue}
                    />
                )}
            </footer>
        </div>
    );
}
