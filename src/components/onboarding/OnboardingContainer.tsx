
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import OnboardingStepOne from "./OnboardingStepOne";
import OnboardingStepTwo from "./OnboardingStepTwo";
import OnboardingStepThree from "./OnboardingStepThree";
import VideoBackground from "./VideoBackground";

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
    <VideoBackground>
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

        <div className="p-6 border-t border-white/10 bg-transparent backdrop-blur-sm">
          <div className="flex justify-between items-center mb-4">
            <div className="flex space-x-2">
              {[1, 2, 3].map((step) => (
                <div 
                  key={step}
                  className={`h-2 w-${step === currentStep ? '8' : '2'} rounded-full ${
                    step <= currentStep ? 'bg-filipino-terracotta' : 'bg-white/30'
                  }`}
                />
              ))}
            </div>
            <div className="text-sm text-white">
              {currentStep} of 3
            </div>
          </div>

          <div className="flex space-x-4">
            {currentStep > 1 && (
              <Button 
                variant="outline" 
                onClick={handleBack}
                className="flex-1 border-white/20 text-white hover:bg-white/10 hover:text-white"
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
    </VideoBackground>
  );
}
