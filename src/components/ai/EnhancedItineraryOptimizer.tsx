
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { generateItinerary } from "@/services/gemini-api";
import { Loader2, Calendar, MapPin, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import databaseService from "@/services/database-service";
import { auth } from "@/services/firebase";

export default function EnhancedItineraryOptimizer() {
  const [destination, setDestination] = useState("");
  const [days, setDays] = useState("3");
  const [preferences, setPreferences] = useState("");
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

      // For demo purposes, log the data instead of saving
      console.log("Saving itinerary:", itineraryData);
      
      // In a real implementation, we would save to Firebase
      // const itineraryId = await databaseService.saveItinerary(itineraryData);
      
      // For now, simulate a delay and show success
      await new Promise(resolve => setTimeout(resolve, 1000));

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
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center">
            <Calendar className="mr-2 h-5 w-5 text-filipino-teal" />
            AI Itinerary Generator
          </CardTitle>
          <CardDescription>
            Create a personalized travel itinerary with our AI assistant
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="destination">Destination</Label>
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <Input
                id="destination"
                placeholder="e.g., Boracay, Palawan, Cebu"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="days">Number of Days</Label>
            <Select
              value={days}
              onValueChange={setDays}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select days" />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6, 7, 10, 14].map((day) => (
                  <SelectItem key={day} value={day.toString()}>
                    {day} {day === 1 ? "day" : "days"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="preferences">Preferences (Optional)</Label>
            <Textarea
              id="preferences"
              placeholder="e.g., outdoor activities, local food, cultural experiences, budget-friendly options"
              value={preferences}
              onChange={(e) => setPreferences(e.target.value)}
              className="min-h-20"
            />
          </div>

          <div className="flex flex-wrap gap-2 mt-2">
            <Badge variant="outline" className="cursor-pointer" onClick={() => setPreferences(prev => prev + (prev ? ", " : "") + "adventure")}>Adventure</Badge>
            <Badge variant="outline" className="cursor-pointer" onClick={() => setPreferences(prev => prev + (prev ? ", " : "") + "relaxation")}>Relaxation</Badge>
            <Badge variant="outline" className="cursor-pointer" onClick={() => setPreferences(prev => prev + (prev ? ", " : "") + "cultural")}>Cultural</Badge>
            <Badge variant="outline" className="cursor-pointer" onClick={() => setPreferences(prev => prev + (prev ? ", " : "") + "budget-friendly")}>Budget-friendly</Badge>
            <Badge variant="outline" className="cursor-pointer" onClick={() => setPreferences(prev => prev + (prev ? ", " : "") + "luxury")}>Luxury</Badge>
            <Badge variant="outline" className="cursor-pointer" onClick={() => setPreferences(prev => prev + (prev ? ", " : "") + "food")}>Food</Badge>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full bg-filipino-teal hover:bg-filipino-teal/90" 
            onClick={handleGenerateItinerary}
            disabled={isGenerating || !destination}
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Itinerary...
              </>
            ) : (
              <>
                Generate Itinerary
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      {generatedItinerary && (
        <Card>
          <CardHeader>
            <CardTitle>Your {days}-Day Itinerary for {destination}</CardTitle>
            <CardDescription>
              Personalized travel plan based on your preferences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none">
              <div className="whitespace-pre-line">
                {generatedItinerary}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline">Share</Button>
            <Button 
              onClick={handleSaveItinerary}
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Itinerary"
              )}
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
