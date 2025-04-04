
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
import { Loader2, Share2, Download, Bookmark } from "lucide-react";

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
            <Button variant="outline" size="icon" className="h-8 w-8">
              <Share2 className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="h-8 w-8">
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
          onClick={onSave}
          disabled={isSaving}
          className="bg-filipino-teal hover:bg-filipino-teal/90 text-white gap-2"
        >
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
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
