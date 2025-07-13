"use client";

import React from "react";
import { clsx } from "clsx";

interface TextQuestionProps {
    value: string | null;
    onChange: (value: string) => void;
    disabled: boolean;
    onTryAgain?: () => void;
    isRevealed: boolean;
    correctAnswers: string[];
}

export default function TextQuestion({
    value,
    onChange,
    disabled,
    onTryAgain = () => {},
    isRevealed,
    correctAnswers,
}: TextQuestionProps) {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        // On empêche la modification si la question est "verrouillée"
        if (disabled) return;
        onChange(event.target.value);
    };

    const handleClick = () => {
        // Si la question est verrouillée (après une réponse fausse),
        // un clic dans le champ équivaut à "Réessayer".
        if (disabled) {
            onTryAgain();
        }
    };

    // Ajout de classes pour indiquer visuellement que le champ est cliquable
    const inputClasses = clsx(
        "w-full p-4 border-2 border-gray-200 rounded-lg text-lg text-center focus:outline-none focus:border-blue-500",
        {
            "bg-gray-100 cursor-pointer": disabled,
        }
    );

    return (
        <div className="w-full text-center">
            <input
                type="text"
                value={value || ""}
                onChange={handleChange}
                onClick={handleClick}
                // Le champ n'est plus jamais "disabled", mais "readOnly"
                // pour s'assurer que l'événement onClick fonctionne toujours.
                readOnly={disabled}
                placeholder="Tapez votre réponse ici..."
                className={inputClasses}
            />
            {isRevealed && (
                <p className="mt-4 font-semibold text-green-600">
                    Réponse correcte : {correctAnswers[0]}
                </p>
            )}
        </div>
    );
}
