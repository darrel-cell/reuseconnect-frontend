import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, UserPlus, Truck, Calendar, MapPin, Package, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useBooking, useAssignDriver } from "@/hooks/useBookings";
import { useUsers } from "@/hooks/useUsers";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import type { BookingLifecycleStatus } from "@/types/booking-lifecycle";

const Assignment = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get("booking");

  const { data: booking, isLoading: isLoadingBooking } = useBooking(bookingId);
  const { data: drivers = [] } = useUsers({ role: "driver", isActive: true });
  const [selectedDriverId, setSelectedDriverId] = useState<string>("");
  const assignMutation = useAssignDriver();

  // Set selected driver if booking already has one
  useEffect(() => {
    if (booking?.driverId) {
      setSelectedDriverId(booking.driverId);
    }
  }, [booking]);

  const handleAssign = () => {
    if (!bookingId || !selectedDriverId) {
      toast.error("Please select a driver");
      return;
    }

    if (booking?.status !== 'created') {
      toast.error("Only bookings in 'created' status can be assigned");
      return;
    }

    assignMutation.mutate(
      { bookingId, driverId: selectedDriverId },
      {
        onSuccess: () => {
          toast.success("Driver assigned successfully!", {
            description: "Booking has been scheduled and driver has been notified.",
          });
          navigate("/admin/bookings");
        },
        onError: (error) => {
          toast.error("Failed to assign driver", {
            description: error instanceof Error ? error.message : "Please try again.",
          });
        },
      }
    );
  };

  if (isLoadingBooking) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="space-y-6">
        <Alert variant="destructive">
          <AlertDescription>Booking not found</AlertDescription>
        </Alert>
        <Button onClick={() => navigate("/admin/bookings")}>Back to Booking Queue</Button>
      </div>
    );
  }

  if (booking.status !== 'created' && booking.status !== 'scheduled') {
    return (
      <div className="space-y-6">
        <Alert>
          <AlertDescription>
            This booking cannot be assigned. Only bookings in "created" status can be assigned a driver.
            Current status: {booking.status}
          </AlertDescription>
        </Alert>
        <Button onClick={() => navigate("/admin/bookings")}>Back to Booking Queue</Button>
      </div>
    );
  }

  const totalAssets = booking.assets.reduce((sum, a) => sum + a.quantity, 0);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4"
      >
        <Button variant="ghost" size="icon" onClick={() => navigate("/admin/bookings")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold text-foreground">Assign Driver</h2>
          <p className="text-muted-foreground">Schedule booking and assign driver for collection</p>
        </div>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Booking Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Booking Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Booking Number</p>
                <p className="font-mono">{booking.bookingNumber}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Client</p>
                <p className="font-semibold">{booking.clientName}</p>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Site</p>
                  <p>{booking.siteName}</p>
                  <p className="text-sm text-muted-foreground">{booking.siteAddress}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Scheduled Date</p>
                  <p>{new Date(booking.scheduledDate).toLocaleDateString("en-GB", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Assets</p>
                  <p>{totalAssets} items</p>
                  <div className="text-sm text-muted-foreground mt-1">
                    {booking.assets.map(a => `${a.quantity}x ${a.categoryName}`).join(", ")}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Assignment Form */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5" />
                Driver Assignment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {booking.driverName ? (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Currently Assigned</p>
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-muted">
                    <Truck className="h-4 w-4" />
                    <span className="font-medium">{booking.driverName}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Booking is already scheduled. To change driver, contact support.
                  </p>
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="driver">Select Driver</Label>
                    <Select value={selectedDriverId} onValueChange={setSelectedDriverId}>
                      <SelectTrigger id="driver">
                        <SelectValue placeholder="Choose a driver..." />
                      </SelectTrigger>
                      <SelectContent>
                        {drivers.length === 0 ? (
                          <SelectItem value="none" disabled>No drivers available</SelectItem>
                        ) : (
                          drivers.map((driver) => (
                            <SelectItem key={driver.id} value={driver.id}>
                              {driver.name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    {drivers.length === 0 && (
                      <p className="text-sm text-muted-foreground">
                        No active drivers found. Please add drivers in user management.
                      </p>
                    )}
                  </div>

                  <Button
                    onClick={handleAssign}
                    disabled={!selectedDriverId || assignMutation.isPending}
                    className="w-full"
                  >
                    {assignMutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Assigning...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Assign & Schedule
                      </>
                    )}
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    This will change booking status to "scheduled" and notify the driver.
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Assignment;

