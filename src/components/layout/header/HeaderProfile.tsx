
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User } from 'lucide-react';
import { Avatar } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel,
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "@/context/ThemeContext";
import { authService, AuthUser } from "@/services/auth";
import { Badge } from "@/components/ui/badge";

interface HeaderProfileProps {
  onLogout: () => void;
}

export default function HeaderProfile({ onLogout }: HeaderProfileProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { theme } = useTheme();
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const userJson = localStorage.getItem("currentUser");
    if (userJson) {
      try {
        setCurrentUser(JSON.parse(userJson));
      } catch (e) {
        console.error("Error parsing stored user data:", e);
      }
    }
  }, []);

  const handleLogout = async () => {
    try {
      await authService.logout();
      
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
      
      onLogout();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        variant: "destructive",
        title: "Logout failed",
        description: "There was a problem logging out.",
      });
    }
  };

  const getInitials = () => {
    if (!currentUser?.name) return "JBH";
    
    const nameParts = currentUser.name.split(" ");
    if (nameParts.length >= 2) {
      return `${nameParts[0][0]}${nameParts[1][0]}`;
    }
    return nameParts[0].substring(0, 2).toUpperCase();
  };

  const getRoleBadgeVariant = () => {
    switch (currentUser?.role) {
      case 'Administrator':
        return 'destructive';
      case 'Operator':
        return 'default';
      case 'Salesperson':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8 bg-white dark:bg-background flex items-center justify-center">
            <div className="flex items-center justify-center w-full h-full text-muted-foreground dark:text-foreground">
              <User size={20} strokeWidth={1.5} className="dark:stroke-white" />
            </div>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{currentUser?.name || "Guest User"}</p>
            <p className="text-xs leading-none text-muted-foreground">{currentUser?.email || "Not signed in"}</p>
            {currentUser?.role && (
              <Badge variant={getRoleBadgeVariant()} className="mt-1 self-start">
                {currentUser.role}
              </Badge>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate("/profile")}>Profile</DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate("/settings")}>Settings</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
