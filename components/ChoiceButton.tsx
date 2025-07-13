import React from "react";
import { clsx } from "clsx";

type ChoiceButtonProps = {
    id: string | number;
    label: string;
    icon?: React.ReactNode;
    isSelected: boolean;
    onSelect: (id: string | number) => void;
    isRevealedAsCorrect?: boolean;
};

export const ChoiceButton = React.memo(function ChoiceButton({
    id,
    label,
    icon,
    isSelected,
    onSelect,
    isRevealedAsCorrect,
}: ChoiceButtonProps) {
    const buttonClasses = clsx(
        "p-4 rounded-lg cursor-pointer transition-all duration-200 text-left border-2 w-full flex items-center",
        {
            "border-blue-500 bg-blue-50 shadow-md": isSelected,
            "border-gray-200 bg-white hover:border-gray-400 hover:shadow-sm":
                !isSelected,
            "!border-green-500 !bg-green-50": isRevealedAsCorrect,
        }
    );

    const labelClasses = clsx("font-medium", {
        "text-blue-800": isSelected,
        "text-gray-800": !isSelected,
    });

    return (
        <button
            type="button"
            className={buttonClasses}
            onClick={() => onSelect(id)}
        >
            {icon && <div className="mr-4 text-xl flex-shrink-0">{icon}</div>}
            <span className={labelClasses}>{label}</span>
        </button>
    );
});
