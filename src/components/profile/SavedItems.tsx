
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bookmark, ExternalLink, Heart, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import databaseService, { Itinerary, Location } from "@/services/database-service";

interface SavedItem {
  id: string;
  type: 'destination' | 'itinerary';
  name: string;
  image: string;
  date: string;
}

interface SavedItemsProps {
  userId?: string;
}

export const SavedItems = ({ userId }: SavedItemsProps) => {
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSavedItems = async () => {
      if (!userId) {
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        
        // Fetch user itineraries
        const itineraries = await databaseService.getUserItineraries(userId);
        
        // Convert to saved items format
        const itineraryItems: SavedItem[] = itineraries.map(itinerary => ({
          id: itinerary.id || '',
          type: 'itinerary',
          name: itinerary.name,
          image: itinerary.image || "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80",
          date: itinerary.created_at ? new Date(itinerary.created_at).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
          }) : 'Unknown date'
        }));
        
        // For now, we'll assume all locations are saved
        // In a real app, you'd have a separate table for saved locations
        const locations = await databaseService.getLocations();
        const locationItems: SavedItem[] = locations.slice(0, 2).map(location => ({
          id: location.id || '',
          type: 'destination',
          name: location.name,
          image: location.image || "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80",
          date: 'Saved recently'
        }));
        
        setSavedItems([...itineraryItems, ...locationItems]);
      } catch (error) {
        console.error("Error fetching saved items:", error);
        toast.error("Failed to load saved items", {
          description: "There was an error loading your saved items. Please try again."
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSavedItems();
  }, [userId]);

  const removeItem = (id: string) => {
    setSavedItems(items => items.filter(item => item.id !== id));
    toast({
      title: "Item removed",
      description: "The item has been removed from your saved list.",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-40">
        <Loader2 className="h-8 w-8 animate-spin text-filipino-teal" />
      </div>
    );
  }

  if (savedItems.length === 0) {
    return (
      <div className="flex items-center justify-center h-40 text-center">
        <div>
          <Bookmark className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
          <p className="text-muted-foreground">You haven't saved any items yet.</p>
          <Link to="/explore">
            <Button className="mt-4 bg-filipino-terracotta">Start Exploring</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 mt-4">
      {savedItems.map((item) => (
        <div key={item.id} className="flex rounded-lg overflow-hidden border border-border">
          <div className="w-1/3">
            <img 
              src={item.image} 
              alt={item.name} 
              className="h-full w-full object-cover"
            />
          </div>
          <div className="w-2/3 p-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center">
                <Badge className="mr-2" style={{ backgroundColor: item.type === 'destination' ? 'var(--filipino-teal)' : 'var(--filipino-yellow)' }}>
                  {item.type === 'destination' ? 'Destination' : 'Itinerary'}
                </Badge>
              </div>
              <h3 className="font-semibold mt-1">{item.name}</h3>
              <p className="text-xs text-muted-foreground mt-1">{item.date}</p>
            </div>
            <div className="flex justify-between">
              <Link to={item.type === 'destination' ? `/destination/${item.id}` : `/itineraries/${item.id}`}>
                <Button variant="outline" size="sm" className="h-8">
                  <ExternalLink className="h-4 w-4 mr-1" />
                  View
                </Button>
              </Link>
              <Button variant="ghost" size="sm" className="h-8" onClick={() => removeItem(item.id)}>
                <Heart className="h-4 w-4 mr-1 fill-filipino-terracotta text-filipino-terracotta" />
                Remove
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
