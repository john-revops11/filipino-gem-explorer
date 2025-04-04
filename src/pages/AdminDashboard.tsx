
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Layout } from "@/components/shared/Layout";
import { AdminDestinations } from "@/components/admin/AdminDestinations";
import { AdminTours } from "@/components/admin/AdminTours";
import { AdminFoods } from "@/components/admin/AdminFoods";
import { AdminItineraries } from "@/components/admin/AdminItineraries";
import { AdminPlaces } from "@/components/admin/AdminPlaces";
import { ContentGeneratorDialog } from "@/components/admin/ContentGeneratorDialog";
import { AdminAccessRestricted } from "@/components/admin/AdminAccessRestricted";
import { useAdminAuth } from "@/hooks/useAdminAuth";

export default function AdminDashboard() {
  const { isAdmin, isLoading } = useAdminAuth();

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
        <AdminAccessRestricted />
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
          
          <ContentGeneratorDialog />
        </div>

        <Tabs defaultValue="places" className="w-full">
          <TabsList className="grid grid-cols-5 mb-8">
            <TabsTrigger value="destinations">Destinations</TabsTrigger>
            <TabsTrigger value="places">Places</TabsTrigger>
            <TabsTrigger value="tours">Tours</TabsTrigger>
            <TabsTrigger value="foods">Food</TabsTrigger>
            <TabsTrigger value="itineraries">Itineraries</TabsTrigger>
          </TabsList>
          
          <TabsContent value="destinations">
            <AdminDestinations />
          </TabsContent>
          
          <TabsContent value="places">
            <AdminPlaces />
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
