
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Bookmark, Edit, Save } from "lucide-react";
import databaseService, { Itinerary } from "@/services/database-service";
import { auth } from "@/services/firebase";
import { toast } from "sonner";

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
  isSaving
}: ItineraryResultProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(itineraryContent);
  const [isSavingLocally, setIsSavingLocally] = useState(false);

  const handleSaveEdit = () => {
    setIsEditing(false);
    setIsSavingLocally(true);
    
    // You could implement a way to save edited content back to state
    setTimeout(() => {
      setIsSavingLocally(false);
      toast.success("Changes saved");
    }, 500);
  };

  const handleSaveToAccount = async () => {
    if (!auth.currentUser) {
      toast.error("Please sign in to save itineraries");
      return;
    }

    try {
      setIsSavingLocally(true);
      
      const currentTime = new Date().toISOString();
      
      // Create itinerary object
      const itineraryData: Itinerary = {
        name: `${days}-Day Trip to ${destination}`,
        description: `Personalized ${days}-day itinerary for ${destination}`,
        days: parseInt(days),
        destinations: [destination],
        location: {
          name: destination
        },
        content: editedContent || itineraryContent,
        tags: [],
        userId_created: auth.currentUser.uid, // Using userId_created instead of created_by
        is_public: true,
        created_at: currentTime,
        updated_at: currentTime,
        createdAt: currentTime
      };
      
      await databaseService.addItinerary(itineraryData);
      toast.success("Itinerary saved to your account");
    } catch (error) {
      console.error("Error saving itinerary:", error);
      toast.error("Failed to save itinerary");
    } finally {
      setIsSavingLocally(false);
    }
  };

  return (
    <Card className="mt-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">
          {days}-Day Itinerary for {destination}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <Textarea
            className="min-h-[400px] font-mono text-sm"
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
          />
        ) : (
          <div className="whitespace-pre-line bg-muted p-4 rounded-md min-h-[400px] text-sm">
            {itineraryContent}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <div>
          {isEditing ? (
            <Button onClick={handleSaveEdit} disabled={isSavingLocally}>
              <Save className="mr-2 h-4 w-4" />
              {isSavingLocally ? "Saving..." : "Save Changes"}
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={() => setIsEditing(true)}
              disabled={isSaving || isSavingLocally}
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
          )}
        </div>
        <Button 
          onClick={onSave} 
          disabled={isSaving || isSavingLocally}
          className="bg-filipino-terracotta hover:bg-filipino-terracotta/90"
        >
          <Bookmark className="mr-2 h-4 w-4" />
          {isSaving ? "Saving..." : "Save"}
        </Button>
      </CardFooter>
    </Card>
  );
}
