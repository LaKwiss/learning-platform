// app/onboarding/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import Step1 from "../../components/onboarding/Step1";
import Step2 from "../../components/onboarding/Step2";
import Step3 from "../../components/onboarding/Step3";
import Step4 from "../../components/onboarding/Step4";

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;
  const router = useRouter();

  const [duration, setDuration] = useState<number | null>(null);
  const [motivation, setMotivation] = useState<string | null>(null);
  const [focusAreas, setFocusAreas] = useState<string[]>([]);

  const handleNext = () => {
    switch (currentStep) {
      case 2:
        if (duration)
          localStorage.setItem("onboarding_duration", JSON.stringify(duration));
        break;
      case 3:
        if (motivation)
          localStorage.setItem(
            "onboarding_motivation",
            JSON.stringify(motivation)
          );
        break;
      case 4:
        if (focusAreas.length > 0)
          localStorage.setItem(
            "onboarding_focusAreas",
            JSON.stringify(focusAreas)
          );
        break;
    }

    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      // Redirection vers la page de connexion
      router.push("/sign-in");
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1 onNext={handleNext} />;
      case 2:
        return (
          <Step2
            onNext={handleNext}
            onBack={handleBack}
            value={duration}
            onChange={setDuration}
          />
        );
      case 3:
        return (
          <Step3
            onNext={handleNext}
            onBack={handleBack}
            value={motivation}
            onChange={setMotivation}
          />
        );
      case 4:
        return (
          <Step4
            onFinish={handleNext}
            onBack={handleBack}
            value={focusAreas}
            onChange={setFocusAreas}
          />
        );
      default:
        return null;
    }
  };

  return <div className="bg-white">{renderStep()}</div>;
}
