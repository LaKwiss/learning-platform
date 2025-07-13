"use client";

import React from "react";
import { clsx } from "clsx";
import { ChoiceButton } from "./ChoiceButton";

// Les types de données ne changent pas
type ChoiceItem = {
    id: string | number;
    label: string;
    icon?: React.ReactNode;
};

// Props communes
type BaseProps = {
    data: ChoiceItem[];
    layout?: "grid" | "list";
    gridCols?: 1 | 2 | 3 | 4 | 5 | 6;
};

// Props pour la sélection unique (maintenant contrôlée)
type SingleSelectProps = BaseProps & {
    allowMultiple?: false;
    // La valeur est maintenant directement passée en prop
    value: ChoiceItem["id"] | null;
    onSelectionChange: (selectedId: ChoiceItem["id"] | null) => void;
};

// Props pour la sélection multiple (maintenant contrôlée)
type MultipleSelectProps = BaseProps & {
    allowMultiple: true;
    // La valeur est maintenant directement passée en prop
    value: ChoiceItem["id"][];
    onSelectionChange: (selectedIds: ChoiceItem["id"][]) => void;
};

type MultipleChoiceQuestionProps = SingleSelectProps | MultipleSelectProps;

// Constantes définies en dehors du composant pour la performance
const gridColClasses = {
    1: "grid-cols-1",
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
    5: "grid-cols-5",
    6: "grid-cols-6",
};

export default function MultipleChoiceQuestion(
    props: MultipleChoiceQuestionProps
) {
    const { data, layout = "grid" } = props;

    // Logique de sélection est maintenant gérée ici
    const handleSelect = (id: ChoiceItem["id"]) => {
        if (props.allowMultiple) {
            // Créer une nouvelle copie basée sur la valeur actuelle
            const currentSelection = new Set(props.value || []);
            if (currentSelection.has(id)) {
                currentSelection.delete(id);
            } else {
                currentSelection.add(id);
            }
            props.onSelectionChange(Array.from(currentSelection));
        } else {
            // Si l'élément sélectionné est cliqué à nouveau, désélectionnez-le. Sinon, sélectionnez-le.
            const newSelection = props.value === id ? null : id;
            // Type guard to ensure correct argument type for onSelectionChange
            if (typeof props.onSelectionChange === "function") {
                props.onSelectionChange(newSelection as any);
            }
        }
    };

    const containerClasses = clsx({
        "grid gap-4": layout === "grid",
        [`${gridColClasses[props.gridCols || 3]}`]: layout === "grid",
        "flex flex-col gap-3 w-full": layout === "list",
    });

    return (
        <div className={containerClasses}>
            {data.map((item) => (
                <ChoiceButton
                    key={item.id}
                    id={item.id}
                    label={item.label}
                    icon={item.icon}
                    // La vérification de la sélection est maintenant plus simple
                    isSelected={
                        props.allowMultiple
                            ? props.value.includes(item.id)
                            : props.value === item.id
                    }
                    onSelect={handleSelect}
                />
            ))}
        </div>
    );
}
