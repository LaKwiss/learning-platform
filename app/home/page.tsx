"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import NextButton from "../../components/NextButton";

/**
 * Ce composant se charge de faire la configuration initiale de l'utilisateur
 * une seule fois en se basant sur les données de l'onboarding stockées
 * dans le localStorage.
 */
function InitialSetupTrigger({ user }) {
    useEffect(() => {
        // Ne rien faire si l'utilisateur n'est pas encore chargé.
        if (!user) return;

        // Vérifier si la configuration a déjà été faite pour éviter les doublons.
        if (localStorage.getItem("onboarding_done")) return;

        const duration = JSON.parse(
            localStorage.getItem("onboarding_duration") || "null"
        );
        const motivation = JSON.parse(
            localStorage.getItem("onboarding_motivation") || "null"
        );
        const focusAreas = JSON.parse(
            localStorage.getItem("onboarding_focusAreas") || "[]"
        );

        // Si aucune donnée d'onboarding n'est présente, ne rien faire.
        if (
            !duration &&
            !motivation &&
            (!focusAreas || focusAreas.length === 0)
        ) {
            return;
        }

        console.log("Sending initial setup data..."); // Pour le débogage

        fetch("/api/me/initial-setup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ duration, motivation, focusAreas }),
        })
            .then(async (res) => {
                if (res.ok) {
                    console.log("Initial setup successful!");
                    // Nettoyer le localStorage et marquer la configuration comme terminée.
                    localStorage.removeItem("onboarding_duration");
                    localStorage.removeItem("onboarding_motivation");
                    localStorage.removeItem("onboarding_focusAreas");
                    localStorage.setItem("onboarding_done", "1");
                } else {
                    // Gérer les erreurs serveur (ex: 400, 500).
                    const errorData = await res.json().catch(() => null); // Essayer de parser l'erreur
                    console.error(
                        "Failed to save initial setup. Server responded with:",
                        res.status,
                        errorData
                    );
                    // On ne nettoie pas le localStorage pour pouvoir réessayer plus tard,
                    // mais on pourrait ajouter une logique pour éviter les spams (ex: compteur d'échecs).
                }
            })
            .catch((error) => {
                // Gérer les erreurs réseau (pas de connexion, etc.).
                console.error(
                    "An error occurred during initial setup fetch:",
                    error
                );
            });

        // Ce `useEffect` dépend de l'objet `user`. Il se déclenchera
        // une fois que `user` sera chargé par Clerk.
    }, [user]);

    return null;
}

export default function HomePage() {
    // Le hook useUser rend ce composant un "Client Component".
    const { isLoaded, isSignedIn, user } = useUser();
    const router = useRouter();

    const handleChooseCourse = () => {
        router.push("/select-course");
    };

    // Pendant que Clerk charge l'état de l'utilisateur, on peut afficher un loader.
    // Cela évite un flash de contenu vide ou de la page de connexion.
    if (!isLoaded) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                Chargement...
            </div>
        );
    }

    // Si l'utilisateur n'est pas connecté (devrait être géré par le middleware, mais double sécurité).
    if (!isSignedIn) {
        // Normalement, le middleware Clerk devrait déjà avoir redirigé.
        return null;
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            {/* On passe `user` pour que le trigger s'active une fois l'utilisateur connu */}
            <InitialSetupTrigger user={user} />

            <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-800">
                    Bonjour, {user.firstName || "cher utilisateur"} !
                </h1>
                <p className="mt-2 text-lg text-gray-600">
                    Bienvenue sur votre nouvelle plateforme d'apprentissage.
                </p>
                <div className="mt-8">
                    <NextButton onClick={handleChooseCourse}>
                        Choisir un cours
                    </NextButton>
                </div>
            </div>
        </div>
    );
}
