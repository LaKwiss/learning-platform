"use client";

import { ChoiceButton } from "./ChoiceButton";

interface TrueFalseQuestionProps {
    value: "true" | "false" | null;
    onChange: (value: "true" | "false") => void;
    disabled: boolean;
    onTryAgain?: () => void; // ✅ NOUVEAU : La prop est maintenant optionnelle
    isRevealed: boolean;
    correctAnswer: boolean;
}

const trueFalseData = [
    { id: "true", label: "Vrai" },
    { id: "false", label: "Faux" },
];

export default function TrueFalseQuestion({
    value,
    onChange,
    disabled,
    // ✅ CORRIGÉ : On fournit une fonction vide par défaut
    onTryAgain = () => {},
    isRevealed,
    correctAnswer,
}: TrueFalseQuestionProps) {
    const handleSelect = (id: string | number) => {
        onTryAgain();
        onChange(id as "true" | "false");
    };

    return (
        <div className="flex flex-row gap-4 justify-center">
            {trueFalseData.map((item) => {
                const isCorrect = String(correctAnswer) === item.id;
                return (
                    <ChoiceButton
                        key={item.id}
                        id={item.id}
                        label={item.label}
                        isSelected={value === item.id}
                        onSelect={() => handleSelect(item.id)}
                        isRevealedAsCorrect={isRevealed && isCorrect}
                    />
                );
            })}
        </div>
    );
}
