
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { Bell, Globe, Lock, Shield } from "lucide-react";

type ProfileSettingsProps = {
  profile: any;
  onSave: (updatedProfile: any) => void;
  onCancel: () => void;
};

export const ProfileSettings = ({ profile, onSave, onCancel }: ProfileSettingsProps) => {
  const [formData, setFormData] = useState({
    name: profile.name,
    email: profile.email,
    location: profile.location,
    bio: profile.bio,
    emailNotifications: true,
    appNotifications: true,
    marketingEmails: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleToggle = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    toast({
      title: "Profile updated",
      description: "Your changes have been saved successfully.",
    });
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input 
            id="name" 
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email" 
            name="email"
            type="email" 
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input 
            id="location" 
            name="location"
            value={formData.location}
            onChange={handleChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea 
            id="bio" 
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            className="min-h-[100px]"
          />
        </div>

        <div className="border-t pt-4 mt-6">
          <h3 className="text-lg font-medium mb-4">Notification Settings</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Bell className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="emailNotifications" className="cursor-pointer">
                  Email Notifications
                </Label>
              </div>
              <Switch 
                id="emailNotifications"
                checked={formData.emailNotifications}
                onCheckedChange={(checked) => handleToggle("emailNotifications", checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Bell className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="appNotifications" className="cursor-pointer">
                  App Notifications
                </Label>
              </div>
              <Switch 
                id="appNotifications"
                checked={formData.appNotifications}
                onCheckedChange={(checked) => handleToggle("appNotifications", checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="marketingEmails" className="cursor-pointer">
                  Marketing Emails
                </Label>
              </div>
              <Switch 
                id="marketingEmails"
                checked={formData.marketingEmails}
                onCheckedChange={(checked) => handleToggle("marketingEmails", checked)}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" type="button" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" className="bg-filipino-terracotta">
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
};
