
import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { FeaturedDestinations } from "@/components/home/FeaturedDestinations";
import { CategoriesSection } from "@/components/home/CategoriesSection";
import { HiddenGemsSection } from "@/components/home/HiddenGemsSection";
import { UpcomingEvents } from "@/components/home/UpcomingEvents";
import { LocalBusinessHighlight } from "@/components/home/LocalBusinessHighlight";
import OnboardingContainer from "@/components/onboarding/OnboardingContainer";

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
        <div className="filipino-pattern rounded-lg p-4 sm:p-6 mt-4 mb-6 overflow-hidden">
          <h1 className="text-xl sm:text-2xl font-bold mb-2 break-words text-contained">
            Discover the Philippines
          </h1>
          <p className="text-muted-foreground truncate-2 sm:truncate-3">
            Explore hidden gems and authentic local experiences
          </p>
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
