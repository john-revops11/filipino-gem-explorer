import { useState } from "react";
import { Sparkles, Globe, Utensils, MapPin, Calendar } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import databaseService from "@/services/database-service";
import { 
  generateTravelRecommendations, 
  generateItinerary, 
  generatePhilippinesDestinationProfile,
  generatePlaceDetails,
  generateFoodCuisineInfo,
  generateToursAndEvents
} from "@/services/gemini-api";
import { parseDestinations, generateFoodsForDestination } from "@/utils/content-parser";

type ContentType = "destination" | "place" | "food" | "itinerary" | "event";

export function ContentGeneratorDialog() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [contentType, setContentType] = useState<ContentType>("destination");
  const [openDialog, setOpenDialog] = useState(false);
  const queryClient = useQueryClient();
  
  const [location, setLocation] = useState("Cebu");
  const [numItems, setNumItems] = useState("3");
  
  const [region, setRegion] = useState("Visayas");
  const [description, setDescription] = useState("");
  
  const [days, setDays] = useState("3");
  const [travelStyle, setTravelStyle] = useState("Budget");
  const [preferences, setPreferences] = useState("");
  
  const [placeType, setPlaceType] = useState("Attraction");
  
  const [cuisine, setCuisine] = useState("");
  
  const [eventType, setEventType] = useState("Festival");
  const [eventDate, setEventDate] = useState("");

  const handleGenerateContent = async () => {
    if (!location) {
      toast.error("Please enter a location");
      return;
    }

    setIsGenerating(true);
    try {
      switch (contentType) {
        case "destination":
          await generateDestinations();
          break;
        case "place":
          await generatePlaces();
          break;
        case "food":
          await generateFoods();
          break;
        case "itinerary":
          await generateItineraries();
          break;
        case "event":
          await generateEvents();
          break;
      }
      
      setOpenDialog(false);
      toast.success(`Generated ${contentType} content successfully`);
    } catch (error) {
      console.error(`Error generating ${contentType} content:`, error);
      toast.error(`Failed to generate ${contentType} content`);
    } finally {
      setIsGenerating(false);
    }
  };
  
  const generateDestinations = async () => {
    const locationData = await generatePhilippinesDestinationProfile({
      location: location,
      region: region,
      description: description
    });
    
    const destinations = parseDestinations(locationData, parseInt(numItems, 10));
    
    for (const destination of destinations) {
      await databaseService.saveLocation(destination);
      
      await generateFoodsForDestination(destination);
    }
    
    queryClient.invalidateQueries({ queryKey: ["locations"] });
  };
  
  const generatePlaces = async () => {
    const placeData = await generatePlaceDetails({
      location: location, 
      placeType: placeType,
      description: description
    });
    
    const places = JSON.parse(placeData);
    
    if (Array.isArray(places)) {
      for (const place of places) {
        await databaseService.savePlace(place);
      }
    } else {
      await databaseService.savePlace(places);
    }
    
    queryClient.invalidateQueries({ queryKey: ["places"] });
  };
  
  const generateFoods = async () => {
    const foodData = await generateFoodCuisineInfo({
      location: location,
      cuisine: cuisine
    });
    
    const foods = JSON.parse(foodData);
    
    if (Array.isArray(foods)) {
      for (const food of foods) {
        await databaseService.saveFoodItem(food);
      }
    } else {
      await databaseService.saveFoodItem(foods);
    }
    
    queryClient.invalidateQueries({ queryKey: ["foods"] });
  };
  
  const generateItineraries = async () => {
    const itineraryData = await generateItinerary(
      location,
      parseInt(days),
      `Travel style: ${travelStyle}. ${preferences}`
    );
    
    await databaseService.addItinerary({
      title: `${days}-Day ${location} Itinerary`,
      days: parseInt(days),
      location: location,
      content: itineraryData,
      travelStyle: travelStyle,
      createdAt: new Date().toISOString()
    });
    
    queryClient.invalidateQueries({ queryKey: ["itineraries"] });
  };
  
  const generateEvents = async () => {
    const eventData = await generateToursAndEvents({
      location: location,
      eventType: eventType,
      date: eventDate,
      description: description
    });
    
    const events = JSON.parse(eventData);
    
    if (Array.isArray(events)) {
      for (const event of events) {
        await databaseService.addEvent(event);
      }
    } else {
      await databaseService.addEvent(events);
    }
    
    queryClient.invalidateQueries({ queryKey: ["events"] });
  };

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Sparkles className="h-4 w-4" />
          Generate Content
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>AI Content Generator</DialogTitle>
          <DialogDescription>
            Generate various types of content for your Philippines travel platform using AI.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="destination" onValueChange={(value) => setContentType(value as ContentType)}>
          <TabsList className="grid grid-cols-5 mb-4">
            <TabsTrigger value="destination">Destinations</TabsTrigger>
            <TabsTrigger value="place">Places</TabsTrigger>
            <TabsTrigger value="food">Food</TabsTrigger>
            <TabsTrigger value="itinerary">Itineraries</TabsTrigger>
            <TabsTrigger value="event">Events</TabsTrigger>
          </TabsList>
          
          <TabsContent value="destination" className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="location">Location or Region</Label>
              <Input
                id="location"
                placeholder="e.g., Cebu, Palawan, Manila"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="region">Part of Philippines</Label>
              <Select value={region} onValueChange={setRegion}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Luzon">Luzon</SelectItem>
                  <SelectItem value="Visayas">Visayas</SelectItem>
                  <SelectItem value="Mindanao">Mindanao</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Brief Description (optional)</Label>
              <Textarea
                id="description"
                placeholder="Known for rolling hills, beaches, etc."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="num-items">Number to Generate</Label>
              <Input
                id="num-items"
                type="number"
                min="1"
                max="5"
                value={numItems}
                onChange={(e) => setNumItems(e.target.value)}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="place" className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="place-location">Location</Label>
              <Input
                id="place-location"
                placeholder="e.g., Cebu, Palawan, Manila"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="place-type">Place Type</Label>
              <Select value={placeType} onValueChange={setPlaceType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select place type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Attraction">Attraction</SelectItem>
                  <SelectItem value="Hidden Gem">Hidden Gem</SelectItem>
                  <SelectItem value="Beach">Beach</SelectItem>
                  <SelectItem value="Mountain">Mountain</SelectItem>
                  <SelectItem value="Historical Site">Historical Site</SelectItem>
                  <SelectItem value="Museum">Museum</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="place-description">Brief Description (optional)</Label>
              <Textarea
                id="place-description"
                placeholder="Known for crystal clear waters, historical significance, etc."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="place-num-items">Number to Generate</Label>
              <Input
                id="place-num-items"
                type="number"
                min="1"
                max="5"
                value={numItems}
                onChange={(e) => setNumItems(e.target.value)}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="food" className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="food-location">Location</Label>
              <Input
                id="food-location"
                placeholder="e.g., Cebu, Pampanga, Iloilo"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="cuisine">Cuisine or Dish (optional)</Label>
              <Input
                id="cuisine"
                placeholder="e.g., Lechon, Sisig, or leave blank for regional cuisine"
                value={cuisine}
                onChange={(e) => setCuisine(e.target.value)}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="food-num-items">Number to Generate</Label>
              <Input
                id="food-num-items"
                type="number"
                min="1"
                max="5"
                value={numItems}
                onChange={(e) => setNumItems(e.target.value)}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="itinerary" className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="itinerary-location">Destination</Label>
              <Input
                id="itinerary-location"
                placeholder="e.g., Cebu, Boracay, Bohol"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="days">Number of Days</Label>
              <Input
                id="days"
                type="number"
                min="1"
                max="10"
                value={days}
                onChange={(e) => setDays(e.target.value)}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="travel-style">Travel Style</Label>
              <Select value={travelStyle} onValueChange={setTravelStyle}>
                <SelectTrigger>
                  <SelectValue placeholder="Select travel style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Budget">Budget</SelectItem>
                  <SelectItem value="Mid-range">Mid-range</SelectItem>
                  <SelectItem value="Luxury">Luxury</SelectItem>
                  <SelectItem value="Family-friendly">Family-friendly</SelectItem>
                  <SelectItem value="Adventure">Adventure</SelectItem>
                  <SelectItem value="Cultural">Cultural</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="preferences">Additional Preferences (optional)</Label>
              <Textarea
                id="preferences"
                placeholder="e.g., Interested in diving, local cuisine, historical sites..."
                value={preferences}
                onChange={(e) => setPreferences(e.target.value)}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="event" className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="event-location">Location</Label>
              <Input
                id="event-location"
                placeholder="e.g., Cebu, Manila, Davao"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="event-type">Event Type</Label>
              <Select value={eventType} onValueChange={setEventType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select event type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Festival">Festival</SelectItem>
                  <SelectItem value="Cultural Event">Cultural Event</SelectItem>
                  <SelectItem value="Religious Fiesta">Religious Fiesta</SelectItem>
                  <SelectItem value="Market">Market</SelectItem>
                  <SelectItem value="Food Festival">Food Festival</SelectItem>
                  <SelectItem value="Tour Package">Tour Package</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="event-date">Date/Season (optional)</Label>
              <Input
                id="event-date"
                placeholder="e.g., January, Holy Week, Third Sunday of January"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="event-description">Known Highlights (optional)</Label>
              <Textarea
                id="event-description"
                placeholder="e.g., Street dancing, fluvial parade, fireworks..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="event-num-items">Number to Generate</Label>
              <Input
                id="event-num-items"
                type="number"
                min="1"
                max="5"
                value={numItems}
                onChange={(e) => setNumItems(e.target.value)}
              />
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => setOpenDialog(false)}>
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
