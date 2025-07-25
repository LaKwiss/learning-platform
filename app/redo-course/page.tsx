"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import MultiChoiceQuestion from "../../components/MultipleChoiceQuestion";
import NextButton from "../../components/NextButton";
import Character from "../../components/onboarding/Character";

// Définition du type pour un module terminé
interface CompletedModule {
    id: string;
    title: string;
    description?: string | null;
}

export default function RedoCoursePage() {
    const [completedModules, setCompletedModules] = useState<CompletedModule[]>([]);
    const [selectedModule, setSelectedModule] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    // 1. Récupérer les modules terminés depuis l'API
    useEffect(() => {
        const fetchCompletedModules = async () => {
            try {
                setLoading(true);
                const response = await fetch("/api/courses/completed");
                if (!response.ok) {
                    throw new Error("Failed to fetch completed modules.");
                }
                const data = await response.json();
                setCompletedModules(data);
                setError(null);
            } catch (err) {
                setError((err as Error).message);
            } finally {
                setLoading(false);
            }
        };

        fetchCompletedModules();
    }, []);

    // 2. Gérer la sélection et redémarrage d'un module
    const handleModuleRestart = async () => {
        if (!selectedModule) {
            alert("Veuillez sélectionner un module à refaire.");
            return;
        }

        try {
            // Sélectionner le module
            const selectResponse = await fetch("/api/courses", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ courseId: selectedModule }),
            });

            if (!selectResponse.ok) {
                throw new Error("Failed to select the course.");
            }

            // Redémarrer le module
            const restartResponse = await fetch("/api/me/restart-module", {
                method: "POST",
            });

            if (!restartResponse.ok) {
                throw new Error("Failed to restart the module.");
            }

            // Rediriger vers la page des questions
            router.push("/courses");
        } catch (err) {
            setError((err as Error).message);
            alert(`Error: ${(err as Error).message}`);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                Chargement des modules terminés...
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                Erreur: {error}
            </div>
        );
    }

    if (completedModules.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <div className="text-center">
                    <p className="text-lg mb-4">Vous n'avez pas encore terminé de modules.</p>
                    <button
                        onClick={() => router.push("/select-course")}
                        className="text-blue-600 underline hover:text-blue-800"
                    >
                        Retour à la sélection de cours
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-white">
            <main className="flex-grow flex flex-col items-center justify-center w-full max-w-lg mx-auto text-center px-4 md:px-6">
                <div className="flex items-center justify-center mb-8">
                    <Character />
                    <div className="ml-4 bg-lime-50 border-2 border-lime-300 rounded-2xl p-4">
                        <p className="font-medium text-neutral-800">
                            Quel module souhaitez-vous refaire ?
                        </p>
                    </div>
                </div>

                <MultiChoiceQuestion
                    data={completedModules.map((module) => ({
                        id: module.id,
                        label: module.title,
                    }))}
                    value={selectedModule}
                    onSelectionChange={(id) => setSelectedModule(id)}
                    layout="list"
                    onTryAgain={() => {}}
                />

                <div className="mt-4 mb-8">
                    <button
                        onClick={() => router.push("/select-course")}
                        className="text-blue-600 underline hover:text-blue-800 text-sm"
                    >
                        Retour à la sélection de cours
                    </button>
                </div>

                <footer className="flex justify-center p-4 md:p-6">
                    <NextButton
                        onClick={handleModuleRestart}
                        disabled={!selectedModule}
                    >
                        Refaire ce module
                    </NextButton>
                </footer>
            </main>
        </div>
    );
}
