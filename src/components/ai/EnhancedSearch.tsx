
import { useState, useRef, useEffect } from "react";
import { SearchIcon, Loader2, MapPin, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { AuthPrompt } from "@/components/auth/AuthPrompt";

export default function EnhancedSearch() {
  const { user } = useAuth();
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (query.trim().startsWith("@") && !user) {
      // Advanced AI search requires login
      setShowAuthPrompt(true);
      return;
    }
    
    // Proceed with search
    setIsLoading(true);
    console.log("Searching for:", query);
    
    // Simulate search completion
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  return (
    <>
      <form onSubmit={handleSearch} className="relative w-full">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            ref={inputRef}
            placeholder="Search destinations, activities..."
            className="pl-10 pr-14 h-12 bg-white"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query.startsWith("@") && (
            <div className="absolute right-14 top-1/2 -translate-y-1/2">
              <Sparkles className="h-4 w-4 text-filipino-goldenrod" />
            </div>
          )}
          <Button
            type="submit"
            size="sm"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-10"
            disabled={isLoading || !query.trim()}
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
          </Button>
        </div>
        
        {query.startsWith("@") && (
          <div className="mt-1 text-xs text-muted-foreground flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-filipino-goldenrod" />
            <span>AI-powered search enabled. Try "@beach activities in Palawan"</span>
          </div>
        )}
      </form>
      
      <AuthPrompt
        isOpen={showAuthPrompt}
        onClose={() => setShowAuthPrompt(false)}
        title="Login Required for AI Search"
        description="You need to be logged in to use our advanced AI-powered search features."
        action="Log in to continue"
      />
    </>
  );
}
