
import { useState, useEffect } from 'react';

export type User = {
  id: string;
  email: string;
  name: string;
  role: 'User' | 'Administrator' | 'Operator' | 'Salesperson'; 
};

export function useAuthUser() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if a user is stored in localStorage
    const storedUser = localStorage.getItem('currentUser');
    
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsLoading(false);
        return;
      } catch (error) {
        console.error('Error parsing stored user:', error);
      }
    }
    
    // If no stored user is found, use the admin mock user
    const mockUser: User = {
      id: '1',
      email: 'admin@jasonofbh.com',
      name: 'Admin User',
      role: 'Administrator',
    };
    
    // Store the mock user to localStorage
    localStorage.setItem('currentUser', JSON.stringify(mockUser));
    
    setUser(mockUser);
    setIsLoading(false);
  }, []);

  // Function to switch between test user roles
  const switchToRole = (role: 'Administrator' | 'Operator' | 'Salesperson') => {
    let newUser: User;
    
    switch (role) {
      case 'Administrator':
        newUser = {
          id: '1',
          email: 'admin@jasonofbh.com',
          name: 'Admin User',
          role: 'Administrator',
        };
        break;
      case 'Operator':
        newUser = {
          id: '2',
          email: 'operator@jasonofbh.com',
          name: 'Operator User',
          role: 'Operator',
        };
        break;
      case 'Salesperson':
        newUser = {
          id: '3',
          email: 'sales@jasonofbh.com',
          name: 'Sales User',
          role: 'Salesperson',
        };
        break;
    }
    
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    setUser(newUser);
    
    // Refresh the page to apply the new role's permissions
    window.location.reload();
  };

  return { user, isLoading, switchToRole };
}
