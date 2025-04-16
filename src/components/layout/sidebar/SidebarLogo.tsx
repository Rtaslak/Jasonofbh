
import React from "react";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";

export default function SidebarLogo() {
  const { theme } = useTheme();
  
  return (
    <div className="flex w-full items-center justify-center py-3 relative">
      <div className="absolute top-1/2 left-0 w-5 h-0.5 -translate-y-1/2 bg-red-600"></div>
      <div className="absolute top-1/2 right-0 w-5 h-0.5 -translate-y-1/2 bg-red-600"></div>
      
      <img 
        src="/lovable-uploads/330c2dc5-e050-4833-853c-8edf67b3daaf.png" 
        alt="Jason of Beverly Hills" 
        className={cn(
          "h-8 w-auto px-2",
          theme === "dark" ? "brightness-0 invert" : "brightness-0"
        )}
      />
    </div>
  );
}
