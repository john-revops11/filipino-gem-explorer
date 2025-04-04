
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
import { Loader2, Share2, Download, Bookmark, BookmarkCheck } from "lucide-react";
import { toast } from "sonner";
import databaseService from "@/services/database-service";
import { auth } from "@/services/firebase";

interface ItineraryResultProps {
  destination: string;
  days: string;
  itineraryContent: string;
  onSave: () => void;
  isSaving: boolean;
}

export function ItineraryResult({
  destination,
  days,
  itineraryContent,
  onSave,
  isSaving,
}: ItineraryResultProps) {
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = async () => {
    try {
      // Get the current user
      const user = auth.currentUser;

      if (!user) {
        toast.error("You need to be logged in to save itineraries", {
          description: "Please sign in or create an account to save this itinerary."
        });
        return;
      }

      // Save the itinerary to Firebase
      await databaseService.saveGeneratedItinerary(
        destination,
        days,
        itineraryContent,
        user.uid
      );

      // Update local state
      setIsSaved(true);
      
      // Call the parent component's onSave handler
      onSave();
      
      toast.success("Itinerary saved successfully!", {
        description: `Your ${days}-day itinerary for ${destination} has been saved to your profile.`,
      });
    } catch (error) {
      console.error("Error saving itinerary:", error);
      toast.error("Failed to save itinerary", {
        description: "There was an error saving your itinerary. Please try again."
      });
    }
  };

  const handleDownload = () => {
    // Create a blob from the itinerary content
    const blob = new Blob([itineraryContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    
    // Create a temporary link element
    const a = document.createElement("a");
    a.href = url;
    a.download = `${destination}-${days}-day-itinerary.html`;
    
    // Trigger the download
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success("Itinerary downloaded", {
      description: "Your itinerary has been downloaded successfully."
    });
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${days}-Day Itinerary for ${destination}`,
          text: `Check out this ${days}-day itinerary for ${destination}!`,
          url: window.location.href,
        });
      } else {
        // Fallback to copy to clipboard
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard!", {
          description: "Share this link with friends and family."
        });
      }
    } catch (error) {
      console.error("Error sharing:", error);
      toast.error("Unable to share", {
        description: "There was an error trying to share this itinerary."
      });
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-filipino-teal/10 to-filipino-deepTeal/5 border-b">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-filipino-deepTeal">Your {days}-Day Itinerary for {destination}</CardTitle>
            <CardDescription className="mt-1">
              Personalized travel plan based on your preferences
            </CardDescription>
          </div>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="icon" 
              className="h-8 w-8" 
              onClick={handleShare}
              title="Share itinerary"
            >
              <Share2 className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              className="h-8 w-8" 
              onClick={handleDownload}
              title="Download itinerary"
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div 
          className="prose prose-sm max-w-none prose-headings:text-filipino-deepTeal prose-a:text-filipino-teal"
          dangerouslySetInnerHTML={{ __html: itineraryContent }}
        />
      </CardContent>
      <CardFooter className="flex justify-between bg-gray-50 border-t p-4">
        <Button variant="outline" className="gap-2">
          <Bookmark className="h-4 w-4" />
          Add to Favorites
        </Button>
        <Button 
          onClick={handleSave}
          disabled={isSaving || isSaved}
          className="bg-filipino-teal hover:bg-filipino-teal/90 text-white gap-2"
        >
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : isSaved ? (
            <>
              <BookmarkCheck className="h-4 w-4" />
              Saved
            </>
          ) : (
            <>
              <Bookmark className="h-4 w-4" />
              Save Itinerary
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
