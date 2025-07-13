"use client";

import React from "react";

interface TextQuestionProps {
    value: string | null;
    onChange: (value: string) => void;
    disabled: boolean;
    onTryAgain?: () => void; // ✅ NOUVEAU : La prop est maintenant optionnelle
    isRevealed: boolean;
    correctAnswers: string[];
}

export default function TextQuestion({
    value,
    onChange,
    disabled,
    // ✅ CORRIGÉ : On fournit une fonction vide par défaut
    onTryAgain = () => {},
    isRevealed,
    correctAnswers,
}: TextQuestionProps) {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onChange(event.target.value);
    };

    const handleClick = () => {
        onTryAgain();
    };

    return (
        <div className="w-full text-center">
            <input
                type="text"
                value={value || ""}
                onChange={handleChange}
                onClick={handleClick}
                disabled={disabled}
                placeholder="Tapez votre réponse ici..."
                className="w-full p-4 border-2 border-gray-200 rounded-lg text-lg text-center focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
            />
            {isRevealed && (
                <p className="mt-4 text-green-600 font-semibold">
                    Réponse correcte : {correctAnswers[0]}
                </p>
            )}
        </div>
    );
}
