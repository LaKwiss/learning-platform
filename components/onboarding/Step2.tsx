"use client";

import MultiChoiceQuestion from "../MultipleChoiceQuestion";
import ProgressBar from "../ProgressBar";
import { ChevronLeft } from "lucide-react";
import NextButton from "../NextButton";

interface Step2Props {
    onNext: () => void;
    onBack: () => void;
    value: number | null;
    onChange: (value: number | null) => void;
}

// Les données pour les choix de réponse
const durationData = [
    { id: 5, label: "5 minutes" },
    { id: 10, label: "10 minutes" },
    { id: 15, label: "15 minutes" },
    { id: 20, label: "20 minutes" },
];

export default function Step2({ onNext, onBack, value, onChange }: Step2Props) {
    const isButtonDisabled = value === null;

    return (
        <div className="flex flex-col min-h-screen bg-white">
            {/* --- En-tête --- */}
            <header className="p-4 md:p-6">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="text-gray-500 hover:text-black"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <ProgressBar progress={33} />
                </div>
            </header>

            {/* --- Contenu Principal --- */}
            <main className="flex-grow flex flex-col items-center justify-center w-full max-w-lg mx-auto text-center px-4 md:px-6">
                <h2 className="text-3xl font-bold text-neutral-800 mb-8">
                    Quelle durée souhaitez-vous apprendre par jour ?
                </h2>

                <MultiChoiceQuestion
                    data={durationData}
                    // ✅ MISE À JOUR : 'initialSelection' devient 'value'
                    value={value}
                    onSelectionChange={onChange}
                    layout="grid"
                    gridCols={2}
                />
            </main>

            {/* --- Pied de page --- */}
            <footer className="flex justify-center p-4 md:p-6">
                <NextButton onClick={onNext} disabled={isButtonDisabled}>
                    Continue
                </NextButton>
            </footer>
        </div>
    );
}
