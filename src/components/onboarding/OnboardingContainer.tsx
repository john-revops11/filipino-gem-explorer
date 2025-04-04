
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import OnboardingStepOne from "./OnboardingStepOne";
import OnboardingStepTwo from "./OnboardingStepTwo";
import OnboardingStepThree from "./OnboardingStepThree";

export default function OnboardingContainer({ onComplete }: { onComplete: () => void }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [preferences, setPreferences] = useState({
    interests: [],
    travelStyle: "",
    budget: "",
  });

  const updatePreferences = (key: string, value: any) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep((prev) => prev + 1);
    } else {
      localStorage.setItem("onboardingComplete", "true");
      localStorage.setItem("userPreferences", JSON.stringify(preferences));
      onComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 p-6">
        {currentStep === 1 && <OnboardingStepOne />}
        {currentStep === 2 && (
          <OnboardingStepTwo 
            preferences={preferences} 
            updatePreferences={updatePreferences} 
          />
        )}
        {currentStep === 3 && (
          <OnboardingStepThree 
            preferences={preferences} 
            updatePreferences={updatePreferences} 
          />
        )}
      </div>

      <div className="p-6 bg-card border-t">
        <div className="flex justify-between items-center mb-4">
          <div className="flex space-x-2">
            {[1, 2, 3].map((step) => (
              <div 
                key={step}
                className={`h-2 w-${step === currentStep ? '8' : '2'} rounded-full ${
                  step <= currentStep ? 'bg-filipino-terracotta' : 'bg-muted'
                }`}
              />
            ))}
          </div>
          <div className="text-sm text-muted-foreground">
            {currentStep} of 3
          </div>
        </div>

        <div className="flex space-x-4">
          {currentStep > 1 && (
            <Button 
              variant="outline" 
              onClick={handleBack}
              className="flex-1"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          )}
          
          <Button 
            onClick={handleNext} 
            className="flex-1 bg-filipino-terracotta hover:bg-filipino-terracotta/90"
          >
            {currentStep === 3 ? "Get Started" : "Continue"}
            {currentStep < 3 && <ChevronRight className="ml-2 h-4 w-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
}
