// src/utils/orders/departmentManagement.ts

import { useState, useEffect } from 'react';
import { apiClient } from '@/utils/api';
import { Order } from '@/types/orders';

export interface Station {
  id: number;
  name: string;
  description?: string;
  antennaNumber?: number;
  departmentId: number;
}

export interface Department {
  id: number;
  name: string;
  description?: string;
  color?: string;
  stations: Station[];
  orders: Order[]; // 👈 Add this if you're mapping orders to department
}

export function useDepartmentData() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await apiClient.get<Department[]>('/departments'); // ✅ Ensure the route is correct
        setDepartments(response);
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
