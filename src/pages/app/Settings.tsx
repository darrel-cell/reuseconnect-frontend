import { motion } from "framer-motion";
import { 
  Building2, 
  Users, 
  Palette, 
  Bell, 
  Link2, 
  Shield,
  Save,
  User,
  Truck,
  Phone,
  Mail
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useTenantTheme } from "@/contexts/TenantThemeContext";

const Settings = () => {
  const { user } = useAuth();
  const { tenantName } = useTenantTheme();
  
  const handleSave = () => {
    toast.success("Settings saved successfully");
  };

  const isAdmin = user?.role === 'admin';
  const isClient = user?.role === 'client';
  const isReseller = user?.role === 'reseller';
  const isDriver = user?.role === 'driver';

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-2xl font-bold text-foreground">Settings</h2>
        <p className="text-muted-foreground">
          {isAdmin && "Manage platform settings, organisation details, and user access"}
          {isClient && "Manage your organisation details and preferences"}
          {isReseller && "Manage your organisation, branding, and client settings"}
          {isDriver && "Manage your profile and notification preferences"}
        </p>
      </motion.div>

      {/* Profile Settings - For Drivers */}
      {isDriver && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <User className="h-5 w-5" />
                Profile Information
              </CardTitle>
              <CardDescription>
                Your personal information and contact details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="driverName">Full Name</Label>
                  <Input id="driverName" defaultValue={user?.name || ''} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="driverEmail">Email</Label>
                  <Input id="driverEmail" type="email" defaultValue={user?.email || ''} />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="driverPhone">Phone Number</Label>
                  <Input id="driverPhone" defaultValue="+44 7700 900123" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vehicleReg">Vehicle Registration</Label>
                  <Input id="vehicleReg" defaultValue="AB12 CDE" className="font-mono" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Organisation Settings - For Admin, Client, Reseller */}
      {(isAdmin || isClient || isReseller) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Building2 className="h-5 w-5" />
                Organisation Details
              </CardTitle>
              <CardDescription>
                {isAdmin && "Platform-wide organisation information"}
                {(isClient || isReseller) && "Your company information displayed on reports and certificates"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="orgName">Organisation Name</Label>
                  <Input id="orgName" defaultValue={tenantName || user?.tenantName || ''} />
                </div>
                {(isAdmin || isClient) && (
                  <div className="space-y-2">
                    <Label htmlFor="regNumber">Registration Number</Label>
                    <Input id="regNumber" defaultValue="12345678" />
                  </div>
                )}
              </div>
              {(isAdmin || isClient) && (
                <div className="space-y-2">
                  <Label htmlFor="address">Registered Address</Label>
                  <Input id="address" defaultValue="123 Tech Street, London EC1A 1BB" />
                </div>
              )}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Primary Email</Label>
                  <Input id="email" type="email" defaultValue={user?.email || ''} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" defaultValue="+44 20 1234 5678" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* White Label / Branding (for admin and resellers) */}
      {(isAdmin || isReseller) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Palette className="h-5 w-5" />
                Branding & White-Label
              </CardTitle>
              <CardDescription>
                {isAdmin && "Customise the platform appearance for all users"}
                {isReseller && "Customise the platform appearance for your clients"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Logo</Label>
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-2xl">
                      {tenantName?.charAt(0) || 'R'}
                    </div>
                    <Button variant="outline" size="sm">Upload Logo</Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="primaryColor">Primary Colour</Label>
                  <div className="flex items-center gap-2">
                    <div className="h-10 w-10 rounded-lg bg-primary border" />
                    <Input id="primaryColor" defaultValue="#0d9488" className="flex-1" />
                  </div>
                </div>
              </div>
              {isReseller && (
                <div className="p-3 rounded-lg bg-info/10 border border-info/20">
                  <p className="text-sm text-info-foreground">
                    Branding changes will apply to all your client portals
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Notifications - Role-specific */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: isDriver ? 0.2 : 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
            <CardDescription>
              Configure how and when you receive updates
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Common notifications */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Email notifications</p>
                <p className="text-sm text-muted-foreground">
                  {isDriver && "Receive updates about assigned jobs"}
                  {!isDriver && "Receive updates about job status changes"}
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            
            {/* Driver-specific notifications */}
            {isDriver && (
              <>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Job assignments</p>
                    <p className="text-sm text-muted-foreground">Get notified when new jobs are assigned to you</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Route updates</p>
                    <p className="text-sm text-muted-foreground">Receive updates about route changes or delays</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
              </>
            )}
            
            {/* Client/Reseller/Admin notifications */}
            {!isDriver && (
              <>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Collection reminders</p>
                    <p className="text-sm text-muted-foreground">Get notified 24h before scheduled collections</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Certificate availability</p>
                    <p className="text-sm text-muted-foreground">Notify when new certificates are ready</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                {(isAdmin || isClient) && (
                  <>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">ESG report summaries</p>
                        <p className="text-sm text-muted-foreground">Weekly environmental impact digests</p>
                      </div>
                      <Switch />
                    </div>
                    <Separator />
                  </>
                )}
                {isReseller && (
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Client activity</p>
                      <p className="text-sm text-muted-foreground">Get notified about your clients' bookings and jobs</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Integrations - For Admin, Client, Reseller only */}
      {(isAdmin || isClient || isReseller) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Link2 className="h-5 w-5" />
                Integrations
              </CardTitle>
              <CardDescription>
                {isAdmin && "Manage platform-wide system integrations"}
                {(isClient || isReseller) && "Connect external systems and APIs"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {(isAdmin || isClient) && (
                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center">
                      <span className="text-lg">📊</span>
                    </div>
                    <div>
                      <p className="font-medium">ERP System</p>
                      <p className="text-sm text-muted-foreground">
                        {isAdmin ? "Platform ERP integration" : "Connected to internal ERP"}
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-success/10 text-success">Connected</Badge>
                </div>
              )}
              {isAdmin && (
                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center">
                      <span className="text-lg">💾</span>
                    </div>
                    <div>
                      <p className="font-medium">Blancco Data Wipe</p>
                      <p className="text-sm text-muted-foreground">Sanitisation system integration</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-success/10 text-success">Connected</Badge>
                </div>
              )}
              {isReseller && (
                <div className="p-4 rounded-lg bg-muted/50 border border-dashed">
                  <p className="text-sm text-muted-foreground text-center">
                    Integrations are managed by the platform administrator
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* User Management - Admin only */}
      {isAdmin && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Users className="h-5 w-5" />
                User Management
              </CardTitle>
              <CardDescription>
                Manage platform users, roles, and permissions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-lg bg-muted/50 border border-dashed">
                <p className="text-sm text-muted-foreground text-center">
                  User management interface coming soon
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Security - For all roles */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: isDriver ? 0.3 : 0.6 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Shield className="h-5 w-5" />
              Security
            </CardTitle>
            <CardDescription>
              Manage your account security settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input id="currentPassword" type="password" placeholder="Enter current password" />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input id="newPassword" type="password" placeholder="Enter new password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input id="confirmPassword" type="password" placeholder="Confirm new password" />
              </div>
            </div>
            {isAdmin && (
              <div className="p-3 rounded-lg bg-warning/10 border border-warning/20">
                <p className="text-sm text-warning-foreground">
                  As an administrator, password changes affect your platform access
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Save Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex justify-end"
      >
        <Button variant="hero" onClick={handleSave}>
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </motion.div>
    </div>
  );
};

export default Settings;
