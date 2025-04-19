import React from 'react';
import { cn } from "@/lib/utils";
import { useMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import SidebarNavigation from "./sidebar/SidebarNavigation";
import { SidebarFooter } from './sidebar/SidebarFooter';
import MobileSidebarControls from "./sidebar/MobileSidebarControls";

export default function Sidebar() {
  const { isMobile, sidebarOpen, setSidebarOpen } = useMobile();

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
        "fixed top-14 z-40 flex h-[calc(100vh-56px)] flex-col justify-between border-r bg-sidebar-background transition-all duration-300 ease-in-out",
        isMobile 
          ? "w-full transform transition-transform" 
          : "w-64"
      )}
    >
      <div className="pt-4"> {/* Add padding to space under header */}
        <SidebarNavigation />
      </div>
      <SidebarFooter />
    </div>
  );
}
