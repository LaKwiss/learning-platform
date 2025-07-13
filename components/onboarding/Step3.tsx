"use client";

import MultiChoiceQuestion from "../MultipleChoiceQuestion";
import ProgressBar from "../ProgressBar";
import { ChevronLeft } from "lucide-react";
import NextButton from "../NextButton";
import Character from "./Character";

interface Step3Props {
    onNext: () => void;
    onBack: () => void;
    value: string | null;
    onChange: (value: string | null) => void;
}

const motivationData = [
    { id: "growth", icon: "📈", label: "Professional growth" },
    { id: "sharp", icon: "🎯", label: "Staying sharp" },
    { id: "school", icon: "📚", label: "Excelling in school" },
    { id: "child", icon: "🚀", label: "Helping my child learn" },
    { id: "students", icon: "🍎", label: "Helping my students learn" },
    { id: "other", icon: "🦄", label: "Something else" },
];

export default function Step3({ onNext, onBack, value, onChange }: Step3Props) {
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
                    <ProgressBar progress={66} />
                </div>
            </header>

            {/* --- Contenu Principal --- */}
            <main className="flex-grow flex flex-col items-center justify-center w-full max-w-lg mx-auto text-center px-4 md:px-6">
                <div className="flex items-center justify-center mb-8">
                    <Character />
                    <div className="ml-4 bg-lime-50 border-2 border-lime-300 rounded-2xl p-4">
                        <p className="font-medium text-neutral-800">
                            What's your main motivation?
                        </p>
                    </div>
                </div>

                <MultiChoiceQuestion
                    data={motivationData}
                    // ✅ MISE À JOUR : 'initialSelection' devient 'value'
                    value={value}
                    onSelectionChange={onChange}
                    layout="list"
                    onTryAgain={() => {}}
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
