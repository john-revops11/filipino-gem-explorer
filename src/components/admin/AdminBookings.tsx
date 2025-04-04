
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import databaseService from "@/services/database-service";
import { toast } from "sonner";
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, MoreHorizontal, Search, Eye, 
  CheckCircle, XCircle, Printer, FileText 
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function AdminBookings() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const queryClient = useQueryClient();
  
  // Fetch bookings
  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ['admin', 'bookings'],
    queryFn: () => databaseService.getAllBookings(),
  });
  
  // Update booking status mutation
  const updateBookingStatusMutation = useMutation({
    mutationFn: ({ bookingId, status }: { bookingId: string; status: string }) => 
      databaseService.updateBookingStatus(bookingId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'bookings'] });
      toast.success("Booking status updated successfully");
    },
    onError: (error) => {
      console.error("Error updating booking status:", error);
      toast.error("Failed to update booking status");
    },
  });
  
  // Filter bookings based on search query and status
  const filteredBookings = bookings.filter((booking: any) => {
    const matchesSearch = 
      booking.user?.displayName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.destination?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.id?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || booking.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  // Pagination
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const paginatedBookings = filteredBookings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  // Handle update booking status
  const handleUpdateBookingStatus = (bookingId: string, status: string) => {
    updateBookingStatusMutation.mutate({ bookingId, status });
  };
  
  // Stats calculations
  const totalBookings = bookings.length;
  const confirmedBookings = bookings.filter((booking: any) => booking.status === "confirmed").length;
  const pendingBookings = bookings.filter((booking: any) => booking.status === "pending").length;
  const cancelledBookings = bookings.filter((booking: any) => booking.status === "cancelled").length;
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Booking Management</h2>
        <div className="flex items-center gap-4">
          <Button variant="outline">
            <FileText className="mr-2 h-4 w-4" /> Export CSV
          </Button>
          <Button variant="outline">
            <Printer className="mr-2 h-4 w-4" /> Print
          </Button>
        </div>
      </div>
      
      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBookings}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Confirmed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{confirmedBookings}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Calendar className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingBookings}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cancelled</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{cancelledBookings}</div>
          </CardContent>
        </Card>
      </div>
      
      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 py-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search bookings..."
            className="w-full sm:w-[300px] pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div>
          <Select
            value={statusFilter}
            onValueChange={setStatusFilter}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Booking ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Destination/Activity</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin h-6 w-6 border-4 border-filipino-teal border-t-transparent rounded-full mr-2"></div>
                    Loading bookings...
                  </div>
                </TableCell>
              </TableRow>
            ) : paginatedBookings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10">
                  No bookings found.
                </TableCell>
              </TableRow>
            ) : (
              paginatedBookings.map((booking: any) => (
                <TableRow key={booking.id}>
                  <TableCell className="font-medium">{booking.id.slice(0, 8)}</TableCell>
                  <TableCell>{booking.user?.displayName || 'Unknown'}</TableCell>
                  <TableCell>{booking.destination?.name || booking.activity?.name || 'Unknown'}</TableCell>
                  <TableCell>
                    {booking.date ? new Date(booking.date).toLocaleDateString() : 'N/A'}
                  </TableCell>
                  <TableCell>₱ {booking.amount?.toFixed(2) || '0.00'}</TableCell>
                  <TableCell>
                    {booking.status === 'confirmed' && (
                      <Badge className="bg-green-500">Confirmed</Badge>
                    )}
                    {booking.status === 'pending' && (
                      <Badge variant="outline" className="text-amber-500 border-amber-500">Pending</Badge>
                    )}
                    {booking.status === 'cancelled' && (
                      <Badge variant="destructive">Cancelled</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleUpdateBookingStatus(booking.id, 'confirmed')}>
                          <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                          Confirm Booking
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleUpdateBookingStatus(booking.id, 'pending')}>
                          <Calendar className="mr-2 h-4 w-4 text-amber-500" />
                          Mark as Pending
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="text-destructive focus:text-destructive" 
                          onClick={() => handleUpdateBookingStatus(booking.id, 'cancelled')}
                        >
                          <XCircle className="mr-2 h-4 w-4" />
                          Cancel Booking
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span className="text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
