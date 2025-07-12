'use client';

import React, { useState, useEffect } from 'react';

// 1. MISE À JOUR : Ajout de la propriété optionnelle 'icon'
// L'icône peut être un emoji (string) ou un composant (ex: <img /> ou une icône SVG)
type ChoiceItem = {
    id: string | number;
    label: string;
    icon?: React.ReactNode;
};

// Props communes à toutes les variantes
type BaseProps = {
    data: ChoiceItem[];
    layout?: 'grid' | 'list';
    gridCols?: 1 | 2 | 3 | 4 | 5 | 6;
};

// Props pour la sélection unique
type SingleSelectProps = BaseProps & {
    allowMultiple?: false;
    initialSelection?: ChoiceItem['id'] | null;
    onSelectionChange: (selectedId: ChoiceItem['id'] | null) => void;
};

// Props pour la sélection multiple
type MultiSelectProps = BaseProps & {
    allowMultiple: true;
    initialSelection?: ChoiceItem['id'][];
    onSelectionChange: (selectedIds: ChoiceItem['id'][]) => void;
};

// Le type final est une union des deux versions
type MultiChoiceQuestionProps = SingleSelectProps | MultiSelectProps;


export default function MultiChoiceQuestion(props: MultiChoiceQuestionProps) {
    const { data, onSelectionChange, layout = 'grid' } = props;
    const gridCols = props.layout === 'grid' ? props.gridCols || 3 : 3;

    const getInitialState = (): Set<string | number> => {
        if (props.allowMultiple) {
            return new Set(props.initialSelection || []);
        }
        if (props.initialSelection != null) {
            // On s'assure que ce n'est pas un tableau (évite l'erreur de type)
            if (Array.isArray(props.initialSelection)) {
                // Si jamais un tableau est passé par erreur, on prend le premier élément ou rien
                return new Set(props.initialSelection.length > 0 ? [props.initialSelection[0]] : []);
            }
            return new Set([props.initialSelection]);
        }
        return new Set();
    };

    const [selectedIds, setSelectedIds] = useState(getInitialState);

    useEffect(() => {
        setSelectedIds(getInitialState());
    }, [props.initialSelection]);

    const handleSelect = (id: ChoiceItem['id']) => {
        const newSelectedIds = new Set(selectedIds);

        if (props.allowMultiple) {
            if (newSelectedIds.has(id)) { newSelectedIds.delete(id); }
            else { newSelectedIds.add(id); }
        } else {
            if (newSelectedIds.has(id)) { newSelectedIds.clear(); }
            else {
                newSelectedIds.clear();
                newSelectedIds.add(id);
            }
        }

        setSelectedIds(newSelectedIds);

        if (props.allowMultiple) {
            props.onSelectionChange(Array.from(newSelectedIds));
        } else {
            props.onSelectionChange(newSelectedIds.size > 0 ? newSelectedIds.values().next().value : null);
        }
    };

    const gridColClasses = {
        1: 'grid-cols-1', 2: 'grid-cols-2', 3: 'grid-cols-3',
        4: 'grid-cols-4', 5: 'grid-cols-5', 6: 'grid-cols-6',
    };

    const containerClasses = layout === 'grid'
        ? `grid ${gridColClasses[gridCols]} gap-4`
        : 'flex flex-col gap-3 w-full';

    return (
        <div className={containerClasses}>
            {data.map((item) => {
                const isSelected = selectedIds.has(item.id);
                const itemClasses = `p-4 rounded-lg cursor-pointer transition-all duration-200 text-left border-2 ${isSelected ? 'border-blue-500 bg-blue-50 shadow-md' : 'border-gray-200 bg-white hover:border-gray-400 hover:shadow-sm'}`;

                return (
                    // 2. MISE À JOUR : Le contenu du bouton est maintenant un conteneur flex
                    <button key={item.id} type="button" className={itemClasses} onClick={() => handleSelect(item.id)}>
                        <div className="flex items-center">
                            {/* On affiche l'icône si elle existe */}
                            {item.icon && <div className="mr-4 text-xl">{item.icon}</div>}
                            <span className={`font-medium ${isSelected ? 'text-blue-800' : 'text-gray-800'}`}>{item.label}</span>
                        </div>
                    </button>
                );
            })}
        </div>
    );
}