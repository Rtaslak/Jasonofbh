
import React from 'react';
import { cn } from "@/lib/utils";
import { useMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import SidebarLogo from "./sidebar/SidebarLogo";
import SidebarNavigation from "./sidebar/SidebarNavigation";
import SidebarFooter from "./sidebar/SidebarFooter";
import MobileSidebarControls from "./sidebar/MobileSidebarControls";

export default function Sidebar() {
  const { isMobile, sidebarOpen, setSidebarOpen } = useMobile();

  // If mobile and sidebar is closed, show only a toggle button
  if (isMobile && !sidebarOpen) {
    return (
      <Button 
        variant="outline" 
        size="icon" 
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => setSidebarOpen(true)}
      >
        <Menu className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <div
      className={cn(
        "fixed inset-y-0 z-50 flex h-full flex-col border-r bg-sidebar-background transition-all duration-300 ease-in-out",
        isMobile 
          ? "w-full transform transition-transform" 
          : "w-64"
      )}
    >
      <div className="flex h-14 items-center justify-between border-b px-0">
        <SidebarLogo />
        {isMobile && (
          <MobileSidebarControls onClose={() => setSidebarOpen(false)} />
        )}
      </div>

      <SidebarNavigation />
      <SidebarFooter />
    </div>
  );
}
