
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Building, Hotel, MapPin, Gem, Store } from "lucide-react";
import { Place } from "@/services/database-service";

type PlaceCardProps = {
  id: string;
  name: string;
  type?: string; // Made optional to match the updated Place type
  location: string;
  image: string;
  tags?: string[];
  price_range?: string;
  size?: "sm" | "md" | "lg";
  linkTo?: string;
  is_hidden_gem?: boolean;
  is_local_business?: boolean;
};

export function PlaceCard({
  id,
  name,
  type,
  location,
  image,
  tags = [],
  price_range,
  size = "md",
  linkTo,
  is_hidden_gem,
  is_local_business,
}: PlaceCardProps) {
  const sizeClasses = {
    sm: "h-40",
    md: "h-56",
    lg: "h-72",
  };

  const getIcon = () => {
    if (!type) return <Building className="h-4 w-4 text-white" />;
    
    switch (type) {
      case "hotel":
        return <Hotel className="h-4 w-4 text-white" />;
      case "resort":
        return <Building className="h-4 w-4 text-white" />;
      case "tourist_spot":
        return <MapPin className="h-4 w-4 text-white" />;
      default:
        return <Building className="h-4 w-4 text-white" />;
    }
  };

  const content = (
    <div className={`place-card relative rounded-lg overflow-hidden ${sizeClasses[size]}`}>
      <img
        src={image || "/placeholder.svg"}
        alt={name}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
      
      <div className="absolute top-2 left-2 flex flex-col gap-1 max-w-[90%]">
        {type && (
          <Badge className="bg-filipino-teal/70 text-white flex items-center gap-1 uppercase text-xs truncate">
            {getIcon()}
            <span className="truncate">{type.replace("_", " ")}</span>
          </Badge>
        )}
        
        {is_hidden_gem && (
          <Badge className="bg-filipino-vibrantGreen/70 text-white flex items-center gap-1 uppercase text-xs truncate">
            <Gem className="h-4 w-4 text-white flex-shrink-0" />
            <span className="truncate">Hidden Gem</span>
          </Badge>
        )}
        
        {is_local_business && (
          <Badge className="bg-filipino-terracotta/70 text-white flex items-center gap-1 uppercase text-xs truncate">
            <Store className="h-4 w-4 text-white flex-shrink-0" />
            <span className="truncate">Local Business</span>
          </Badge>
        )}
      </div>
      
      <div className="absolute bottom-0 left-0 p-4 text-white w-full">
        <h3 className="font-bold text-lg line-clamp-1 break-words">{name}</h3>
        <p className="text-sm text-white/80 mb-2 line-clamp-1">{location}</p>
        
        {price_range && (
          <Badge variant="outline" className="border-white/40 text-white text-xs truncate max-w-[90%]">
            {price_range}
          </Badge>
        )}
        
        {tags.length > 0 && size !== "sm" && (
          <div className="flex mt-2 flex-wrap gap-1 max-w-full">
            {tags.slice(0, 3).map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="bg-white/20 text-white text-xs truncate max-w-[100px]"
              >
                {tag}
              </Badge>
            ))}
            {tags.length > 3 && (
              <Badge variant="secondary" className="bg-white/20 text-white text-xs">
                +{tags.length - 3}
              </Badge>
            )}
          </div>
        )}
      </div>
    </div>
  );

  // Only use Link if we're inside a Router context
  if (linkTo || id) {
    const destination = linkTo || `/place/${id}`;
    return <Link to={destination} className="block">{content}</Link>;
  }

  // Fallback without link when not in a Router context
  return <div className="block">{content}</div>;
}
