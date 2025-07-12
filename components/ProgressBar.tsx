type ProgressBarProps = {
    progress: number;
};

export default function ProgressBar({ progress }: ProgressBarProps) {
    // S'assure que la progression reste entre 0 et 100
    const clampedProgress = Math.min(Math.max(progress, 0), 100);

    return (
        <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
                className="bg-green-500 h-2.5 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${clampedProgress}%` }}
            ></div>
        </div>
    );
}