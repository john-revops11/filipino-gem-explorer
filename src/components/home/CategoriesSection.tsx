
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const categories = [
  { 
    id: "beaches", 
    name: "Beaches", 
    emoji: "🌊", 
    description: "Explore pristine white sand beaches",
    color: "bg-filipino-teal",
    hoverColor: "hover:bg-filipino-teal" 
  },
  { 
    id: "mountains", 
    name: "Mountains", 
    emoji: "🌋", 
    description: "Discover majestic volcanoes and highlands",
    color: "bg-filipino-forest",
    hoverColor: "hover:bg-filipino-forest" 
  },
  { 
    id: "islands", 
    name: "Islands", 
    emoji: "🏝️", 
    description: "Visit stunning tropical islands",
    color: "bg-filipino-vibrantBlue",
    hoverColor: "hover:bg-filipino-vibrantBlue" 
  },
  { 
    id: "cultural", 
    name: "Cultural", 
    emoji: "🪅", 
    description: "Experience authentic Filipino traditions",
    color: "bg-filipino-warmOchre",
    hoverColor: "hover:bg-filipino-warmOchre" 
  },
  { 
    id: "adventure", 
    name: "Adventure", 
    emoji: "🚣‍♀️", 
    description: "Embark on thrilling outdoor activities",
    color: "bg-filipino-coral",
    hoverColor: "hover:bg-filipino-coral" 
  },
  { 
    id: "food", 
    name: "Filipino Cuisine", 
    emoji: "🥘", 
    description: "Savor authentic local delicacies",
    color: "bg-filipino-vibrantRed",
    hoverColor: "hover:bg-filipino-vibrantRed" 
  },
  { 
    id: "festivals", 
    name: "Festivals", 
    emoji: "🎭", 
    description: "Join colorful local celebrations",
    color: "bg-filipino-vibrantGreen",
    hoverColor: "hover:bg-filipino-vibrantGreen" 
  },
  { 
    id: "diving", 
    name: "Diving", 
    emoji: "🐠", 
    description: "Explore vibrant underwater ecosystems",
    color: "bg-filipino-vibrantBlue",
    hoverColor: "hover:bg-filipino-vibrantBlue" 
  },
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
              className={`h-auto w-full flex flex-col py-3 border-filipino-warmOchre/20 ${category.hoverColor} hover:text-white transition-colors duration-300`}
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
