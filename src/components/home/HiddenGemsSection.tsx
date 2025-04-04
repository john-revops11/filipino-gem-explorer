
import { DestinationCard } from "./DestinationCard";

// Mock data for hidden gems
const hiddenGems = [
  {
    id: "gem1",
    name: "Batad Rice Terraces",
    location: "Ifugao",
    image: "https://images.unsplash.com/photo-1518877593221-1f28583780b4?auto=format&fit=crop&w=800&q=80",
    tags: ["Nature", "Cultural Heritage"],
  },
  {
    id: "gem2",
    name: "Kalanggaman Island",
    location: "Leyte",
    image: "https://images.unsplash.com/photo-1465379944081-7f47de8d74ac?auto=format&fit=crop&w=800&q=80",
    tags: ["Beach", "Island"],
  },
  {
    id: "gem3",
    name: "Cambulo Village",
    location: "Mountain Province",
    image: "https://images.unsplash.com/photo-1439886183900-e79ec0057170?auto=format&fit=crop&w=800&q=80",
    tags: ["Cultural", "Trekking"],
  },
];

export function HiddenGemsSection() {
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
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {hiddenGems.map((gem) => (
          <DestinationCard
            key={gem.id}
            id={gem.id}
            name={gem.name}
            location={gem.location}
            image={gem.image}
            tags={gem.tags}
            isHiddenGem={true}
          />
        ))}
      </div>
    </section>
  );
}
