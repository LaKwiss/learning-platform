'use client';

import ProgressBar from '../ProgressBar';
import { ChevronLeft } from 'lucide-react';
import NextButton from '../NextButton';

interface Step1Props {
    onNext: () => void;
}

export default function Step1({ onNext }: Step1Props) {
    return (
        <div className="flex flex-col min-h-screen bg-white">
            {/* --- En-tête --- */}
            <header className="p-4 md:p-6">
                <div className="flex items-center gap-4">
                    <button className="text-gray-500 hover:text-black">
                        <ChevronLeft size={24} />
                    </button>
                    <ProgressBar progress={0} previousProgress={0} />
                </div>
            </header>

            {/* --- Contenu Principal --- */}
            <main className="flex-grow flex flex-col items-center justify-center text-center px-4 md:px-6">
                <div className="relative">
                    {/* La bulle de dialogue */}
                    <div className="bg-lime-50 border-2 border-lime-300 rounded-3xl p-6 max-w-sm shadow-sm">
                        <p className="text-xl font-medium text-neutral-800">
                            Let's build a learning path just for you.
                        </p>
                    </div>
                    {/* La flèche de la bulle */}
                    <div className="absolute left-1/2 -translate-x-1/2 mt-[-2px] w-6 h-6 bg-lime-50 border-b-2 border-r-2 border-lime-300 rotate-45"></div>
                </div>
            </main>

            {/* --- Pied de page --- */}
            <footer className="flex justify-center p-4 md:p-6">
                <NextButton onClick={onNext}>
                    Continue
                </NextButton>
            </footer>
        </div>
    );
}