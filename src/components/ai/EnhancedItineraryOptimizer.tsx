
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { ItineraryForm } from "@/components/ai/itinerary/ItineraryForm";
import { ItineraryResult } from "@/components/ai/itinerary/ItineraryResult";
import { AuthPrompt } from "@/components/auth/AuthPrompt";

interface EnhancedItineraryOptimizerProps {
  destination: string;
  days: string;
  initialItinerary: string;
}

export function EnhancedItineraryOptimizer({
  destination,
  days,
  initialItinerary
}: EnhancedItineraryOptimizerProps) {
  const { user } = useAuth();
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [generatedItinerary, setGeneratedItinerary] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentDestination, setCurrentDestination] = useState(destination);
  const [currentDays, setCurrentDays] = useState(days);
  const [isSaving, setIsSaving] = useState(false);
  const [currentPreferences, setCurrentPreferences] = useState(initialItinerary);

  const handleGenerateItinerary = () => {
    if (!user) {
      setShowAuthPrompt(true);
      return;
    }
    
    // Normal itinerary generation logic...
    setIsGenerating(true);
    // Simulate API call
    setTimeout(() => {
      const fakeItinerary = `
## ${currentDays}-Day Itinerary for ${currentDestination}

### Day 1
- Morning: Breakfast at local café
- Afternoon: City tour of ${currentDestination}
- Evening: Dinner at beachfront restaurant

### Day 2
- Morning: Hiking in nearby mountains
- Afternoon: Swimming and relaxation
- Evening: Cultural show

${currentPreferences ? `\nTailored for preferences: ${currentPreferences}` : ''}
      `;
      setGeneratedItinerary(fakeItinerary);
      setIsGenerating(false);
    }, 2000);
  };

  const handleSaveItinerary = () => {
    setIsSaving(true);
    // Simulate saving
    setTimeout(() => {
      setIsSaving(false);
    }, 1000);
  };

  // Handle form input changes
  const handleDestinationChange = (newDestination: string) => {
    setCurrentDestination(newDestination);
  };

  const handleDaysChange = (newDays: string) => {
    setCurrentDays(newDays);
  };

  const handlePreferencesChange = (newPreferences: string) => {
    setCurrentPreferences(newPreferences);
  };

  return (
    <div className="w-full">
      <ItineraryForm
        destination={currentDestination}
        setDestination={handleDestinationChange}
        days={currentDays}
        setDays={handleDaysChange}
        preferences={currentPreferences}
        setPreferences={handlePreferencesChange}
        onGenerate={handleGenerateItinerary}
        isGenerating={isGenerating}
      />
      
      {generatedItinerary && (
        <ItineraryResult
          destination={currentDestination}
          days={currentDays}
          itineraryContent={generatedItinerary}
          onSave={handleSaveItinerary}
          isSaving={isSaving}
        />
      )}
      
      <AuthPrompt
        isOpen={showAuthPrompt}
        onClose={() => setShowAuthPrompt(false)}
        title="Login Required for AI Features"
        description="You need to be logged in to generate personalized itineraries using our AI."
        action="Log in to continue"
      />
    </div>
  );
}
