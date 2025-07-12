"use client";

import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();
  const handleGetStarted = () => {
    router.push("/onboarding");
  };
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="text-center">
        <h1 className="text-5xl font-extrabold mb-8 animate-fade-in-down">
          Bienvenue sur Learning Platform
        </h1>
        <p className="text-lg text-gray-300 mb-10">
          Votre nouvelle expérience d'apprentissage commence ici.
        </p>
        <button
          onClick={handleGetStarted}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full text-lg transition duration-300 ease-in-out transform hover:scale-105"
        >
          Get started
        </button>
      </div>
    </main>
  );
}
