
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Wand2, Bookmark, Edit, Save } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import databaseService, { Itinerary } from "@/services/database-service";
import { auth } from "@/services/firebase";
import { answerTravelQuestion } from "@/services/gemini-api";

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
  const [optimizedType, setOptimizedType] = useState("Balanced");
  const [optimizedItinerary, setOptimizedItinerary] = useState(initialItinerary);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setOptimizedItinerary(initialItinerary);
  }, [initialItinerary]);

  const generateOptimizedItinerary = async () => {
    setIsGenerating(true);
    try {
      const prompt = `Optimize the following ${days}-day itinerary for ${destination}, focusing on ${optimizedType} experiences:\n\n${initialItinerary}\n\nProvide a detailed day-by-day itinerary with specific activities and recommendations.`;
      
      const aiResponse = await answerTravelQuestion(prompt);
      setOptimizedItinerary(aiResponse);
      toast({
        title: "Itinerary Optimized!",
        description: `Successfully generated an AI-optimized ${optimizedType} itinerary for ${destination}.`,
      });
    } catch (error) {
      console.error("Error generating optimized itinerary:", error);
      toast({
        variant: "destructive",
        title: "Optimization Failed",
        description: "Failed to generate the optimized itinerary. Please try again.",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Inside the component, find the createItinerary function
  const createItinerary = async () => {
    if (!auth.currentUser) {
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: "Please sign in to save this itinerary"
      });
      return;
    }

    try {
      setIsSaving(true);
      const currentTime = new Date().toISOString();

      const itineraryData: Itinerary = {
        name: `${days}-Day ${optimizedType} Trip to ${destination}`,
        description: `AI-optimized ${days}-day itinerary for ${destination} with ${optimizedType} focus`,
        days: parseInt(days),
        destinations: [destination],
        location: {
          name: destination
        },
        content: optimizedItinerary,
        tags: ["AI-optimized", optimizedType, destination],
        userId_created: auth.currentUser.uid,
        is_public: true,
        created_at: currentTime,
        updated_at: currentTime,
        createdAt: currentTime
      };

      await databaseService.addItinerary(itineraryData);
      toast({
        title: "Success",
        description: "Itinerary saved to your account"
      });
      
      // Navigate to itineraries page or do any other post-save action
    } catch (error) {
      console.error("Error saving itinerary:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save itinerary"
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="mt-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">
          Enhanced Itinerary Optimizer
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Select onValueChange={setOptimizedType} defaultValue="Balanced">
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Optimization Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Balanced">Balanced</SelectItem>
              <SelectItem value="Cultural">Cultural</SelectItem>
              <SelectItem value="Adventure">Adventure</SelectItem>
              <SelectItem value="Relaxing">Relaxing</SelectItem>
              <SelectItem value="Food">Food</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Textarea
          className="min-h-[300px] font-mono text-sm"
          value={optimizedItinerary}
          readOnly
        />
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="secondary"
          onClick={generateOptimizedItinerary}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <>
              <Wand2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Wand2 className="mr-2 h-4 w-4" />
              Generate Optimized Itinerary
            </>
          )}
        </Button>
        <Button onClick={createItinerary} disabled={isSaving} className="bg-filipino-terracotta hover:bg-filipino-terracotta/90">
          {isSaving ? (
            <>
              <Save className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Bookmark className="mr-2 h-4 w-4" />
              Save Itinerary
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}

// Add default export to fix the import issue
export default EnhancedItineraryOptimizer;
