
import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function AdminAccessRestricted() {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col items-center justify-center h-[70vh] text-center p-4">
      <Shield className="h-16 w-16 text-filipino-terracotta mb-4" />
      <h1 className="text-2xl font-bold mb-2">Admin Access Required</h1>
      <p className="text-muted-foreground mb-4">
        You don't have permission to access this area.
      </p>
      <Button onClick={() => navigate("/")} variant="default">
        Return to Home
      </Button>
    </div>
  );
}
