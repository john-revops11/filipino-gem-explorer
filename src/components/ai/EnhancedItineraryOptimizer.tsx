
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { generateItinerary } from "@/services/gemini-api";
import { ItineraryForm } from "./itinerary/ItineraryForm";
import { ItineraryResult } from "./itinerary/ItineraryResult";
import databaseService from "@/services/database-service";
import { auth } from "@/services/firebase";

export default function EnhancedItineraryOptimizer() {
  // State for form inputs
  const [destination, setDestination] = useState("");
  const [days, setDays] = useState("3");
  const [preferences, setPreferences] = useState("");
  
  // State for itinerary generation
  const [generatedItinerary, setGeneratedItinerary] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const { toast } = useToast();

  const handleGenerateItinerary = async () => {
    if (!destination) {
      toast({
        title: "Destination required",
        description: "Please enter a destination to generate an itinerary",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setGeneratedItinerary("");

    try {
      const itinerary = await generateItinerary(
        destination,
        parseInt(days),
        preferences
      );
      setGeneratedItinerary(itinerary);
    } catch (error) {
      console.error("Error generating itinerary:", error);
      toast({
        title: "Generation failed",
        description: "Failed to generate itinerary. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveItinerary = async () => {
    if (!generatedItinerary) return;

    setIsSaving(true);
    try {
      // Create itinerary data object based on our database structure
      const itineraryData = {
        name: `${days}-Day Trip to ${destination}`,
        description: `Personalized ${days}-day itinerary for ${destination} with preferences: ${preferences}`,
        days: [], // This would be populated with actual day references in a real implementation
        total_price: "Estimate unavailable", // This would be calculated in a real implementation
        location: {
          region_id: "placeholder-region", // These would be actual IDs in a real implementation
          province_id: "placeholder-province",
          city_id: "placeholder-city"
        },
        tags: preferences.split(',').map(pref => pref.trim()), 
        content: generatedItinerary,
        created_by: auth.currentUser?.uid || "anonymous-user",
        is_public: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Save the itinerary using our database service
      await databaseService.saveItinerary(itineraryData);

      toast({
        title: "Itinerary saved",
        description: "Your itinerary has been saved successfully",
      });
    } catch (error) {
      console.error("Error saving itinerary:", error);
      toast({
        title: "Save failed",
        description: "Failed to save the itinerary. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <ItineraryForm
        destination={destination}
        setDestination={setDestination}
        days={days}
        setDays={setDays}
        preferences={preferences}
        setPreferences={setPreferences}
        onGenerate={handleGenerateItinerary}
        isGenerating={isGenerating}
      />

      {generatedItinerary && (
        <ItineraryResult
          destination={destination}
          days={days}
          itineraryContent={generatedItinerary}
          onSave={handleSaveItinerary}
          isSaving={isSaving}
        />
      )}
    </div>
  );
}
