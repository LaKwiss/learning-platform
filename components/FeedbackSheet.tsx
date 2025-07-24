"use client";

import NextButton from "./NextButton";
import React from "react";
import { clsx } from "clsx";
import { Search } from "lucide-react"; // Pour l'icône loupe

type FeedbackState = "CORRECT" | "INCORRECT";

interface FeedbackSheetProps {
    state: FeedbackState;
    onShowExplanation: () => void;
    onSkipExplanation: () => void;
    onTryAgain: () => void;
}

const FeedbackSheetGreeting = [
    "Excellent !", "C'est la bonne réponse !", "Bien joué !",
    "Bravo !", "Super !", "Exactement !", "Parfait !"
]

export default function FeedbackSheet({
    state,
    onShowExplanation,
    onSkipExplanation,
    onTryAgain,
}: FeedbackSheetProps) {
    const isCorrect = state === "CORRECT";

    // Les styles de conteneur sont adaptés aux captures d'écran
    const containerClasses = isCorrect
        ? "bg-green-100 border-t-2 border-green-200"
        : "bg-yellow-50 border-t-2 border-yellow-300";

    const title = isCorrect
        ? FeedbackSheetGreeting[Math.floor(Math.random() * FeedbackSheetGreeting.length)]
        : "C'est incorrect. Réessayez.";

    return (
        <div
            className={clsx(
                "w-full p-4 transition-all duration-300",
                containerClasses
            )}
        >
            <div className="mx-auto flex max-w-md flex-col items-center gap-4">
                <div className="flex w-full items-center justify-between">
                    <div className="flex items-center gap-2">
                        {isCorrect && (
                            <Search className="h-6 w-6 text-neutral-700" />
                        )}
                        <h2 className="text-lg font-bold text-neutral-800">
                            {title}
                        </h2>
                    </div>
                    {/* Emplacement pour une future icône drapeau */}
                </div>

                <div className="mt-2 flex w-full gap-4">
                    {isCorrect ? (
                        <>
                            <NextButton
                                onClick={onShowExplanation}
                                variant="primary"
                            >
                                Pourquoi ?
                            </NextButton>
                            <NextButton
                                onClick={onSkipExplanation}
                                variant="secondary"
                            >
                                Passer l'explication
                            </NextButton>
                        </>
                    ) : (
                        <>
                            <NextButton
                                onClick={onShowExplanation}
                                variant="secondary"
                            >
                                Voir la réponse
                            </NextButton>
                            <NextButton onClick={onTryAgain} variant="primary">
                                Réessayer
                            </NextButton>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
