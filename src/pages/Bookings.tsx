
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Bookmark } from "lucide-react";

export default function Bookings() {
  return (
    <div className="min-h-screen pb-16">
      <Header title="Bookings" />
      
      <div className="p-4">
        <div className="flex justify-center items-center flex-col py-12">
          <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
            <Bookmark className="h-12 w-12 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-medium mb-2">No Bookings Yet</h3>
          <p className="text-muted-foreground text-center mb-6">
            Your bookings for activities, accommodations, and experiences will appear here.
          </p>
          <Button className="bg-filipino-terracotta hover:bg-filipino-terracotta/90">
            Explore Activities
          </Button>
        </div>
      </div>
      
      <BottomNav />
    </div>
  );
}
