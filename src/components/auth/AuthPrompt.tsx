
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AlertTriangle, Lock, User } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface AuthPromptProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  action?: string;
}

export function AuthPrompt({
  isOpen,
  onClose,
  title = "Login Required",
  description = "You need to be logged in to access this feature.",
  action = "Log in"
}: AuthPromptProps) {
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleLogin = () => {
    navigate('/login', { state: { from: location.pathname } });
    onClose();
  };
  
  const handleSignup = () => {
    navigate('/signup', { state: { from: location.pathname } });
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 mb-4">
            <Lock className="h-6 w-6 text-amber-600" />
          </div>
          <DialogTitle className="text-center">{title}</DialogTitle>
          <DialogDescription className="text-center">
            {description}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <Button 
            className="w-full bg-filipino-forest hover:bg-filipino-forest/90"
            onClick={handleLogin}
          >
            {action}
          </Button>
          <div className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Button 
              variant="link" 
              className="px-0 text-filipino-goldenrod"
              onClick={handleSignup}
            >
              Create one
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
