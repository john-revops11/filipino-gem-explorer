
import { ReactNode } from "react";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow overflow-x-hidden">
        <div className="container mx-auto px-4 sm:px-6 py-4 max-w-full text-contained">
          {children}
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
