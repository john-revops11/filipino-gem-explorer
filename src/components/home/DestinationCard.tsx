
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

type DestinationCardProps = {
  id: string;
  name: string;
  location: string;
  image: string;
  tags?: string[];
  isHiddenGem?: boolean;
  size?: "sm" | "md" | "lg";
  linkTo?: string;
};

export function DestinationCard({
  id,
  name,
  location,
  image,
  tags = [],
  isHiddenGem = false,
  size = "md",
  linkTo,
}: DestinationCardProps) {
  const sizeClasses = {
    sm: "h-40",
    md: "h-56",
    lg: "h-72",
  };

  const content = (
    <div className={`destination-card ${sizeClasses[size]}`}>
      <img
        src={image || "/placeholder.svg"}
        alt={name}
        className="w-full h-full object-cover"
      />
      <div className="gradient-overlay" />
      
      <div className="absolute bottom-0 left-0 p-4 text-white">
        <h3 className="font-bold text-lg">{name}</h3>
        <p className="text-sm text-white/80">{location}</p>
        
        {isHiddenGem && (
          <Badge className="mt-2 bg-filipino-teal text-white">
            Hidden Gem
          </Badge>
        )}
        
        {tags.length > 0 && size !== "sm" && (
          <div className="flex mt-2 flex-wrap gap-1">
            {tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="bg-white/20 text-white text-xs"
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  // Only use Link if we're inside a Router context
  if (linkTo || id) {
    const destination = linkTo || `/destination/${id}`;
    return <Link to={destination} className="block">{content}</Link>;
  }

  // Fallback without link when not in a Router context
  return <div className="block">{content}</div>;
}
