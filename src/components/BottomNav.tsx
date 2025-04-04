
import { Home, Map, Calendar, Bookmark, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export function BottomNav() {
  const location = useLocation();
  
  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Map, label: "Explore", path: "/explore" },
    { icon: Calendar, label: "Itineraries", path: "/itineraries" },
    { icon: Bookmark, label: "Bookings", path: "/bookings" },
    { icon: User, label: "Profile", path: "/profile" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 border-t bg-card z-10 pb-safe">
      <nav className="flex items-center justify-between px-4">
        {navItems.map((item) => {
          const isActive = item.path === location.pathname;
          return (
            <Link
              key={item.label}
              to={item.path}
              className={`flex flex-col items-center justify-center py-2 px-3 ${
                isActive 
                  ? "text-filipino-terracotta" 
                  : "text-muted-foreground"
              }`}
            >
              <item.icon className="h-6 w-6 mb-1" />
              <span className="text-xs">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
