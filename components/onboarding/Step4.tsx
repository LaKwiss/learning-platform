"use client";

import MultiChoiceQuestion from "../MultipleChoiceQuestion";
import NextButton from "../../components/NextButton";
import ProgressBar from "../../components/ProgressBar";
import { ChevronLeft } from "lucide-react";
import Character from "./Character";

interface Step4Props {
    onFinish: () => void;
    onBack: () => void;
    value: string[];
    onChange: (value: string[]) => void;
}

const focusData = [
    { id: "subjects", icon: "🔍", label: "Learning specific subjects" },
    { id: "curiosity", icon: "🌍", label: "Following my curiosity" },
    {
        id: "problem_solving",
        icon: "🧩",
        label: "Building my problem-solving skills",
    },
    { id: "basics", icon: "✏️", label: "Brushing up on the basics" },
    {
        id: "class_tools",
        icon: "🖥️",
        label: "Giving my class the best learning tools",
    },
    { id: "other", icon: "🔌", label: "Something else" },
];

export default function Step4({
    onFinish,
    onBack,
    value,
    onChange,
}: Step4Props) {
    const isButtonDisabled = value.length === 0;

    return (
        <div className="flex flex-col min-h-screen bg-white">
            <header className="p-4 md:p-6">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="text-gray-500 hover:text-black"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <ProgressBar progress={100} previousProgress={66} />
                </div>
            </header>

            <main className="flex-grow flex flex-col items-center justify-center w-full max-w-lg mx-auto text-center px-4 md:px-6">
                <div className="flex items-center justify-center mb-8">
                    <Character />
                    <div className="ml-4 bg-lime-50 border-2 border-lime-300 rounded-2xl p-4">
                        <p className="font-medium text-neutral-800">
                            What do you want to focus on?
                        </p>
                    </div>
                </div>

                <MultiChoiceQuestion
                    allowMultiple={true}
                    data={focusData}
                    // ✅ MISE À JOUR : 'initialSelection' devient 'value'
                    value={value}
                    onSelectionChange={onChange}
                    layout="list"
                    onTryAgain={() => {}}
                />
            </main>

            <footer className="flex justify-center p-4 md:p-6">
                <NextButton onClick={onFinish} disabled={isButtonDisabled}>
                    Finish
                </NextButton>
            </footer>
        </div>
    );
}
