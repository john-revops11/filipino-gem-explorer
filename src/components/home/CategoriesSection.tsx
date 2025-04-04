
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const categories = [
  { id: "beaches", name: "Beaches", emoji: "🏖️", color: "bg-filipino-teal" },
  { id: "mountains", name: "Mountains", emoji: "⛰️", color: "bg-filipino-forest" },
  { id: "islands", name: "Islands", emoji: "🏝️", color: "bg-filipino-purple" },
  { id: "cultural", name: "Cultural", emoji: "🏛️", color: "bg-filipino-navy" },
  { id: "adventure", name: "Adventure", emoji: "🧗‍♀️", color: "bg-filipino-coral" },
  { id: "food", name: "Food Trips", emoji: "🍲", color: "bg-filipino-yellow" },
  { id: "festivals", name: "Festivals", emoji: "🎭", color: "bg-filipino-pink" },
  { id: "diving", name: "Diving", emoji: "🤿", color: "bg-filipino-orange" },
];

export function CategoriesSection() {
  return (
    <section className="py-6">
      <h2 className="text-xl font-bold mb-4">Explore by Category</h2>
      
      <div className="grid grid-cols-4 gap-3">
        {categories.map((category) => (
          <Link 
            key={category.id} 
            to={`/explore?category=${category.id}`}
            className="block"
          >
            <Button
              variant="outline"
              className={`h-auto w-full flex flex-col py-3 border-border hover:${category.color} hover:text-white transition-colors duration-300`}
            >
              <span className="text-2xl mb-1">{category.emoji}</span>
              <span className="text-xs font-medium">{category.name}</span>
            </Button>
          </Link>
        ))}
      </div>
    </section>
  );
}
