
import { Button } from "@/components/ui/button";

const categories = [
  { id: "beaches", name: "Beaches", emoji: "🏖️" },
  { id: "mountains", name: "Mountains", emoji: "⛰️" },
  { id: "islands", name: "Islands", emoji: "🏝️" },
  { id: "cultural", name: "Cultural", emoji: "🏛️" },
  { id: "adventure", name: "Adventure", emoji: "🧗‍♀️" },
  { id: "food", name: "Food Trips", emoji: "🍲" },
  { id: "festivals", name: "Festivals", emoji: "🎭" },
  { id: "diving", name: "Diving", emoji: "🤿" },
];

export function CategoriesSection() {
  return (
    <section className="py-6">
      <h2 className="section-title mb-4">Explore by Category</h2>
      
      <div className="grid grid-cols-4 gap-3">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant="outline"
            className="h-auto flex flex-col py-3 border-border"
          >
            <span className="text-2xl mb-1">{category.emoji}</span>
            <span className="text-xs">{category.name}</span>
          </Button>
        ))}
      </div>
    </section>
  );
}
