
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/services/firebase";
import { AuthProvider } from "@/hooks/use-auth";
import Index from "./pages/Index";
import Explore from "./pages/Explore";
import DestinationDetail from "./pages/DestinationDetail";
import Itineraries from "./pages/Itineraries";
import Bookings from "./pages/Bookings";
import BookingDetail from "./pages/BookingDetail";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/AdminDashboard";
import Login from "./pages/Login";
import AdminLogin from "./pages/AdminLogin";
import Signup from "./pages/Signup";
import ChatBot from "./components/ai/ChatBot";
import OnboardingContainer from "./components/onboarding/OnboardingContainer";

const App = () => {
  // Create a new QueryClient instance for each component instance
  const [queryClient] = useState(() => new QueryClient());
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check if onboarding is completed and set up auth state listener
  useEffect(() => {
    const onboardingStatus = localStorage.getItem("onboardingComplete");
    setIsOnboardingComplete(onboardingStatus === "true");
    
    // Set up auth state listener
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
      setIsCheckingAuth(false);
    });
    
    return () => unsubscribe();
  }, []);

  // Create sample accounts during development mode - moved outside conditional rendering
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      // This is just for demo purposes - in a real app, users would be created through proper registration
      console.log("Development mode: Sample accounts information:");
      console.log(" - Regular user: user@example.com / password123");
      console.log(" - Admin user: admin@example.com / admin123");
    }
  }, []);

  // Handle onboarding or direct login path
  const handleOnboardingComplete = () => {
    setIsOnboardingComplete(true);
  };

  // Determine what to show while checking auth state
  if (isCheckingAuth) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <BrowserRouter>
            <Toaster />
            <Sonner />
            <Routes>
              {!isOnboardingComplete ? (
                <>
                  <Route path="/" element={<OnboardingContainer onComplete={handleOnboardingComplete} />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </>
              ) : (
                <>
                  {/* Public routes - accessible to all */}
                  <Route path="/" element={<Index />} />
                  <Route path="/explore" element={<Explore />} />
                  <Route path="/destination/:id" element={<DestinationDetail />} />
                  <Route path="/itineraries" element={<Itineraries />} />
                  <Route path="/itinerary/:id" element={<DestinationDetail />} />
                  
                  {/* Login-protected routes */}
                  <Route path="/bookings" element={isLoggedIn ? <Bookings /> : <Navigate to="/login" state={{ from: "/bookings" }} />} />
                  <Route path="/booking/:id" element={isLoggedIn ? <BookingDetail /> : <Navigate to="/login" state={{ from: window.location.pathname }} />} />
                  <Route path="/profile" element={isLoggedIn ? <Profile /> : <Navigate to="/login" state={{ from: "/profile" }} />} />
                  <Route path="/admin" element={<AdminDashboard />} />
                  
                  {/* Authentication routes */}
                  <Route path="/login" element={isLoggedIn ? <Navigate to="/" replace /> : <Login />} />
                  <Route path="/signup" element={isLoggedIn ? <Navigate to="/" replace /> : <Signup />} />
                  <Route path="/admin/login" element={<AdminLogin />} />
                  
                  <Route path="*" element={<NotFound />} />
                </>
              )}
            </Routes>
            <ChatBot />
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
