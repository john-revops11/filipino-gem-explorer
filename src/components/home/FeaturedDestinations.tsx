
import { DestinationCard } from "./DestinationCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRef } from "react";

// Mock data for featured destinations
const featuredDestinations = [
  {
    id: "dest1",
    name: "Siargao Island",
    location: "Surigao del Norte",
    image: "https://images.unsplash.com/photo-1469041797191-50ace28483c3?auto=format&fit=crop&w=800&q=80",
    tags: ["Surfing", "Beach"],
  },
  {
    id: "dest2",
    name: "Chocolate Hills",
    location: "Bohol",
    image: "https://images.unsplash.com/photo-1485833077593-4278bba3f11f?auto=format&fit=crop&w=800&q=80",
    tags: ["Nature", "Landmark"],
  },
  {
    id: "dest3",
    name: "El Nido",
    location: "Palawan",
    image: "https://images.unsplash.com/photo-1501286353178-1ec881214838?auto=format&fit=crop&w=800&q=80",
    tags: ["Island Hopping", "Beach"],
  },
  {
    id: "dest4",
    name: "Mayon Volcano",
    location: "Albay",
    image: "https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=800&q=80",
    tags: ["Volcano", "Nature"],
  },
];

export function FeaturedDestinations() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

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
      
      <div 
        ref={scrollContainerRef}
        className="flex space-x-4 overflow-x-auto scrollbar-none pb-4"
      >
        {featuredDestinations.map((destination) => (
          <div key={destination.id} className="min-w-[280px]">
            <DestinationCard
              id={destination.id}
              name={destination.name}
              location={destination.location}
              image={destination.image}
              tags={destination.tags}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
