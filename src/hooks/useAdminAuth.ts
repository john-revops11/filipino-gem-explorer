
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "@/services/firebase";
import { toast } from "sonner";

export function useAdminAuth() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Basic admin check - in a real app, use proper role-based auth
    const checkAdmin = async () => {
      setIsLoading(true);
      const user = auth.currentUser;
      
      // For development purposes, allow easy access - remove in production
      if (process.env.NODE_ENV === 'development') {
        console.log('Development mode: Bypassing admin check');
        setIsAdmin(true);
        setIsLoading(false);
        return;
      }
      
      // Simple admin check based on email - replace with proper role check
      // In production, this should be done with custom claims or a roles table
      if (user && (user.email === "admin@example.com" || user.uid === "system")) {
        setIsAdmin(true);
      } else {
        // Redirect non-admins to home
        toast.error("Admin access required");
        navigate("/");
      }
      setIsLoading(false);
    };

    checkAdmin();
  }, [navigate]);

  return { isAdmin, isLoading };
}
