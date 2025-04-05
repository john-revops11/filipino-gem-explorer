
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
  const [generationError, setGenerationError] = useState<string | null>(null);

  const handleGenerateItinerary = async () => {
    if (!user) {
      setShowAuthPrompt(true);
      return;
    }
    
    if (!currentDestination) {
      toast.error("Please enter a destination");
      return;
    }
    
    if (!currentDays || parseInt(currentDays) < 1) {
      toast.error("Please enter a valid number of days");
      return;
    }
    
    setIsGenerating(true);
    setGenerationError(null);
    
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
      
      // Validate the response
      if (!formattedItinerary || formattedItinerary.trim() === '') {
        throw new Error("Empty response received from API");
      }
      
      setGeneratedItinerary(formattedItinerary);
      console.log("Successfully generated itinerary");
      
    } catch (error) {
      console.error("Error generating itinerary:", error);
      setGenerationError(error instanceof Error ? error.message : 'Unknown error occurred');
      toast.error("Could not generate an itinerary", {
        description: "Please try again with different parameters."
      });
      setGeneratedItinerary(""); // Clear any previous content
      
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
      
      {generationError && (
        <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-400 rounded">
          <p className="text-sm text-red-700">
            There was an error generating your itinerary. Please try again or modify your request.
          </p>
          <p className="text-xs text-red-500 mt-1">
            Error details: {generationError}
          </p>
        </div>
      )}
      
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
