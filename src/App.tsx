
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Explore from "./pages/Explore";
import DestinationDetail from "./pages/DestinationDetail";
import Itineraries from "./pages/Itineraries";
import Bookings from "./pages/Bookings";
import BookingDetail from "./pages/BookingDetail";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import { useState } from "react";

const App = () => {
  // Create a new QueryClient instance for each component instance
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/destination/:id" element={<DestinationDetail />} />
            <Route path="/itineraries" element={<Itineraries />} />
            <Route path="/bookings" element={<Bookings />} />
            <Route path="/booking/:id" element={<BookingDetail />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
