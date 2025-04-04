
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bookmark, ExternalLink, Heart } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

type SavedItem = {
  id: string;
  type: 'destination' | 'itinerary';
  name: string;
  image: string;
  date: string;
};

type SavedItemsProps = {
  items: SavedItem[];
};

export const SavedItems = ({ items }: SavedItemsProps) => {
  const [savedItems, setSavedItems] = useState<SavedItem[]>(items);

  const removeItem = (id: string) => {
    setSavedItems(items => items.filter(item => item.id !== id));
    toast({
      title: "Item removed",
      description: "The item has been removed from your saved list.",
    });
  };

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
              <Link to={item.type === 'destination' ? `/destination/${item.id}` : `/itineraries`}>
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
};
