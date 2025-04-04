
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Plus, Calendar } from "lucide-react";

export default function Itineraries() {
  return (
    <div className="min-h-screen pb-16">
      <Header title="Itineraries" />
      
      <div className="p-4">
        <Button className="w-full mb-6 bg-filipino-terracotta hover:bg-filipino-terracotta/90">
          <Plus className="h-4 w-4 mr-2" />
          Create New Itinerary
        </Button>
        
        <div className="flex justify-center items-center flex-col py-12">
          <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
            <Calendar className="h-12 w-12 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-medium mb-2">No Itineraries Yet</h3>
          <p className="text-muted-foreground text-center mb-6">
            Start planning your adventure in the Philippines by creating your first itinerary.
          </p>
          <Button className="bg-filipino-terracotta hover:bg-filipino-terracotta/90">
            <Plus className="h-4 w-4 mr-2" />
            Create Your First Itinerary
          </Button>
        </div>
      </div>
      
      <BottomNav />
    </div>
  );
}
