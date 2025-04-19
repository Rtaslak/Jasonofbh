export interface Station {
  id: string;
  name: string;
  description: string;
  orderIds: string[];
  status: 'active' | 'inactive' | 'maintenance';
}

export interface Department {
  id: number;
  name: string;
  description: string;
  color: string;
  stations: Station[];
  orders: string[]; // Order IDs assigned to this department
}

// ✅ Utility function to create a new Station
export const createStation = (
  name: string,
  description: string,
  orderIds: string[] = []
): Station => {
  return {
    id: name.toLowerCase().replace(/\s+/g, '-'),
    name,
    description,
    orderIds,
    status: 'active' // Default status
  };
};

// ✅ Utility function to create a new Department
export const createDepartment = (
  id: number,
  name: string,
  description: string,
  color: string,
  stations: Station[] = [],
  orders: string[] = []
): Department => {
  return {
    id,
    name,
    description,
    color,
    stations,
    orders
  };
};
