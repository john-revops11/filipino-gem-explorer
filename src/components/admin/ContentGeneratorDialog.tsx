
import { useState } from "react";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import databaseService from "@/services/database-service";
import { generateTravelRecommendations } from "@/services/gemini-api";
import { parseDestinations, generateFoodsForDestination } from "@/utils/content-parser";

export function ContentGeneratorDialog() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [prompt, setPrompt] = useState("Cebu");
  const [numItems, setNumItems] = useState("3");
  const [openDialog, setOpenDialog] = useState(false);
  const queryClient = useQueryClient();

  const handleGenerateContent = async () => {
    if (!prompt) {
      toast.error("Please enter a location");
      return;
    }

    setIsGenerating(true);
    try {
      // Generate data about the location
      const locationData = await generateTravelRecommendations({
        location: prompt,
        interests: ["culture", "food", "activities"],
      });

      // Parse the generated content
      const destinations = parseDestinations(locationData, parseInt(numItems, 10));
      
      // Save destinations to database
      for (const destination of destinations) {
        await databaseService.saveLocation(destination);
        
        // For each destination, generate 1-2 food items
        await generateFoodsForDestination(destination);
      }
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["locations"] });
      queryClient.invalidateQueries({ queryKey: ["foods"] });
      
      setOpenDialog(false);
      toast.success(`Generated ${destinations.length} destinations with related content`);
    } catch (error) {
      console.error("Error generating content:", error);
      toast.error("Failed to generate content");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Sparkles className="h-4 w-4" />
          Generate Content
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Generate Destination Content</DialogTitle>
          <DialogDescription>
            Generate destinations, food items, and other related data using AI.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="location">Location or Region</Label>
            <Input
              id="location"
              placeholder="e.g., Cebu, Palawan, Manila"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Enter a location in the Philippines to generate related content
            </p>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="num-items">Number of Destinations</Label>
            <Input
              id="num-items"
              type="number"
              min="1"
              max="5"
              value={numItems}
              onChange={(e) => setNumItems(e.target.value)}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpenDialog(false)}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleGenerateContent}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2"></div>
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Generate
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
