"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import MultiChoiceQuestion from "../../components/MultipleChoiceQuestion";
import NextButton from "../../components/NextButton";
import Character from "../../components/onboarding/Character";

// Définition du type pour un cours
interface Course {
    id: string;
    title: string;
    description?: string | null;
}

export default function SelectCoursePage() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    // 1. Récupérer les cours depuis l'API au chargement de la page
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                setLoading(true);
                const response = await fetch("/api/courses");
                if (!response.ok) {
                    throw new Error("Failed to fetch courses.");
                }
                const data = await response.json();
                setCourses(data);
                setError(null);
            } catch (err) {
                setError((err as Error).message);
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    // 2. Gérer la soumission du choix de l'utilisateur
    const handleCourseSelection = async () => {
        if (!selectedCourse) {
            alert("Veuillez sélectionner un cours.");
            return;
        }

        try {
            const response = await fetch("/api/courses", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ courseId: selectedCourse }),
            });

            if (response.ok) {
                // 3. Rediriger vers la page des questions après succès
                router.push("/courses");
            } else {
                const errorData = await response.json();
                throw new Error(
                    errorData.error || "Failed to select the course."
                );
            }
        } catch (err) {
            setError((err as Error).message);
            alert(`Error: ${(err as Error).message}`);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                Chargement des cours...
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

    return (
        <div className="flex flex-col min-h-screen bg-white">
            <main className="flex-grow flex flex-col items-center justify-center w-full max-w-lg mx-auto text-center px-4 md:px-6">
                <div className="flex items-center justify-center mb-8">
                    <Character />
                    <div className="ml-4 bg-lime-50 border-2 border-lime-300 rounded-2xl p-4">
                        <p className="font-medium text-neutral-800">
                            Quel cours souhaitez-vous commencer aujourd'hui ?
                        </p>
                    </div>
                </div>

                <MultiChoiceQuestion
                    data={courses.map((course) => ({
                        id: course.id,
                        label: course.title,
                    }))}
                    value={selectedCourse}
                    onSelectionChange={(id) => setSelectedCourse(id)}
                    layout="list"
                    onTryAgain={() => {}}
                />

                <footer className="flex justify-center p-4 md:p-6 mt-8">
                    <NextButton
                        onClick={handleCourseSelection}
                        disabled={!selectedCourse}
                    >
                        Commencer à apprendre
                    </NextButton>
                </footer>
            </main>
        </div>
    );
}
