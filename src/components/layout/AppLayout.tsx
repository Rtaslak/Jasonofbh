
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import { useMobile } from "@/hooks/use-mobile";

interface AppLayoutProps {
  onLogout: () => void;
}

export default function AppLayout({ onLogout }: AppLayoutProps) {
  const { isMobile, sidebarOpen } = useMobile();
  
  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <Sidebar />
      <div className={`flex flex-col flex-1 ${isMobile ? "ml-0" : "md:ml-64"}`}>
        <Header onLogout={onLogout} />
        <main className="flex-1 overflow-auto p-0">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}
