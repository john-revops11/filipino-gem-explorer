
import { useState, useRef, useEffect } from "react";
import { DestinationCard } from "./DestinationCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import databaseService, { Location } from "@/services/database-service";
import { toast } from "sonner";

export function FeaturedDestinations() {
  const [destinations, setDestinations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        setIsLoading(true);
        // First try to get locations from the database
        let locations = await databaseService.getLocations();
        
        // If there are no locations, generate initial data
        if (locations.length === 0) {
          await databaseService.generateInitialData();
          locations = await databaseService.getLocations();
        }
        
        // Filter for featured destinations (could be based on a featured flag, popularity, etc.)
        // For now, just take the first 4 locations
        const featuredLocations = locations.slice(0, 4);
        setDestinations(featuredLocations);
      } catch (error) {
        console.error("Error fetching destinations:", error);
        toast.error("Failed to load destinations", {
          description: "There was an error loading featured destinations. Please try again."
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDestinations();
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const { current } = scrollContainerRef;
      const scrollAmount = 300;
      
      if (direction === "left") {
        current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
      } else {
        current.scrollBy({ left: scrollAmount, behavior: "smooth" });
      }
    }
  };

  return (
    <section className="py-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="section-title">Featured Destinations</h2>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-full"
            onClick={() => scroll("left")}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-full"
            onClick={() => scroll("right")}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex space-x-4 overflow-x-auto scrollbar-none pb-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="min-w-[280px] animate-pulse">
              <div className="h-56 bg-gray-200 rounded-lg"></div>
            </div>
          ))}
        </div>
      ) : (
        <div 
          ref={scrollContainerRef}
          className="flex space-x-4 overflow-x-auto scrollbar-none pb-4"
        >
          {destinations.map((destination) => (
            <div key={destination.id} className="min-w-[280px]">
              <DestinationCard
                id={destination.id || `dest-${destination.name}`}
                name={destination.name}
                location={destination.region}
                image={destination.image || "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80"}
                tags={destination.tags || []}
              />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
