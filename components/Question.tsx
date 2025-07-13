"use client";

import MultipleChoiceQuestion from "./MultipleChoiceQuestion";
import TrueFalseQuestion from "./TrueFalseQuestion";
import TextQuestion from "./TextQuestion";

interface QuestionProps {
    question: any;
    value: any;
    onChange: (value: any) => void;
    disabled: boolean;
    onTryAgain?: () => void; // ✅ NOUVEAU : La prop est maintenant optionnelle
    isRevealed: boolean;
}

export default function Question({
    question,
    value,
    onChange,
    disabled,
    // ✅ CORRIGÉ : On fournit une fonction vide par défaut
    onTryAgain = () => {},
    isRevealed,
}: QuestionProps) {
    return (
        <div className="w-full max-w-lg mx-auto">
            <h2 className="text-3xl font-bold text-neutral-800 mb-8 text-center">
                {question.title}
            </h2>

            {(question.type === "SINGLE_CHOICE" ||
                question.type === "MULTIPLE_CHOICE") && (
                <MultipleChoiceQuestion
                    allowMultiple={question.type === "MULTIPLE_CHOICE"}
                    data={question.options.map((opt: any) => ({
                        id: opt.id,
                        label: opt.text,
                    }))}
                    correctAnswerIds={question.options
                        .filter((opt: any) => opt.isCorrect)
                        .map((opt: any) => opt.id)}
                    value={
                        question.type === "MULTIPLE_CHOICE"
                            ? value || []
                            : value
                    }
                    onSelectionChange={onChange}
                    onTryAgain={onTryAgain}
                    isRevealed={isRevealed}
                />
            )}

            {question.type === "TRUE_FALSE" && (
                <TrueFalseQuestion
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                    onTryAgain={onTryAgain}
                    isRevealed={isRevealed}
                    correctAnswer={question.correctBooleanAnswer}
                />
            )}

            {question.type === "TEXT" && (
                <TextQuestion
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                    onTryAgain={onTryAgain}
                    isRevealed={isRevealed}
                    correctAnswers={question.correctTextAnswers.map(
                        (ans: any) => ans.text
                    )}
                />
            )}
        </div>
    );
}
