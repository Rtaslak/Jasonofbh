// src/components/layout/AppLayout.tsx
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import { useMobile } from "@/hooks/use-mobile";

interface AppLayoutProps {
  onLogout: () => void;
}


export default function AppLayout({ onLogout }: AppLayoutProps) {
  const { isMobile } = useMobile();

  return (
    <div className="flex flex-col h-screen w-full bg-background overflow-hidden">
      {/* ✅ Make Header appear above everything */}
      <Header onLogout={onLogout} />

      <div className="flex flex-1 min-h-0">
        {/* Sidebar (beneath header) */}
        <Sidebar />

        <div className={`flex flex-col flex-1 ${isMobile ? "ml-0" : "md:ml-64"}`}>
          <main className="flex-1 overflow-auto p-6">
            <Outlet />
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
}
