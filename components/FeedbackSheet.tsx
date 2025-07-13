"use client";

import { Check, X } from "lucide-react";
import NextButton from "./NextButton";
import clsx from "clsx";
import React from "react";

type FeedbackState = "AWAITING_INPUT" | "CORRECT" | "INCORRECT";

interface FeedbackSheetProps {
    state: FeedbackState;
    onCheck: () => void;
    onContinue: () => void;
    onTryAgain: () => void;
    isCheckDisabled: boolean;
}

// L'interface pour le typage reste la même
interface StateConfig {
    buttonText: string;
    containerClasses: string;
    message: string;
    icon?: React.ReactNode;
}

const stateConfig: Record<FeedbackState, StateConfig> = {
    AWAITING_INPUT: {
        buttonText: "Vérifier",
        containerClasses: "bg-white border-t-2",
        message: "",
    },
    CORRECT: {
        buttonText: "Continuer",
        containerClasses: "bg-green-100 border-t-2 border-green-500",
        message: "Bonne réponse !",
        icon: <Check className="h-8 w-8 text-green-500" />,
    },
    INCORRECT: {
        buttonText: "Réessayer",
        containerClasses: "bg-red-100 border-t-2 border-red-500",
        message: "Mauvaise réponse",
        icon: <X className="h-8 w-8 text-red-500" />,
    },
};

export default function FeedbackSheet({
    state,
    onCheck,
    onContinue,
    onTryAgain,
    isCheckDisabled,
}: FeedbackSheetProps) {
    const config = stateConfig[state];

    const handleButtonClick = () => {
        switch (state) {
            case "AWAITING_INPUT":
                onCheck();
                break;
            case "CORRECT":
                onContinue();
                break;
            case "INCORRECT":
                onTryAgain();
                break;
        }
    };

    // ✅ CORRIGÉ : Remplacé le Drawer par une div fixe
    return (
        <div
            className={clsx(
                "w-full p-4 transition-all duration-300",
                config.containerClasses
            )}
        >
            <div className="max-w-md mx-auto flex flex-col items-center">
                {config.icon && (
                    <div className="flex items-center justify-center space-x-4 mb-4">
                        {config.icon}
                        <h2 className="font-medium text-2xl">
                            {config.message}
                        </h2>
                    </div>
                )}
                <NextButton
                    onClick={handleButtonClick}
                    disabled={state === "AWAITING_INPUT" && isCheckDisabled}
                >
                    {config.buttonText}
                </NextButton>
            </div>
        </div>
    );
}
