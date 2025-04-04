
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
import { Loader2 } from "lucide-react";

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
            {itineraryContent}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Share</Button>
        <Button 
          onClick={onSave}
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
  );
}
