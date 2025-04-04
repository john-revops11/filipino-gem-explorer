
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Shield, EyeIcon, EyeOffIcon, AlertTriangle } from "lucide-react";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useIsMobile } from "@/hooks/use-mobile";

export default function AdminLogin() {
  const navigate = useNavigate();
  const { adminLogin } = useAdminAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const isMobile = useIsMobile();

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setIsLoading(true);

    try {
      const success = await adminLogin(email, password);
      if (success) {
        navigate("/admin");
      }
    } catch (error: any) {
      console.error("Admin login error:", error);
      setLoginError(error.message || "Failed to log in as admin");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`flex min-h-screen flex-col items-center justify-center p-4 ${!isMobile ? "bg-gradient-to-b from-gray-900 to-gray-800" : ""}`}>
      {isMobile && (
        <div className="absolute inset-0 z-0">
          {/* Mobile background image */}
          <img 
            src="/lovable-uploads/5c1116fa-cd0c-456a-a53f-8ec1c8b2420f.png" 
            alt="Manila skyline" 
            className="h-full w-full object-cover"
          />
          {/* Dark gradient overlay for admin */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70"></div>
        </div>
      )}
      
      <div className="w-full max-w-md relative z-10">
        <Card className="border-none shadow-lg backdrop-blur-sm bg-white/90">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-4">
              <Shield className="h-16 w-16 text-filipino-maroon" />
            </div>
            <CardTitle className="text-2xl font-bold">Admin Portal</CardTitle>
            <CardDescription>
              Sign in to access the administrative dashboard
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleAdminLogin}>
            <CardContent className="space-y-4">
              {loginError && (
                <div className="bg-red-50 p-3 rounded-md flex items-start gap-2 text-red-700 text-sm">
                  <AlertTriangle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <p>{loginError}</p>
                </div>
              )}
              
              {process.env.NODE_ENV === 'development' && (
                <div className="bg-blue-50 p-3 rounded-md text-blue-700 text-sm">
                  <p className="font-semibold">Development Mode</p>
                  <p>Admin user: admin@example.com / admin123</p>
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="admin-email">Email</Label>
                <Input
                  id="admin-email"
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="admin-password">Password</Label>
                <div className="relative">
                  <Input
                    id="admin-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="admin123"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOffIcon className="h-4 w-4" />
                    ) : (
                      <EyeIcon className="h-4 w-4" />
                    )}
                    <span className="sr-only">
                      {showPassword ? "Hide password" : "Show password"}
                    </span>
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col">
              <Button 
                type="submit" 
                className="w-full bg-filipino-maroon hover:bg-filipino-maroon/90 text-white"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign in as Admin"}
              </Button>
              <div className="mt-4 text-center text-sm">
                <Button 
                  variant="link" 
                  className="px-0 text-filipino-maroon hover:text-filipino-maroon/80"
                  onClick={() => navigate("/login")}
                  type="button"
                >
                  Back to user login
                </Button>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
