import { useState, useEffect } from 'react';
import { apiClient } from '@/utils/api'; // Your real API client

// Define the types for Department and Station
interface Station {
  id: number;
  readerId: string;
  orderIds: string[];
}

interface Department {
  id: number;
  name: string;
  stations: Station[];
}

// Fetch departments and their stations
export function useDepartmentData() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await apiClient.get<Department[]>('/api/departments'); // Fetch from your API
        setDepartments(response); // Real data from the backend
      } catch (error) {
        console.error('Error fetching departments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  return { departments, loading };
}
