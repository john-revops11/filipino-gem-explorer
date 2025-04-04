
import { Search, User } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type HeaderProps = {
  showSearch?: boolean;
  transparent?: boolean;
  title?: string;
};

export function Header({ showSearch = true, transparent = false, title }: HeaderProps) {
  return (
    <header 
      className={`sticky top-0 left-0 right-0 z-10 ${
        transparent 
          ? "bg-transparent" 
          : "bg-background"
      } py-4 px-4`}
    >
      <div className="flex items-center justify-between">
        {title ? (
          <h1 className="text-xl font-bold">{title}</h1>
        ) : (
          <Link to="/" className="flex items-center">
            <img 
              src="/lovable-uploads/0cc96d38-423d-462c-a3e7-8f0e3d4de6f3.png" 
              alt="Local Stopover Logo" 
              className="h-8" 
            />
          </Link>
        )}
        
        <Link to="/profile">
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <User className="h-5 w-5" />
          </Button>
        </Link>
      </div>
      
      {showSearch && (
        <div className="mt-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder="Search destinations, activities..." 
              className="pl-10"
            />
          </div>
        </div>
      )}
    </header>
  );
}
