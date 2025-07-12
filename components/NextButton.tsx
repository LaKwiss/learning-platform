'use client';

import React from 'react';

type NextButtonProps = {
    onClick: () => void;
    children: React.ReactNode;
    disabled?: boolean;
};

export default function NextButton({ onClick, children, disabled = false }: NextButtonProps) {
    // Classes de base pour le bouton
    const baseClasses = "font-semibold py-4 px-20 rounded-full transition-all duration-300";

    // Classes conditionnelles en fonction de l'état 'disabled'
    const stateClasses = disabled
        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
        : "bg-neutral-800 text-white shadow-lg hover:bg-neutral-700 border-b-4 border-neutral-900 active:border-b-2 active:translate-y-px";

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`${baseClasses} ${stateClasses}`}
        >
            {children}
        </button>
    );
}