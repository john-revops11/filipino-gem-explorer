
import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { FeaturedDestinations } from "@/components/home/FeaturedDestinations";
import { CategoriesSection } from "@/components/home/CategoriesSection";
import { HiddenGemsSection } from "@/components/home/HiddenGemsSection";
import { UpcomingEvents } from "@/components/home/UpcomingEvents";
import { LocalBusinessHighlight } from "@/components/home/LocalBusinessHighlight";
import OnboardingContainer from "@/components/onboarding/OnboardingContainer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Shield } from "lucide-react";

const Index = () => {
  const [showOnboarding, setShowOnboarding] = useState(true);
  
  useEffect(() => {
    // Check if user has completed onboarding
    const onboardingComplete = localStorage.getItem("onboardingComplete");
    if (onboardingComplete === "true") {
      setShowOnboarding(false);
    }
  }, []);
  
  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
  };
  
  if (showOnboarding) {
    return <OnboardingContainer onComplete={handleOnboardingComplete} />;
  }
  
  return (
    <div className="min-h-screen pb-16">
      <Header />
      
      <div className="px-4">
        <div className="filipino-pattern rounded-lg p-6 mt-4 mb-6">
          <h1 className="text-2xl font-bold mb-2">Discover the Philippines</h1>
          <p className="text-muted-foreground">
            Explore hidden gems and authentic local experiences
          </p>
          
          {/* Development quick access - remove in production */}
          <div className="mt-4">
            <Link to="/admin">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Admin Dashboard
              </Button>
            </Link>
          </div>
        </div>
        
        <FeaturedDestinations />
        <CategoriesSection />
        <HiddenGemsSection />
        <LocalBusinessHighlight />
        <UpcomingEvents />
      </div>
      
      <BottomNav />
    </div>
  );
};

export default Index;
