
import React from "react";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex justify-center items-center flex-col py-12 px-4 text-center">
      <div className="w-24 h-24 bg-filipino-sand/30 rounded-full flex items-center justify-center mb-4">
        <Icon className="h-12 w-12 text-filipino-terracotta" />
      </div>
      <h3 className="text-xl font-medium mb-2 text-filipino-darkGray">{title}</h3>
      <p className="text-muted-foreground text-center mb-6 max-w-md">
        {description}
      </p>
      {action}
    </div>
  );
}
