import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, CalendarDays, MapPin, DollarSign, 
  BarChart2, TrendingUp, ShoppingBag, Activity 
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import databaseService from "@/services/database-service";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Sample data for the charts (replace with real data)
const bookingData = [
  { name: 'Jan', bookings: 40 },
  { name: 'Feb', bookings: 30 },
  { name: 'Mar', bookings: 20 },
  { name: 'Apr', bookings: 27 },
  { name: 'May', bookings: 18 },
  { name: 'Jun', bookings: 23 },
  { name: 'Jul', bookings: 34 },
];

const revenueData = [
  { name: 'Jan', revenue: 4000 },
  { name: 'Feb', revenue: 3000 },
  { name: 'Mar', revenue: 2000 },
  { name: 'Apr', revenue: 2780 },
  { name: 'May', revenue: 1890 },
  { name: 'Jun', revenue: 2390 },
  { name: 'Jul', revenue: 3490 },
];

export function AdminOverview() {
  // Fetch data for the overview
  const { data: usersCount = 0, isLoading: isLoadingUsers } = useQuery({
    queryKey: ['usersCount'],
    queryFn: () => databaseService.getUsersCount(),
  });

  const { data: bookingsCount = 0, isLoading: isLoadingBookings } = useQuery({
    queryKey: ['bookingsCount'],
    queryFn: () => databaseService.getBookingsCount(),
  });

  const { data: destinationsCount = 0, isLoading: isLoadingDestinations } = useQuery({
    queryKey: ['destinationsCount'],
    queryFn: () => databaseService.getDestinationsCount(),
  });

  const { data: recentUsers = [], isLoading: isLoadingRecentUsers } = useQuery({
    queryKey: ['recentUsers'],
    queryFn: () => databaseService.getRecentUsers(),
  });

  const { data: recentBookings = [], isLoading: isLoadingRecentBookings } = useQuery({
    queryKey: ['recentBookings'],
    queryFn: () => databaseService.getRecentBookings(),
  });

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Dashboard Overview</h2>
      
      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoadingUsers ? '...' : usersCount}</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bookings This Month</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoadingBookings ? '...' : bookingsCount}</div>
            <p className="text-xs text-muted-foreground">+5% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Destinations</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoadingDestinations ? '...' : destinationsCount}</div>
            <p className="text-xs text-muted-foreground">+3 new this month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₱ 45,231.89</div>
            <p className="text-xs text-muted-foreground">+2.5% from last month</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Analytics charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Booking Analytics</CardTitle>
            <CardDescription>Number of bookings over time</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bookingData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="bookings" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Revenue Analytics</CardTitle>
            <CardDescription>Monthly revenue trends</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      
      {/* Recent activity */}
      <div className="mt-6">
        <Tabs defaultValue="users">
          <TabsList>
            <TabsTrigger value="users">Recent Users</TabsTrigger>
            <TabsTrigger value="bookings">Recent Bookings</TabsTrigger>
          </TabsList>
          <TabsContent value="users" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Latest User Registrations</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingRecentUsers ? (
                  <p>Loading recent users...</p>
                ) : recentUsers.length > 0 ? (
                  <div className="space-y-4">
                    {recentUsers.map((user: any) => (
                      <div key={user.id} className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                          {user.photoURL ? (
                            <img src={user.photoURL} alt={user.displayName} className="w-10 h-10 rounded-full" />
                          ) : (
                            <Users className="h-5 w-5 text-gray-500" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{user.displayName || 'Unnamed User'}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                        <div className="ml-auto text-sm text-muted-foreground">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No recent users found.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="bookings" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Latest Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingRecentBookings ? (
                  <p>Loading recent bookings...</p>
                ) : recentBookings.length > 0 ? (
                  <div className="space-y-4">
                    {recentBookings.map((booking: any) => (
                      <div key={booking.id} className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <CalendarDays className="h-5 w-5 text-gray-500" />
                        </div>
                        <div>
                          <p className="font-medium">{booking.destination?.name || 'Unknown Destination'}</p>
                          <p className="text-sm text-muted-foreground">
                            Booked by {booking.user?.displayName || 'Unknown User'}
                          </p>
                        </div>
                        <div className="ml-auto text-sm">
                          <div className="font-medium">₱ {booking.amount || '0.00'}</div>
                          <div className="text-muted-foreground">{new Date(booking.createdAt).toLocaleDateString()}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No recent bookings found.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Quick actions */}
      <div className="mt-6">
        <h3 className="text-lg font-medium mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
            <CardContent className="flex flex-col items-center justify-center py-6">
              <MapPin className="h-8 w-8 mb-2 text-filipino-teal" />
              <p className="text-sm font-medium">Add New Destination</p>
            </CardContent>
          </Card>
          
          <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
            <CardContent className="flex flex-col items-center justify-center py-6">
              <Users className="h-8 w-8 mb-2 text-filipino-teal" />
              <p className="text-sm font-medium">Manage Users</p>
            </CardContent>
          </Card>
          
          <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
            <CardContent className="flex flex-col items-center justify-center py-6">
              <CalendarDays className="h-8 w-8 mb-2 text-filipino-teal" />
              <p className="text-sm font-medium">View Bookings</p>
            </CardContent>
          </Card>
          
          <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
            <CardContent className="flex flex-col items-center justify-center py-6">
              <Activity className="h-8 w-8 mb-2 text-filipino-teal" />
              <p className="text-sm font-medium">Activity Reports</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
