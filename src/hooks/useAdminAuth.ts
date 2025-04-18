
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "@/services/firebase";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, User } from "firebase/auth";
import { toast } from "sonner";

export function useAdminAuth() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setIsLoading(true);
      
      if (currentUser) {
        // For development purposes, allow easy access
        if (process.env.NODE_ENV === 'development') {
          console.log('Development mode: Bypassing admin check');
          setUser(currentUser);
          setIsAdmin(true);
          setIsLoading(false);
          return;
        }
        
        // In a real app, you would verify admin status here
        // For example, checking custom claims or a roles table in your database
        try {
          // Simple admin check based on email - replace with proper role check
          // In production, this should be done with custom claims or a roles table
          if (currentUser.email === "admin@example.com" || currentUser.uid === "system") {
            setUser(currentUser);
            setIsAdmin(true);
          } else {
            setUser(currentUser);
            setIsAdmin(false);
            // Only redirect non-admins if they're trying to access the admin section
            if (window.location.pathname.startsWith('/admin')) {
              toast.error("Admin access required");
              navigate("/");
            }
          }
        } catch (error) {
          console.error("Error checking admin status:", error);
          setIsAdmin(false);
        }
      } else {
        setUser(null);
        setIsAdmin(false);
        
        // Only redirect if they're trying to access the admin section
        if (window.location.pathname.startsWith('/admin') && 
            window.location.pathname !== '/admin/login') {
          toast.error("You must be logged in to access the admin dashboard");
          navigate("/admin/login");
        }
      }
      
      setIsLoading(false);
    });

    // Clean up subscription
    return () => unsubscribe();
  }, [navigate]);

  // Admin login function
  const adminLogin = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      
      // Check if the logged in user is an admin
      if (email === "admin@example.com") {
        toast.success("Logged in as admin successfully");
        return true;
      } else {
        toast.error("This account does not have admin privileges");
        await signOut(auth);
        return false;
      }
    } catch (error: any) {
      console.error("Login error:", error);
      let errorMessage = "Failed to log in";
      
      // Handle specific Firebase error codes
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
      
      toast.error(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Admin logout function
  const adminLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Logged out successfully");
      navigate("/admin/login");
      return true;
    } catch (error: any) {
      console.error("Logout error:", error);
      toast.error(error.message || "Failed to log out");
      return false;
    }
  };

  return { 
    isAdmin, 
    isLoading, 
    user,
    adminLogin,
    adminLogout
  };
}
