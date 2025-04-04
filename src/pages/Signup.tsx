
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { EyeIcon, EyeOffIcon, AlertTriangle } from "lucide-react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, firestore } from "@/services/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export default function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [signupError, setSignupError] = useState("");
  
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError("");
    
    if (password !== confirmPassword) {
      setSignupError("Passwords do not match");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Create the user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update the display name
      await updateProfile(userCredential.user, {
        displayName: name
      });
      
      // Store additional user information in Firestore
      await setDoc(doc(firestore, "users", userCredential.user.uid), {
        displayName: name,
        email: email,
        createdAt: serverTimestamp(),
        isAdmin: false,
        photoURL: null
      });
      
      toast.success("Account created successfully");
      navigate("/");
    } catch (error: any) {
      console.error("Signup error:", error);
      
      let errorMessage = "Failed to create account";
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = "Email is already in use";
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = "Invalid email address";
      } else if (error.code === 'auth/weak-password') {
        errorMessage = "Password is too weak";
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = "Network error. Please check your connection";
      }
      
      setSignupError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-filipino-cream to-filipino-beige p-4">
      <div className="w-full max-w-md">
        <Card className="border-none shadow-lg">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-4">
              <img 
                src="/lovable-uploads/4c2638cd-0e7f-4814-adf8-5f0215c6afbd.png" 
                alt="Local Stopover Logo" 
                className="h-16" 
              />
            </div>
            <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
            <CardDescription>
              Enter your details to start your journey with us
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSignup}>
            <CardContent className="space-y-4">
              {signupError && (
                <div className="bg-red-50 p-3 rounded-md flex items-start gap-2 text-red-700 text-sm">
                  <AlertTriangle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <p>{signupError}</p>
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
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
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col">
              <Button 
                type="submit" 
                className="w-full bg-filipino-forest hover:bg-filipino-forest/90"
                disabled={isLoading}
              >
                {isLoading ? "Creating account..." : "Sign up"}
              </Button>
              <div className="mt-4 text-center text-sm">
                Already have an account?{" "}
                <Button 
                  variant="link" 
                  className="px-0 text-filipino-goldenrod"
                  onClick={() => navigate("/login")}
                  type="button"
                >
                  Sign in
                </Button>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
