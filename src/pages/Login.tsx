
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/services/firebase";
import { EyeIcon, EyeOffIcon, AlertTriangle } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const isMobile = useIsMobile();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError("");

    try {
      // Regular user login
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Login successful");
      navigate("/");
    } catch (error: any) {
      console.error("Login error:", error);
      
      // Handle specific Firebase error codes
      let errorMessage = "Failed to log in";
      
      if (error.code === 'auth/invalid-credential' || 
          error.code === 'auth/user-not-found' || 
          error.code === 'auth/wrong-password') {
        errorMessage = "Invalid email or password";
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = "Too many failed login attempts. Please try again later";
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = "Network error. Please check your connection";
      } else if (error.code === 'auth/configuration-not-found') {
        errorMessage = "Authentication service unavailable. Please try again later";
      }
      
      setLoginError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`flex min-h-screen flex-col items-center justify-center p-4 ${!isMobile ? "bg-gradient-to-b from-filipino-cream to-filipino-beige" : ""}`}>
      {isMobile && (
        <div className="absolute inset-0 z-0">
          {/* Mobile background image */}
          <img 
            src="/lovable-uploads/18ecf041-866a-43f4-82c2-848f3bd674f5.png" 
            alt="Filipino landscape" 
            className="h-full w-full object-cover"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-filipino-forest/50 via-filipino-forest/30 to-filipino-forest/60"></div>
        </div>
      )}
      
      <div className="w-full max-w-md relative z-10">
        <Card className="border-none shadow-lg backdrop-blur-sm bg-white/90">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-4">
              <img 
                src="/lovable-uploads/4c2638cd-0e7f-4814-adf8-5f0215c6afbd.png" 
                alt="Local Stopover Logo" 
                className="h-16" 
              />
            </div>
            <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
            <CardDescription>
              Sign in to your account to continue your journey
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
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
                  <p>Regular user: user@example.com / password123</p>
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="user@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Button 
                    variant="link" 
                    className="px-0 text-xs" 
                    onClick={() => navigate("/forgot-password")}
                    type="button"
                  >
                    Forgot password?
                  </Button>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="password123"
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
                className="w-full bg-filipino-forest hover:bg-filipino-forest/90"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
              <div className="mt-4 text-center text-sm">
                Don't have an account?{" "}
                <Button 
                  variant="link" 
                  className="px-0 text-filipino-goldenrod"
                  onClick={() => navigate("/signup")}
                  type="button"
                >
                  Create one
                </Button>
              </div>
            </CardFooter>
          </form>
        </Card>
        <div className="mt-4 text-center">
          <Button 
            variant="link" 
            className={`text-xs ${isMobile ? "text-white" : "text-gray-600"}`}
            onClick={() => navigate("/admin/login")}
          >
            Admin login
          </Button>
        </div>
      </div>
    </div>
  );
}
