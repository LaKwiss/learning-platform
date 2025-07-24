import Link from "next/link";

type ProgressBarProps = {
    progress: number;
};

export default function ProgressBar({ progress }: ProgressBarProps) {
    // S'assure que la progression reste entre 0 et 100
    const clampedProgress = Math.min(Math.max(progress, 0), 100);

    return (
        <div className="flex items-center w-full">
            <Link href="/home" className="mr-3 flex-shrink-0" aria-label="Accueil">
                {/* Icône maison SVG */}
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6 text-gray-700 hover:text-green-600 transition-colors"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 12l9-9 9 9M4.5 10.5V21h15V10.5"
                    />
                </svg>
            </Link>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                    className="bg-green-500 h-2.5 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${clampedProgress}%` }}
                ></div>
            </div>
        </div>
    );
}