
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

  const handleGenerateItinerary = (destination: string, days: number, preferences: string) => {
    if (!user) {
      setShowAuthPrompt(true);
      return;
    }
    
    // Update current state
    setCurrentDestination(destination);
    setCurrentDays(days.toString());
    
    // Normal itinerary generation logic...
    setIsGenerating(true);
    // Simulate API call
    setTimeout(() => {
      const fakeItinerary = `
## ${days}-Day Itinerary for ${destination}

### Day 1
- Morning: Breakfast at local café
- Afternoon: City tour of ${destination}
- Evening: Dinner at beachfront restaurant

### Day 2
- Morning: Hiking in nearby mountains
- Afternoon: Swimming and relaxation
- Evening: Cultural show

${preferences ? `\nTailored for preferences: ${preferences}` : ''}
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

  return (
    <div className="w-full">
      <ItineraryForm
        onGenerate={handleGenerateItinerary}
        initialDestination={destination}
        initialDays={parseInt(days) || 5}
        initialPreferences={initialItinerary}
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
