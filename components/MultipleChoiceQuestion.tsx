"use client";

import React from "react";
import { clsx } from "clsx";
import { ChoiceButton } from "./ChoiceButton";

type ChoiceItem = {
    id: string | number;
    label: string;
    icon?: React.ReactNode;
};

type BaseProps = {
    data: ChoiceItem[];
    layout?: "grid" | "list";
    gridCols?: 1 | 2 | 3 | 4 | 5 | 6;
    onTryAgain?: () => void;
};

type SingleSelectProps = BaseProps & {
    allowMultiple?: false;
    value: ChoiceItem["id"] | null;
    onSelectionChange: (selectedId: ChoiceItem["id"] | null) => void;
};

type MultipleSelectProps = BaseProps & {
    allowMultiple: true;
    value: ChoiceItem["id"][];
    onSelectionChange: (selectedIds: ChoiceItem["id"][]) => void;
};

// ✅ CORRIGÉ : Les props spécifiques au quiz sont maintenant optionnelles
type MultipleChoiceQuestionProps = (SingleSelectProps | MultipleSelectProps) & {
    isRevealed?: boolean;
    correctAnswerIds?: (string | number)[];
};

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
    const {
        data,
        onTryAgain = () => {},
        layout: layoutProp,
        gridCols: gridColsProp,
        // ✅ CORRIGÉ : On fournit des valeurs par défaut
        isRevealed = false,
        correctAnswerIds = [],
    } = props;

    let layout = layoutProp;
    let gridCols = gridColsProp;

    if (!layoutProp) {
        const itemCount = data.length;
        if (itemCount === 4) {
            layout = "grid";
            gridCols = 2;
        } else if (itemCount === 6) {
            layout = "grid";
            gridCols = 3;
        } else if (itemCount === 8) {
            layout = "grid";
            gridCols = 4;
        } else if (itemCount === 9) {
            layout = "grid";
            gridCols = 3;
        } else {
            layout = "list";
        }
    }

    const handleSelect = (id: ChoiceItem["id"]) => {
        onTryAgain();

        if (props.allowMultiple) {
            const currentSelection = new Set(props.value || []);
            if (currentSelection.has(id)) {
                currentSelection.delete(id);
            } else {
                currentSelection.add(id);
            }
            props.onSelectionChange(Array.from(currentSelection));
        } else {
            const newSelection = props.value === id ? null : id;
            if (typeof props.onSelectionChange === "function") {
                props.onSelectionChange(newSelection as any);
            }
        }
    };

    const containerClasses = clsx({
        "grid gap-4": layout === "grid",
        [`${gridColClasses[gridCols || 2]}`]: layout === "grid",
        "flex flex-col gap-3 w-full": layout === "list",
    });

    return (
        <div className={containerClasses}>
            {data.map((item) => {
                const isSelected = props.allowMultiple
                    ? props.value.includes(item.id)
                    : props.value === item.id;
                const shouldRevealCorrect =
                    isRevealed && correctAnswerIds.includes(item.id);

                return (
                    <ChoiceButton
                        key={item.id}
                        id={item.id}
                        label={item.label}
                        icon={item.icon}
                        isSelected={isSelected}
                        onSelect={() => handleSelect(item.id)}
                        isRevealedAsCorrect={shouldRevealCorrect}
                    />
                );
            })}
        </div>
    );
}
