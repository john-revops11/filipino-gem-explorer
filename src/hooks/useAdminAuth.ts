
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "@/services/firebase";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { toast } from "sonner";

export function useAdminAuth() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
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
        if (window.location.pathname.startsWith('/admin')) {
          toast.error("You must be logged in to access the admin dashboard");
          navigate("/");
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
      toast.success("Logged in successfully");
      return true;
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(error.message || "Failed to log in");
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
      navigate("/");
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
