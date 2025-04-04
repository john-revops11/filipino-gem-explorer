
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  Settings, Save, RefreshCw, Bell, Lock, Mail, 
  CreditCard, Share2, Globe, FileText, Info 
} from "lucide-react";

// Define the form schema
const generalSettingsSchema = z.object({
  siteName: z.string().min(2, {
    message: "Site name must be at least 2 characters.",
  }),
  siteDescription: z.string().min(5, {
    message: "Site description must be at least 5 characters.",
  }),
  contactEmail: z.string().email({
    message: "Please enter a valid email address.",
  }),
  supportPhone: z.string().min(5, {
    message: "Please enter a valid phone number.",
  }),
  enableRegistration: z.boolean(),
  enableBookings: z.boolean(),
  maintenanceMode: z.boolean(),
});

export function AdminSettings() {
  const [isDirty, setIsDirty] = useState(false);
  
  // Form setup
  const form = useForm<z.infer<typeof generalSettingsSchema>>({
    resolver: zodResolver(generalSettingsSchema),
    defaultValues: {
      siteName: "Local Stopover",
      siteDescription: "Explore hidden gems and authentic local experiences.",
      contactEmail: "info@localstopover.com",
      supportPhone: "+63 123 456 7890",
      enableRegistration: true,
      enableBookings: true,
      maintenanceMode: false,
    },
  });
  
  // Save settings mutation
  const saveSettingsMutation = useMutation({
    mutationFn: (data: z.infer<typeof generalSettingsSchema>) => {
      // Simulate API call
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          console.log("Saving settings:", data);
          resolve();
        }, 1000);
      });
    },
    onSuccess: () => {
      toast.success("Settings saved successfully");
      setIsDirty(false);
    },
    onError: (error) => {
      console.error("Error saving settings:", error);
      toast.error("Failed to save settings");
    },
  });
  
  // Handle form submission
  const onSubmit = (data: z.infer<typeof generalSettingsSchema>) => {
    saveSettingsMutation.mutate(data);
  };
  
  // Handle form value changes
  const handleFormChange = () => {
    if (!isDirty) {
      setIsDirty(true);
    }
  };
  
  // Reset form to defaults
  const handleReset = () => {
    form.reset();
    setIsDirty(false);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">System Settings</h2>
        
        <div className="flex items-center gap-2">
          {isDirty && (
            <Button variant="outline" onClick={handleReset}>
              <RefreshCw className="mr-2 h-4 w-4" /> Reset
            </Button>
          )}
          
          <Button 
            onClick={form.handleSubmit(onSubmit)} 
            disabled={!isDirty || saveSettingsMutation.isPending}
          >
            {saveSettingsMutation.isPending ? (
              <>
                <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" /> Save Changes
              </>
            )}
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-4 md:w-auto md:inline-flex">
          <TabsTrigger value="general">
            <Settings className="mr-2 h-4 w-4" /> General
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="mr-2 h-4 w-4" /> Notifications
          </TabsTrigger>
          <TabsTrigger value="security">
            <Lock className="mr-2 h-4 w-4" /> Security
          </TabsTrigger>
          <TabsTrigger value="integrations">
            <Share2 className="mr-2 h-4 w-4" /> Integrations
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} onChange={handleFormChange}>
              <Card>
                <CardHeader>
                  <CardTitle>General Settings</CardTitle>
                  <CardDescription>
                    Configure the basic settings for your application.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="siteName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Site Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter site name" {...field} />
                          </FormControl>
                          <FormDescription>
                            The name of your website or application.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="contactEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact Email</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter contact email" {...field} />
                          </FormControl>
                          <FormDescription>
                            The primary contact email for your site.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="siteDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Site Description</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter site description" {...field} />
                        </FormControl>
                        <FormDescription>
                          A brief description of your site for SEO and meta tags.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="supportPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Support Phone</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter support phone number" {...field} />
                        </FormControl>
                        <FormDescription>
                          Customer support phone number.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Site Options</h3>
                    
                    <FormField
                      control={form.control}
                      name="enableRegistration"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Enable User Registration
                            </FormLabel>
                            <FormDescription>
                              Allow new users to register on your site.
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="enableBookings"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Enable Bookings
                            </FormLabel>
                            <FormDescription>
                              Allow users to make bookings on your site.
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="maintenanceMode"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Maintenance Mode
                            </FormLabel>
                            <FormDescription>
                              Put your site in maintenance mode. Only admins can access the site.
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                  <Button 
                    type="submit" 
                    disabled={!isDirty || saveSettingsMutation.isPending}
                  >
                    {saveSettingsMutation.isPending ? "Saving..." : "Save Changes"}
                  </Button>
                </CardFooter>
              </Card>
            </form>
          </Form>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Configure how the system sends notifications.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Email Notifications</h3>
                
                <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <Label className="text-base">New User Registration</Label>
                    <p className="text-sm text-muted-foreground">
                      Send email notifications when new users register.
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <Label className="text-base">New Booking Notification</Label>
                    <p className="text-sm text-muted-foreground">
                      Send email notifications for new bookings.
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <Label className="text-base">Marketing Emails</Label>
                    <p className="text-sm text-muted-foreground">
                      Send promotional and marketing emails to users.
                    </p>
                  </div>
                  <Switch />
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">System Notifications</h3>
                
                <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <Label className="text-base">Error Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Send notifications for system errors.
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <Label className="text-base">System Updates</Label>
                    <p className="text-sm text-muted-foreground">
                      Send notifications for system updates.
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="ml-auto">Save Notification Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Configure security options for your application.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Authentication</h3>
                
                <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <Label className="text-base">Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">
                      Require two-factor authentication for admin accounts.
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <Label className="text-base">Password Complexity</Label>
                    <p className="text-sm text-muted-foreground">
                      Require strong passwords for all user accounts.
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <Label className="text-base">Session Timeout</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically log out users after 2 hours of inactivity.
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Data Protection</h3>
                
                <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <Label className="text-base">Data Encryption</Label>
                    <p className="text-sm text-muted-foreground">
                      Encrypt sensitive data in the database.
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <Label className="text-base">Automatic Backups</Label>
                    <p className="text-sm text-muted-foreground">
                      Create automated backups of the database daily.
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="ml-auto">Save Security Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="integrations">
          <Card>
            <CardHeader>
              <CardTitle>Integration Settings</CardTitle>
              <CardDescription>
                Configure third-party integrations and APIs.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Payment Gateways</h3>
                
                <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5 flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    <div>
                      <Label className="text-base">PayPal Integration</Label>
                      <p className="text-sm text-muted-foreground">
                        Enable PayPal as a payment method.
                      </p>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5 flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    <div>
                      <Label className="text-base">Stripe Integration</Label>
                      <p className="text-sm text-muted-foreground">
                        Enable Stripe as a payment method.
                      </p>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Social Media</h3>
                
                <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5 flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    <div>
                      <Label className="text-base">Facebook Integration</Label>
                      <p className="text-sm text-muted-foreground">
                        Enable Facebook login and sharing.
                      </p>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5 flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    <div>
                      <Label className="text-base">Google Integration</Label>
                      <p className="text-sm text-muted-foreground">
                        Enable Google login and Maps API.
                      </p>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Other Integrations</h3>
                
                <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5 flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    <div>
                      <Label className="text-base">Mailchimp Integration</Label>
                      <p className="text-sm text-muted-foreground">
                        Sync users with Mailchimp for email marketing.
                      </p>
                    </div>
                  </div>
                  <Switch />
                </div>
                
                <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5 flex items-center gap-2">
                    <Info className="h-5 w-5" />
                    <div>
                      <Label className="text-base">Analytics Integration</Label>
                      <p className="text-sm text-muted-foreground">
                        Enable Google Analytics for site tracking.
                      </p>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="ml-auto">Save Integration Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
