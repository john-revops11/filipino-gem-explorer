
import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Bookmark, Edit, Save, AlertTriangle } from "lucide-react";
import databaseService, { Itinerary } from "@/services/database-service";
import { auth } from "@/services/firebase";
import { toast } from "sonner";
import FormattedItinerary from "./FormattedItinerary";

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
  const [renderError, setRenderError] = useState<string | null>(null);
  const [useFormattedView, setUseFormattedView] = useState(true);

  const renderContent = useCallback(() => {
    try {
      if (!itineraryContent || itineraryContent.trim() === '') {
        return (
          <div className="text-center p-6">
            <p className="text-muted-foreground">No itinerary content available. Generate an itinerary first.</p>
          </div>
        );
      }
      
      // If destination contains "Cebu" and we want to use the formatted view
      if (destination.toLowerCase().includes("cebu") && useFormattedView) {
        return <FormattedItinerary />;
      }
      
      return (
        <div 
          className="prose prose-sm max-w-none overflow-auto"
          dangerouslySetInnerHTML={{ __html: itineraryContent }}
        />
      );
    } catch (error) {
      console.error("Error rendering itinerary content:", error);
      setRenderError(`Error rendering content: ${error instanceof Error ? error.message : 'Unknown error'}`);
      
      return (
        <div className="text-red-500 space-y-4">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2" />
            <p>There was an error rendering this content. You can view and edit it in plain text mode.</p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => setIsEditing(true)} 
            className="mt-2"
          >
            <Edit className="mr-2 h-4 w-4" />
            View in Edit Mode
          </Button>
        </div>
      );
    }
  }, [itineraryContent, destination, useFormattedView]);

  const handleSaveEdit = () => {
    setIsEditing(false);
    setIsSavingLocally(true);
    
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
        userId_created: auth.currentUser.uid,
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

  const toggleViewMode = () => {
    setUseFormattedView(!useFormattedView);
  };

  return (
    <Card className="mt-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl flex justify-between items-center">
          <span>{days}-Day Itinerary for {destination}</span>
          {destination.toLowerCase().includes("cebu") && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={toggleViewMode}
              className="text-xs"
            >
              {useFormattedView ? "Switch to Standard View" : "Switch to Enhanced View"}
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <Textarea
            className="min-h-[400px] font-mono text-sm"
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
          />
        ) : renderError ? (
          <div className="text-red-500 p-4 border border-red-200 rounded-md">
            <p className="font-medium mb-2">Error displaying itinerary</p>
            <p className="text-sm">{renderError}</p>
          </div>
        ) : (
          renderContent()
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
          onClick={handleSaveToAccount} 
          disabled={isSaving || isSavingLocally}
          className="bg-filipino-terracotta hover:bg-filipino-terracotta/90"
        >
          <Bookmark className="mr-2 h-4 w-4" />
          {isSaving ? "Saving..." : "Save to My Itineraries"}
        </Button>
      </CardFooter>
    </Card>
  );
}
