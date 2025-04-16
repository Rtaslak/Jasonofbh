import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { navigationItems } from '@/config/navigation';
import { useAuthUser } from '@/hooks/useAuth';
import { usePathname } from '@/hooks/usePathname';
import { UserRole } from '@/types/users';

export default function SidebarNavigation() {
  const { user } = useAuthUser();
  const pathname = usePathname();

  function normalizeRole(role: string | undefined): UserRole {
    if (!role) return 'Administrator'; // default
    const roleMap = {
      admin: 'Administrator',
      administrator: 'Administrator',
      operator: 'Operator',
      salesperson: 'Salesperson',
      salesman: 'Salesperson'
    };
  
    return roleMap[role.toLowerCase()] as UserRole || 'Administrator';
  }
  
  
  // Use a type-safe role or default to a safer fallback
  const userRole = normalizeRole(user?.role);

  
  // Filter navigation items based on user role
  const navItems = navigationItems.filter(item => {
    // If no roles specified, show to everyone
    if (!item.requiredRoles) return true;
    
    // Otherwise, check if user's role is in the allowed roles
    return item.requiredRoles.includes(userRole);
  });

  return (
    <div className="space-y-1 py-2">
      {navItems.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
        
        return (
          <NavLink
            key={item.href}
            to={item.href}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:text-primary',
                isActive ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground'
              )
            }
          >
            {item.icon && React.createElement(item.icon, { className: 'h-4 w-4' })}
            {item.name}
          </NavLink>
        );
      })}
    </div>
  );
}
