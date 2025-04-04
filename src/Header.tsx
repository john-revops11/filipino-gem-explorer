
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, Search, User, LogOut, Settings, Shield } from "lucide-react";
import { useMobile } from "@/hooks/use-mobile";
import { auth } from "@/services/firebase";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useMobile();
  const navigate = useNavigate();
  const [user, setUser] = useState(auth.currentUser);

  // Listen for auth state changes
  auth.onAuthStateChanged((user) => {
    setUser(user);
  });

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-background border-b py-4 md:py-2">
      <div className="container flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="flex items-center space-x-2">
            <img
              src="/placeholder.svg"
              alt="LocalStopover Logo"
              className="h-8 w-8"
            />
            <span className="font-bold text-lg hidden sm:inline-block text-filipino-deepTeal">
              LocalStopover
            </span>
          </Link>
        </div>

        {!isMobile && (
          <nav className="hidden md:flex items-center space-x-4 mx-4">
            <Link to="/" className="text-base font-medium">
              Home
            </Link>
            <Link to="/explore" className="text-base font-medium">
              Explore
            </Link>
            <Link to="/itineraries" className="text-base font-medium">
              Itineraries
            </Link>
            <Link to="/bookings" className="text-base font-medium">
              Bookings
            </Link>
          </nav>
        )}

        <div className="flex items-center space-x-2">
          {!isMobile && (
            <Button
              variant="outline"
              size="sm"
              className="hidden md:flex"
              onClick={() => navigate("/explore")}
            >
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          )}

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/profile")}>
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/itineraries")}>
                  Saved Itineraries
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/bookings")}>
                  My Bookings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/settings")}>
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </DropdownMenuItem>
                
                {/* Admin link - only show for admin emails */}
                {user.email === "admin@example.com" && (
                  <DropdownMenuItem onClick={() => navigate("/admin")}>
                    <Shield className="h-4 w-4 mr-2" />
                    Admin Dashboard
                  </DropdownMenuItem>
                )}
                
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="default" size="sm" onClick={() => navigate("/login")}>
              Sign In
            </Button>
          )}

          {isMobile && (
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden text-foreground"
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader className="mb-4">
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col space-y-4">
                  <Link to="/" className="px-1 py-2 hover:underline text-lg" onClick={() => setIsOpen(false)}>
                    Home
                  </Link>
                  <Link to="/explore" className="px-1 py-2 hover:underline text-lg" onClick={() => setIsOpen(false)}>
                    Explore
                  </Link>
                  <Link to="/itineraries" className="px-1 py-2 hover:underline text-lg" onClick={() => setIsOpen(false)}>
                    Itineraries
                  </Link>
                  <Link to="/bookings" className="px-1 py-2 hover:underline text-lg" onClick={() => setIsOpen(false)}>
                    Bookings
                  </Link>
                  <Link to="/profile" className="px-1 py-2 hover:underline text-lg" onClick={() => setIsOpen(false)}>
                    Profile
                  </Link>
                  
                  {/* Admin link for mobile menu - only show for admin emails */}
                  {user && user.email === "admin@example.com" && (
                    <Link to="/admin" className="px-1 py-2 hover:underline text-lg" onClick={() => setIsOpen(false)}>
                      Admin Dashboard
                    </Link>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
