
import { Home, Map, Calendar, Bookmark, User, Shield } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { auth } from "@/services/firebase";
import { useState, useEffect } from "react";

export function BottomNav() {
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Check if user is admin
  useEffect(() => {
    const checkAdmin = () => {
      const user = auth.currentUser;
      if (user && (user.email === "admin@example.com" || user.uid === "system")) {
        setIsAdmin(true);
      }
    };
    
    checkAdmin();
    // Listen for auth state changes
    const unsubscribe = auth.onAuthStateChanged(checkAdmin);
    return () => unsubscribe();
  }, []);

  // Safely use router hooks
  let location;
  try {
    location = useLocation();
  } catch (e) {
    // Fallback when not in a router context
    location = { pathname: "/" };
    console.warn("BottomNav rendered outside Router context");
  }
  
  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Map, label: "Explore", path: "/explore" },
    { icon: Calendar, label: "Itineraries", path: "/itineraries" },
    { icon: Bookmark, label: "Bookings", path: "/bookings" },
    { icon: User, label: "Profile", path: "/profile" },
  ];

  // Add admin link if user is admin
  if (isAdmin) {
    navItems.push({ icon: Shield, label: "Admin", path: "/admin" });
  }

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
