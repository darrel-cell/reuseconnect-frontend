import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Shield, Download, CheckCircle2, Clock, Loader2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useBooking } from "@/hooks/useBookings";
import { useSanitisationRecords } from "@/hooks/useSanitisation";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

const sanitisationMethods = [
  { value: 'blancco', label: 'Blancco Software Wipe' },
  { value: 'physical-destruction', label: 'Physical Destruction' },
  { value: 'degaussing', label: 'Degaussing' },
  { value: 'shredding', label: 'Shredding' },
  { value: 'other', label: 'Other' },
];

const BookingCertificates = () => {
  const { id } = useParams();
  const { data: booking, isLoading: isLoadingBooking } = useBooking(id || null);
  const { data: records = [], isLoading: isLoadingRecords } = useSanitisationRecords(id);

  if (isLoadingBooking || isLoadingRecords) {
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
        <Button asChild>
          <Link to="/bookings" className="text-inherit no-underline">Back to Bookings</Link>
        </Button>
      </div>
    );
  }

  if (booking.status === 'created' || booking.status === 'scheduled') {
    return (
      <div className="space-y-6">
        <Alert>
          <AlertDescription>
            Sanitisation certificates will be available after assets are collected and sanitised.
            Current status: {booking.status}
          </AlertDescription>
        </Alert>
        <Button asChild>
          <Link to={`/bookings/${id}`} className="text-inherit no-underline">Back to Booking</Link>
        </Button>
      </div>
    );
  }

  // Group records by asset
  const recordsByAsset = records.reduce((acc, record) => {
    if (!acc[record.assetId]) {
      acc[record.assetId] = [];
    }
    acc[record.assetId].push(record);
    return acc;
  }, {} as Record<string, typeof records>);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4"
      >
        <Button variant="ghost" size="icon" asChild>
          <Link to={`/bookings/${id}`} className="text-inherit no-underline">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-foreground">Sanitisation Certificates</h2>
          <p className="text-muted-foreground">{booking.bookingNumber} - {booking.clientName}</p>
        </div>
      </motion.div>

      {/* Certificates List */}
      {records.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <Shield className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">No sanitisation certificates available yet</p>
              <p className="text-sm text-muted-foreground mt-2">
                Certificates will appear here once assets are sanitised
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {booking.assets.map((asset) => {
            const assetRecords = recordsByAsset[asset.categoryId] || [];

            if (assetRecords.length === 0) return null;

            return (
              <Card key={asset.categoryId}>
                <CardHeader>
                  <CardTitle className="text-lg">{asset.categoryName}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {assetRecords.map((record) => (
                      <div
                        key={record.id}
                        className="flex items-start justify-between p-4 rounded-lg border bg-muted/50"
                      >
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <Shield className="h-5 w-5 text-primary" />
                            <span className="font-medium">
                              {sanitisationMethods.find(m => m.value === record.method)?.label || record.method}
                            </span>
                            {record.verified ? (
                              <Badge className="bg-success/10 text-success">
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                Verified
                              </Badge>
                            ) : (
                              <Badge variant="secondary">
                                <Clock className="h-3 w-3 mr-1" />
                                Pending Verification
                              </Badge>
                            )}
                          </div>
                          <div className="text-sm space-y-1">
                            <p>
                              <span className="text-muted-foreground">Certificate ID:</span> <span className="font-mono font-medium text-foreground">{record.certificateId}</span>
                            </p>
                            <p>
                              <span className="text-muted-foreground">Sanitised:</span> <span className="text-foreground">{new Date(record.timestamp).toLocaleString("en-GB", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}</span>
                            </p>
                            {record.methodDetails && (
                              <p><span className="text-muted-foreground">Method Details:</span> <span className="text-foreground">{record.methodDetails}</span></p>
                            )}
                            {record.notes && (
                              <p className="text-xs"><span className="text-muted-foreground">Notes:</span> <span className="text-foreground">{record.notes}</span></p>
                            )}
                          </div>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                          <a href={record.certificateUrl} download>
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </a>
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Info Card */}
      <Card className="bg-info/5 border-info/20">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <FileText className="h-5 w-5 text-info mt-0.5" />
            <div className="flex-1">
              <p className="font-medium text-foreground mb-1">About Certificates</p>
              <p className="text-sm text-muted-foreground">
                Sanitisation certificates provide proof that data has been securely erased from your assets.
                These certificates are important for compliance and can be used for audit purposes.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingCertificates;

