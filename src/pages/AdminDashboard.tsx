
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Layout } from "@/components/shared/Layout";
import { AdminAccessRestricted } from "@/components/admin/AdminAccessRestricted";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { AdminOverview } from "@/components/admin/AdminOverview";
import { AdminDestinations } from "@/components/admin/AdminDestinations";
import { AdminPlaces } from "@/components/admin/AdminPlaces";
import { AdminTours } from "@/components/admin/AdminTours";
import { AdminFoods } from "@/components/admin/AdminFoods";
import { AdminItineraries } from "@/components/admin/AdminItineraries";
import { AdminUsers } from "@/components/admin/AdminUsers";
import { AdminBookings } from "@/components/admin/AdminBookings";
import { AdminSettings } from "@/components/admin/AdminSettings";
import { AdminEvents } from "@/components/admin/AdminEvents";
import { AdminHiddenGems } from "@/components/admin/AdminHiddenGems";
import { AdminBusinesses } from "@/components/admin/AdminBusinesses";
import { ContentGeneratorDialog } from "@/components/admin/ContentGeneratorDialog";

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
              Manage content and monitor site performance
            </p>
          </div>
          
          <ContentGeneratorDialog />
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="mb-8 flex flex-wrap justify-start overflow-x-auto">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="destinations">Destinations</TabsTrigger>
            <TabsTrigger value="places">Places</TabsTrigger>
            <TabsTrigger value="hidden-gems">Hidden Gems</TabsTrigger>
            <TabsTrigger value="businesses">Local Businesses</TabsTrigger>
            <TabsTrigger value="tours">Tours</TabsTrigger>
            <TabsTrigger value="foods">Food</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="itineraries">Itineraries</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <AdminOverview />
          </TabsContent>
          
          <TabsContent value="destinations">
            <AdminDestinations />
          </TabsContent>
          
          <TabsContent value="places">
            <AdminPlaces />
          </TabsContent>
          
          <TabsContent value="hidden-gems">
            <AdminHiddenGems />
          </TabsContent>
          
          <TabsContent value="businesses">
            <AdminBusinesses />
          </TabsContent>
          
          <TabsContent value="tours">
            <AdminTours />
          </TabsContent>
          
          <TabsContent value="foods">
            <AdminFoods />
          </TabsContent>
          
          <TabsContent value="events">
            <AdminEvents />
          </TabsContent>
          
          <TabsContent value="itineraries">
            <AdminItineraries />
          </TabsContent>
          
          <TabsContent value="users">
            <AdminUsers />
          </TabsContent>
          
          <TabsContent value="bookings">
            <AdminBookings />
          </TabsContent>
          
          <TabsContent value="settings">
            <AdminSettings />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
