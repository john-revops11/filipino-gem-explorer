
import { useState, useEffect } from "react";
import { Search, X, Filter, MapPin, Calendar } from "lucide-react";
import { enhancedSearch } from "@/services/ai-search";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

type SearchResult = {
  id: string;
  name: string;
  location: string;
  image: string;
  type: "destination" | "activity" | "business";
  relevanceScore: number;
  description: string;
  tags: string[];
};

export default function EnhancedSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [noResults, setNoResults] = useState(false);

  // Search suggestions based on user input
  const getSuggestions = (input: string): string[] => {
    if (!input || input.length < 2) return [];
    
    const suggestions = [
      "beaches in Palawan",
      "best diving spots",
      "mountain hiking trails",
      "cultural experiences",
      "food tours in Manila",
      "island hopping in Cebu",
      "surfing in Siargao",
      "historical sites",
      "Chocolate Hills in Bohol",
      "UNESCO heritage sites"
    ];
    
    return suggestions.filter(suggestion => 
      suggestion.toLowerCase().includes(input.toLowerCase())
    ).slice(0, 4);
  };
  
  const suggestions = getSuggestions(query);

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setShowResults(false);
      return;
    }
    
    setIsLoading(true);
    setShowResults(true);
    setNoResults(false);
    
    try {
      const searchResults = await enhancedSearch(searchQuery);
      setResults(searchResults);
      setNoResults(searchResults.length === 0);
      
      // Log the search for personalization purposes
      console.log("Search query logged:", searchQuery);
    } catch (error) {
      console.error("Search error:", error);
      toast({
        title: "Search Error",
        description: "Unable to complete your search. Please try again.",
        variant: "destructive"
      });
      setResults([]);
      setNoResults(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    performSearch(query);
  };
  
  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    performSearch(suggestion);
  };
  
  const handleClear = () => {
    setQuery("");
    setShowResults(false);
  };
  
  const getResultLink = (result: SearchResult) => {
    switch (result.type) {
      case "destination":
        return `/destination/${result.id}`;
      case "activity":
        return `/bookings?activity=${result.id}`;
      case "business":
        return `/business/${result.id}`;
      default:
        return "#";
    }
  };
  
  const getTypeLabel = (type: SearchResult["type"]) => {
    switch (type) {
      case "destination":
        return <Badge className="bg-filipino-teal">Destination</Badge>;
      case "activity":
        return <Badge className="bg-filipino-terracotta">Activity</Badge>;
      case "business":
        return <Badge className="bg-filipino-warmOchre">Local Business</Badge>;
      default:
        return null;
    }
  };

  useEffect(() => {
    // Add event listener to handle closing search results when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const searchContainer = document.getElementById("enhanced-search-container");
      
      if (searchContainer && !searchContainer.contains(target)) {
        setShowResults(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div id="enhanced-search-container" className="relative w-full max-w-lg mx-auto">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search destinations, activities, or ask a question..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="w-full pl-10 pr-12 py-2 rounded-full border border-input bg-background"
        />
        {query && (
          <button 
            onClick={handleClear}
            className="absolute right-12 top-1/2 -translate-y-1/2 text-muted-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        <button 
          onClick={handleSearch}
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-filipino-teal text-white p-1 rounded-full"
        >
          <Search className="h-3 w-3" />
        </button>
      </div>
      
      {/* Search suggestions */}
      {suggestions.length > 0 && query && !showResults && (
        <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg border animate-in fade-in-50 slide-in-from-top-5">
          <div className="p-2">
            <p className="text-xs text-muted-foreground px-2 pb-1">Suggestions</p>
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                className="block w-full text-left px-3 py-2 rounded hover:bg-muted text-sm"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                <Search className="inline h-3 w-3 mr-2 text-muted-foreground" />
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Search results */}
      {showResults && (
        <div className="absolute z-50 w-full mt-1 bg-white rounded-md shadow-xl border max-h-[80vh] overflow-auto animate-in fade-in-50 slide-in-from-top-5">
          <div className="sticky top-0 bg-white p-3 border-b z-10 flex justify-between items-center">
            <p className="font-medium">Search Results</p>
            <Button variant="ghost" size="icon" onClick={() => setShowResults(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {isLoading ? (
            <div className="p-4 space-y-4">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <Skeleton className="h-16 w-16 rounded" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/4" />
                    <Skeleton className="h-3 w-5/6" />
                  </div>
                </div>
              ))}
            </div>
          ) : noResults ? (
            <div className="p-6 text-center">
              <div className="inline-flex rounded-full bg-muted p-3 mb-3">
                <Search className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="font-medium mb-1">No results found</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Try different keywords or browse popular destinations below
              </p>
              <Link to="/explore">
                <Button className="bg-filipino-terracotta hover:bg-filipino-terracotta/90">
                  Browse Destinations
                </Button>
              </Link>
            </div>
          ) : (
            <div className="p-2">
              {results.map((result) => (
                <Link 
                  key={result.id} 
                  to={getResultLink(result)}
                  className="block p-2 hover:bg-muted/50 rounded-md"
                  onClick={() => setShowResults(false)}
                >
                  <div className="flex items-start space-x-3">
                    <div className="h-16 w-16 rounded overflow-hidden flex-shrink-0">
                      <img 
                        src={result.image} 
                        alt={result.name} 
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium">{result.name}</h3>
                        {getTypeLabel(result.type)}
                      </div>
                      <p className="text-xs text-muted-foreground flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        {result.location}
                      </p>
                      <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
                        {result.description}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {result.tags.slice(0, 2).map((tag, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {result.tags.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{result.tags.length - 2} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
