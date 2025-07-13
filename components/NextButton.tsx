"use client";

import React from "react";
import { clsx } from "clsx";

type NextButtonProps = {
    onClick: () => void;
    children: React.ReactNode;
    disabled?: boolean;
    variant?: "primary" | "secondary";
    className?: string;
};

export default function NextButton({
    onClick,
    children,
    disabled = false,
    variant = "primary",
    className,
}: NextButtonProps) {
    const baseClasses =
        "font-semibold py-3 px-5 rounded-xl transition-all duration-300 w-full text-center";

    // Style pour les actions principales (Continuer, Réessayer)
    const primaryClasses = disabled
        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
        : "bg-neutral-800 text-white shadow-lg hover:bg-neutral-700 border-b-4 border-neutral-900 active:border-b-2 active:translate-y-px";

    // Style pour les actions secondaires (Afficher la réponse)
    const secondaryClasses = disabled
        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
        : "bg-gray-200 text-neutral-800 font-bold hover:bg-gray-300";

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={clsx(
                baseClasses,
                variant === "primary" ? primaryClasses : secondaryClasses,
                className
            )}
        >
            {children}
        </button>
    );
}
