
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Layout } from "@/components/shared/Layout";
import { AdminDestinations } from "@/components/admin/AdminDestinations";
import { AdminTours } from "@/components/admin/AdminTours";
import { AdminFoods } from "@/components/admin/AdminFoods";
import { AdminItineraries } from "@/components/admin/AdminItineraries";
import { auth } from "@/services/firebase";
import { useNavigate } from "react-router-dom";
import { Shield } from "lucide-react";

export default function AdminDashboard() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Basic admin check - in a real app, use proper role-based auth
    const checkAdmin = async () => {
      setIsLoading(true);
      const user = auth.currentUser;
      
      // Simple admin check based on email - replace with proper role check
      // In production, this should be done with custom claims or a roles table
      if (user && (user.email === "admin@example.com" || user.uid === "system")) {
        setIsAdmin(true);
      } else {
        // Redirect non-admins to home
        navigate("/");
      }
      setIsLoading(false);
    };

    checkAdmin();
  }, [navigate]);

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-[70vh]">
          <div className="animate-spin h-8 w-8 border-4 border-filipino-teal border-t-transparent rounded-full"></div>
        </div>
      </Layout>
    );
  }

  if (!isAdmin) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-[70vh] text-center p-4">
          <Shield className="h-16 w-16 text-filipino-terracotta mb-4" />
          <h1 className="text-2xl font-bold mb-2">Admin Access Required</h1>
          <p className="text-muted-foreground">
            You don't have permission to access this area.
          </p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-filipino-deepTeal">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Manage content and generate new items using AI
            </p>
          </div>
        </div>

        <Tabs defaultValue="destinations" className="w-full">
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="destinations">Destinations</TabsTrigger>
            <TabsTrigger value="tours">Tours</TabsTrigger>
            <TabsTrigger value="foods">Food</TabsTrigger>
            <TabsTrigger value="itineraries">Itineraries</TabsTrigger>
          </TabsList>
          
          <TabsContent value="destinations">
            <AdminDestinations />
          </TabsContent>
          
          <TabsContent value="tours">
            <AdminTours />
          </TabsContent>
          
          <TabsContent value="foods">
            <AdminFoods />
          </TabsContent>
          
          <TabsContent value="itineraries">
            <AdminItineraries />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
