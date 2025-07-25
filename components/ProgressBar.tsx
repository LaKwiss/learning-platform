"use client";

import { motion } from "framer-motion";

type ProgressBarProps = {
    progress: number;
    previousProgress?: number;
};

export default function ProgressBar({ progress, previousProgress }: ProgressBarProps) {
    // S'assure que la progression reste entre 0 et 100
    const clampedProgress = Math.min(Math.max(progress, 0), 100);
    const clampedPreviousProgress = previousProgress !== undefined 
        ? Math.min(Math.max(previousProgress, 0), 100) 
        : 0;

    return (
        <div className="w-full bg-gray-200 rounded-full h-2.5">
            <motion.div
                className="bg-green-500 h-2.5 rounded-full"
                initial={{ width: `${clampedPreviousProgress}%` }}
                animate={{ width: `${clampedProgress}%` }}
                transition={{ 
                    duration: 0.8, 
                    ease: "easeOut" 
                }}
            />
        </div>
    );
}