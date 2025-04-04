
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Layout } from "@/components/shared/Layout";
import { AdminDestinations } from "@/components/admin/AdminDestinations";
import { AdminTours } from "@/components/admin/AdminTours";
import { AdminFoods } from "@/components/admin/AdminFoods";
import { AdminItineraries } from "@/components/admin/AdminItineraries";
import { auth } from "@/services/firebase";
import { useNavigate } from "react-router-dom";
import { Shield, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { generateTravelRecommendations } from "@/services/gemini-api";
import databaseService from "@/services/database-service";
import { useQueryClient } from "@tanstack/react-query";

export default function AdminDashboard() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [prompt, setPrompt] = useState("Cebu");
  const [numItems, setNumItems] = useState("3");
  const [openDialog, setOpenDialog] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    // Basic admin check - in a real app, use proper role-based auth
    const checkAdmin = async () => {
      setIsLoading(true);
      const user = auth.currentUser;
      
      // For development purposes, allow easy access - remove in production
      if (process.env.NODE_ENV === 'development') {
        console.log('Development mode: Bypassing admin check');
        setIsAdmin(true);
        setIsLoading(false);
        return;
      }
      
      // Simple admin check based on email - replace with proper role check
      // In production, this should be done with custom claims or a roles table
      if (user && (user.email === "admin@example.com" || user.uid === "system")) {
        setIsAdmin(true);
      } else {
        // Redirect non-admins to home
        toast.error("Admin access required");
        navigate("/");
      }
      setIsLoading(false);
    };

    checkAdmin();
  }, [navigate]);

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
  
  // Helper function to parse destinations from generated text
  const parseDestinations = (text, count = 3) => {
    const destinations = [];
    const regions = {
      "Luzon": ["Manila", "Baguio", "Batangas", "Tagaytay", "Vigan", "Palawan", "Batanes", "Quezon"],
      "Visayas": ["Cebu", "Bohol", "Boracay", "Iloilo", "Bacolod", "Tacloban", "Dumaguete", "Siquijor"],
      "Mindanao": ["Davao", "Cagayan de Oro", "Zamboanga", "General Santos", "Surigao", "Butuan", "Cotabato", "Siargao"]
    };
    
    // Simple parsing logic - real implementation would be more robust
    const lines = text.split('\n');
    let currentDestination = null;
    let currentSection = null;
    
    for (const line of lines) {
      if (line.match(/^\d+\.\s+(.+)/)) {
        // New destination found
        const name = line.match(/^\d+\.\s+(.+)/)[1].split('-')[0].trim();
        if (destinations.length < count) {
          // Determine region based on name (simplified logic)
          let region = "Luzon"; // Default
          for (const [key, cities] of Object.entries(regions)) {
            if (cities.some(city => name.includes(city))) {
              region = key;
              break;
            }
          }
          
          currentDestination = {
            name: name,
            region: region,
            description: "",
            tags: ["Generated", "AI", prompt],
            image: `https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80`,
          };
          destinations.push(currentDestination);
        }
      } else if (currentDestination) {
        if (line.match(/Key attractions:/i)) {
          currentSection = "attractions";
        } else if (line.match(/Best time to visit:/i)) {
          currentSection = "time";
        } else if (line.match(/Estimated costs:/i)) {
          currentSection = "costs";
        } else if (currentSection === "attractions") {
          currentDestination.description += line + " ";
        }
      }
    }
    
    return destinations;
  };
  
  // Helper function to generate food items for a destination
  const generateFoodsForDestination = async (destination) => {
    try {
      const foodPrompt = `Name and describe 2 popular local dishes or food specialties from ${destination.name} in the Philippines.`;
      const foodData = await generateTravelRecommendations({
        location: destination.name,
        interests: ["food"]
      });
      
      // Simple parsing to extract food items
      const foodItems = [];
      const lines = foodData.split('\n');
      let currentFood = null;
      
      for (const line of lines) {
        if (line.match(/^\d+\.\s+(.+)/) || line.match(/^- (.+)/)) {
          const name = line.replace(/^\d+\.\s+|-\s+/, '').split('-')[0].trim();
          if (name && name.length > 0) {
            currentFood = {
              name: name,
              type: "Local Specialty",
              description: "",
              price_range: "₱100 - ₱300",
              location_id: destination.id, // This will be set after destination is saved
              tags: ["Local", "Traditional", destination.name],
              image: "",
            };
            foodItems.push(currentFood);
          }
        } else if (currentFood && line.trim().length > 0) {
          currentFood.description += line + " ";
        }
      }
      
      // Save food items to database
      for (const food of foodItems) {
        await databaseService.saveFoodItem(food);
      }
      
      return foodItems;
    } catch (error) {
      console.error("Error generating foods:", error);
      return [];
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-[70vh]">
          <div className="animate-spin h-8 w-8 border-4 border-filipino-teal border-t-transparent rounded-full"></div>
        </div>
      </Layout>
    );
  }

  if (!isAdmin) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-[70vh] text-center p-4">
          <Shield className="h-16 w-16 text-filipino-terracotta mb-4" />
          <h1 className="text-2xl font-bold mb-2">Admin Access Required</h1>
          <p className="text-muted-foreground mb-4">
            You don't have permission to access this area.
          </p>
          <Button onClick={() => navigate("/")} variant="default">
            Return to Home
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-filipino-deepTeal">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Manage content and generate new items using AI
            </p>
          </div>
          
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
        </div>

        <Tabs defaultValue="destinations" className="w-full">
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="destinations">Destinations</TabsTrigger>
            <TabsTrigger value="tours">Tours</TabsTrigger>
            <TabsTrigger value="foods">Food</TabsTrigger>
            <TabsTrigger value="itineraries">Itineraries</TabsTrigger>
          </TabsList>
          
          <TabsContent value="destinations">
            <AdminDestinations />
          </TabsContent>
          
          <TabsContent value="tours">
            <AdminTours />
          </TabsContent>
          
          <TabsContent value="foods">
            <AdminFoods />
          </TabsContent>
          
          <TabsContent value="itineraries">
            <AdminItineraries />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
