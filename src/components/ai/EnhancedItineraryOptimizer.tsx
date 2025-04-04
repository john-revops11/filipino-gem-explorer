
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { ItineraryForm } from "@/components/ai/itinerary/ItineraryForm";
import { ItineraryResult } from "@/components/ai/itinerary/ItineraryResult";
import { AuthPrompt } from "@/components/auth/AuthPrompt";
import { generateItinerary } from "@/services/gemini-api";
import { toast } from "sonner";
import { format, addDays } from "date-fns";

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
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);

  const handleGenerateItinerary = async () => {
    if (!user) {
      setShowAuthPrompt(true);
      return;
    }
    
    setIsGenerating(true);
    
    try {
      // Format the date if it exists
      const dateInfo = startDate ? `starting on ${format(startDate, 'MMMM d, yyyy')}` : '';
      
      // Use the Gemini API to generate a detailed itinerary
      const formattedItinerary = await generateItinerary(
        currentDestination, 
        parseInt(currentDays) || 3, 
        currentPreferences,
        dateInfo
      );
      
      setGeneratedItinerary(formattedItinerary);
    } catch (error) {
      console.error("Error generating itinerary:", error);
      toast.error("Failed to generate itinerary. Please try again.");
      
      // Fallback to simpler itinerary if API fails
      const fallbackItinerary = `
## ${currentDays}-Day Itinerary for ${currentDestination}

### Day 1
- Morning: Breakfast at local café
- Afternoon: City tour of ${currentDestination}
- Evening: Dinner at beachfront restaurant

### Day 2
- Morning: Hiking in nearby mountains
- Afternoon: Swimming and relaxation
- Evening: Cultural show

${startDate ? `\nTrip dates: ${format(startDate, 'MMMM d, yyyy')} to ${format(addDays(startDate, parseInt(currentDays)), 'MMMM d, yyyy')}` : ''}
${currentPreferences ? `\nTailored for preferences: ${currentPreferences}` : ''}
      `;
      setGeneratedItinerary(fallbackItinerary);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveItinerary = () => {
    setIsSaving(true);
    // Simulate saving
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Itinerary saved successfully!");
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
        startDate={startDate}
        setStartDate={setStartDate}
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
