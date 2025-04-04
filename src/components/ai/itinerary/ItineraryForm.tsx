
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
import { Loader2, Calendar, MapPin, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ItineraryFormProps {
  destination: string;
  setDestination: (value: string) => void;
  days: string;
  setDays: (value: string) => void;
  preferences: string;
  setPreferences: (value: string) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

export function ItineraryForm({
  destination,
  setDestination,
  days,
  setDays,
  preferences,
  setPreferences,
  onGenerate,
  isGenerating,
}: ItineraryFormProps) {
  // Preset preference tags that can be clicked to add to preferences
  const presetTags = [
    "adventure",
    "relaxation",
    "cultural",
    "budget-friendly",
    "luxury",
    "food",
  ];

  const handleTagClick = (tag: string) => {
    // Fix: Instead of using a function inside setPreferences, directly compute the new value
    const newPreferences = preferences ? `${preferences}, ${tag}` : tag;
    setPreferences(newPreferences);
  };

  return (
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
          {presetTags.map(tag => (
            <Badge 
              key={tag}
              variant="outline" 
              className="cursor-pointer" 
              onClick={() => handleTagClick(tag)}
            >
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full bg-filipino-teal hover:bg-filipino-teal/90" 
          onClick={onGenerate}
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
  );
}
