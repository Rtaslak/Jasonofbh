
import React from 'react';
import { useTheme } from "@/context/ThemeContext";
import ThemeToggle from "@/components/ui/ThemeToggle";
import HeaderProfile from "./header/HeaderProfile";

interface HeaderProps {
  onLogout: () => void;
}

export default function Header({ onLogout }: HeaderProps) {
  const { theme } = useTheme();

  return (
    <nav className="sticky top-0 z-30 w-full border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="flex h-14 w-full items-center justify-between px-6 py-4">
        <div className="flex-1">
          {/* Left section */}
        </div>
        
        <div className="flex items-center space-x-2">
          <ThemeToggle />
          <HeaderProfile onLogout={onLogout} />
        </div>
      </div>
    </nav>
  );
}
