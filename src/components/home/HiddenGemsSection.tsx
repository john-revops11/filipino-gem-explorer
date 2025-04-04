
import { useState, useEffect } from "react";
import { DestinationCard } from "./DestinationCard";
import databaseService, { Location } from "@/services/database-service";
import { toast } from "sonner";

export function HiddenGemsSection() {
  const [hiddenGems, setHiddenGems] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHiddenGems = async () => {
      try {
        setIsLoading(true);
        
        // Get all locations from the database
        const locations = await databaseService.getLocations();
        
        // For now, select 3 random locations as "hidden gems"
        // In a real app, these might have a "hidden gem" tag or classification
        const randomLocations = [...locations].sort(() => 0.5 - Math.random()).slice(0, 3);
        
        // Add a hidden gem tag to these locations
        const gemsWithTag = randomLocations.map(location => ({
          ...location,
          tags: [...(location.tags || []), "Hidden Gem"]
        }));
        
        setHiddenGems(gemsWithTag);
      } catch (error) {
        console.error("Error fetching hidden gems:", error);
        toast.error("Failed to load hidden gems", {
          description: "There was an error loading hidden gems. Please try again."
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchHiddenGems();
  }, []);

  return (
    <section className="py-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="section-title">Hidden Gems</h2>
        <a
          href="/hidden-gems"
          className="text-filipino-terracotta text-sm font-medium"
        >
          View all
        </a>
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-56 bg-gray-200 rounded-lg"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {hiddenGems.map((gem) => (
            <DestinationCard
              key={gem.id}
              id={gem.id || `gem-${gem.name}`}
              name={gem.name}
              location={gem.region}
              image={gem.image || "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80"}
              tags={gem.tags || []}
              isHiddenGem={true}
            />
          ))}
        </div>
      )}
    </section>
  );
}
