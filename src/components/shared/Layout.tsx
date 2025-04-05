
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
        <div className="max-w-full mx-auto">
          {children}
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
