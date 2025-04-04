
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { 
  User, 
  Settings, 
  Heart, 
  HelpCircle, 
  LogOut,
  ChevronRight
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

export default function Profile() {
  const menuItems = [
    { icon: Heart, label: "Saved Items", path: "/saved" },
    { icon: Settings, label: "Preferences", path: "/preferences" },
    { icon: HelpCircle, label: "Help & Support", path: "/help" },
  ];

  return (
    <div className="min-h-screen pb-16">
      <Header title="Profile" showSearch={false} />
      
      <div className="p-4">
        <div className="flex items-center mb-6">
          <Avatar className="h-16 w-16 mr-4">
            <AvatarImage src="" />
            <AvatarFallback className="bg-filipino-terracotta text-white">
              GU
            </AvatarFallback>
          </Avatar>
          
          <div>
            <h2 className="text-xl font-semibold">Guest User</h2>
            <Button variant="link" className="p-0 h-auto text-filipino-terracotta">
              Sign in or Create Account
            </Button>
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Your Travel Preferences</h3>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">Culture & Heritage</Badge>
            <Badge variant="outline">Nature & Outdoors</Badge>
            <Badge variant="outline">Couple</Badge>
            <Badge variant="outline">Moderate Budget</Badge>
          </div>
        </div>
        
        <div className="space-y-1 mb-6">
          {menuItems.map((item) => (
            <Button
              key={item.label}
              variant="ghost"
              className="w-full justify-start pl-2 font-normal"
            >
              <item.icon className="h-5 w-5 mr-3 text-muted-foreground" />
              {item.label}
              <ChevronRight className="ml-auto h-5 w-5 text-muted-foreground" />
            </Button>
          ))}
        </div>
        
        <div className="border rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="mr-2">🌙</span>
              <span>Dark Mode</span>
            </div>
            <Switch />
          </div>
        </div>
        
        <Button variant="outline" className="w-full">
          <LogOut className="h-5 w-5 mr-2" />
          Log Out
        </Button>
      </div>
      
      <BottomNav />
    </div>
  );
}
