
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

// Add a helper function to create a station object
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
    status: 'active'
  };
};

// Add a helper function to create a department object
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
