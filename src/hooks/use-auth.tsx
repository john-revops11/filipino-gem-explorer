
import { useState, useEffect, createContext, useContext } from "react";
import { auth, firestore } from "@/services/firebase";
import { User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

// Create auth context with additional user data
interface AuthContextType {
  user: User | null;
  loading: boolean;
  userProfile: UserProfile | null;
  requireAuth: (redirectPath?: string) => boolean;
}

interface UserProfile {
  isAdmin: boolean;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  createdAt: any;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  userProfile: null,
  requireAuth: () => false
});

// Auth provider component to wrap the app
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  
  // Function to check if user is authenticated and redirect if not
  const requireAuth = (redirectPath?: string): boolean => {
    // If page is requiring auth and user is not logged in
    if (!user) {
      if (redirectPath) {
        // Navigate programmatically
        window.location.href = `/login?redirect=${encodeURIComponent(redirectPath)}`;
      }
      return false;
    }
    return true;
  };

  useEffect(() => {
    // Set up auth state listener
    const unsubscribe = auth.onAuthStateChanged(async (authUser) => {
      setUser(authUser);
      
      if (authUser) {
        try {
          // Get additional user data from Firestore
          const userDoc = await getDoc(doc(firestore, "users", authUser.uid));
          if (userDoc.exists()) {
            setUserProfile(userDoc.data() as UserProfile);
          } else {
            setUserProfile({
              isAdmin: false,
              displayName: authUser.displayName,
              email: authUser.email,
              photoURL: authUser.photoURL,
              createdAt: null
            });
          }
        } catch (error) {
          console.error("Error getting user profile:", error);
        }
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });
    
    // Clean up subscription
    return () => unsubscribe();
  }, []);

  const value = {
    user,
    loading,
    userProfile,
    requireAuth
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use auth context
export function useAuth() {
  return useContext(AuthContext);
}
