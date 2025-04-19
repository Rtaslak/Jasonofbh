import React from 'react';
import { LogOut, User } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import ThemeToggle from '@/components/ui/ThemeToggle';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Header: React.FC = () => {
  const { theme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const isDarkMode = theme === 'dark';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="glass-panel w-full sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center">
        <div className="flex items-center">
          {/* Red lines */}
          <div className="h-px w-6 bg-[#ea384c] mr-2"></div>
          <div className="h-6">
            <img 
              src="/lovable-uploads/f8290759-5240-4eaa-9f3f-be9acd4ebbb7.png" 
              alt="Jason of Beverly Hills" 
              className={`h-full object-contain ${isDarkMode ? 'brightness-0 invert' : 'brightness-0'}`}
            />
          </div>
          <div className="h-px w-6 bg-[#ea384c] ml-2"></div>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <ThemeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <User className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{user?.email || 'User'}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};

export default Header;
