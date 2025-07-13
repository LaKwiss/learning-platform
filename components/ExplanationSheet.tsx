"use client";

import NextButton from "./NextButton";

interface ExplanationSheetProps {
    explanation: string;
    onContinue: () => void;
}

export default function ExplanationSheet({
    explanation,
    onContinue,
}: ExplanationSheetProps) {
    return (
        // Un overlay fixe pour simuler un modal/nouvel écran
        <div className="fixed inset-0 z-50 flex flex-col bg-white p-6">
            <header className="flex-shrink-0">
                <h2 className="text-xl font-bold text-neutral-800">
                    Explication
                </h2>
            </header>

            <main className="flex-grow flex items-center justify-center">
                <p className="text-lg text-center text-neutral-700">
                    {explanation}
                </p>
            </main>

            <footer className="flex-shrink-0">
                <div className="mx-auto max-w-md">
                    <NextButton onClick={onContinue}>J'ai compris</NextButton>
                </div>
            </footer>
        </div>
    );
}
