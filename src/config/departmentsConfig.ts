
import { Department, Station, createDepartment, createStation } from "@/types/stations";

// Complete list of all departments
export const departments: Record<number, Department> = {
  1: createDepartment(
    1,
    "Designers",
    "Design department for creating custom jewelry pieces",
    "#3b82f6", // blue
    [],
    []
  ),
  2: createDepartment(
    2,
    "Jewelers",
    "Jewelers department for crafting jewelry pieces",
    "#f59e0b", // amber
    [],
    []
  ),
  3: createDepartment(
    3,
    "Setters",
    "Setters department for stone setting",
    "#10b981", // emerald
    [],
    []
  ),
  4: createDepartment(
    4,
    "Polishers",
    "Polishers department for finishing jewelry pieces",
    "#8b5cf6", // violet
    [],
    []
  ),
  5: createDepartment(
    5,
    "Diamond Counting",
    "Diamond counting department for inventory management",
    "#ec4899", // pink
    [],
    []
  ),
  6: createDepartment(
    6,
    "Shipping",
    "Shipping department for order fulfillment",
    "#6366f1", // indigo
    [],
    []
  )
};

// Department stations with empty order lists
export const departmentStations: Record<number, Station[]> = {
  1: [ // Designers
    createStation("Jed", "Creative design lead"),
    createStation("Designer 1", "Custom design specialist"),
    createStation("Designer 2", "Design technician"),
    createStation("Designer 3", "CAD specialist"),
    createStation("Diamond Couting", "Diamond inspection"),
  ],
  2: [ // Jewelers
    createStation("Roger", "Master jeweler"),
    createStation("Tro", "Gold specialist"),
    createStation("Vicken", "Platinum expert"),
    createStation("Simon", "Casting specialist"),
    createStation("Hratch", "Assembly technician"),
    createStation("Ara", "Stone setting prep"),
    createStation("Hrant", "Metals fabrication"),
    createStation("Engraving", "Custom engraving station"),
  ],
  3: [ // Setters
    createStation("Steve Tch", "Technical setting expert"),
    createStation("Steve", "Custom setting specialist"),
    createStation("Hovig", "Fine detail setter"),
    createStation("Paolo", "Precision setting specialist"),
    createStation("Sako", "Diamond setting expert"),
    createStation("Polisher", "Polishing station"),
  ],
  4: [createStation("Polisher", "Main polishing station")], // Polishers
  5: [createStation("Diamond Counting", "Inventory management")], // Diamond Counting
  6: [createStation("Shipping", "Order fulfillment")], // Shipping
};

// Departments without station subdivision
export const departmentsWithoutStations = [5, 6]; // Diamond Counting and Shipping

// Map department IDs to department names
export const departmentNameMap: Record<number, string> = {
  1: "designers",
  2: "jewelers",
  3: "setters",
  4: "polisher",
  5: "diamondCounting",
  6: "shipping"
};

// Department color mapping
export const departmentColors: Record<number, string> = {
  1: "#3b82f6", // blue
  2: "#f59e0b", // amber
  3: "#10b981", // emerald
  4: "#8b5cf6", // violet
  5: "#ec4899", // pink
  6: "#6366f1"  // indigo
};

// Reader to department mapping
export const readerToDepartmentMap = new Map<string, number>([
  ['FX96006E8F12'.toLowerCase(), 2], // Jewelers department reader
  ['Fx96006e8fB7'.toLowerCase(), 3], // Setters department reader
  ['FX96006e906c'.toLowerCase(), 1], // Designers department reader
]);

// Jewelers department antenna to station mapping
export const jewelersAntennaMap: Record<string, number> = {
  "1": 0, // Antenna 1 -> Roger (index 0)
  "2": 1, // Antenna 2 -> Tro (index 1)
  "3": 2, // Antenna 3 -> Vicken (index 2)
  "4": 3, // Antenna 4 -> Simon (index 3)
  "5": 4, // Antenna 5 -> Hratch (index 4)
  "6": 5, // Antenna 6 -> Ara (index 5)
  "7": 6, // Antenna 7 -> Hrant (index 6)
  "8": 7, // Antenna 8 -> Engraving (index 7)
};

// Setters department antenna mapping
export const settersAntennaMap: Record<string, number> = {
  "1": 0, // Antenna 1 -> Steve Tch (index 0)
  "2": 1, // Antenna 2 -> Steve (index 1)
  "3": 2, // Antenna 3 -> Hovig (index 2)
  "4": 3, // Antenna 4 -> Paolo (index 3)
  "5": 4, // Antenna 5 -> Sako (index 4)
};

// Designers department antenna mapping
export const designersAntennaMap: Record<string, number> = {
  "1": 0, // Antenna 1 -> Jed (index 0)
  "2": 1, // Antenna 2 -> Designer 1 (index 1)
  "3": 2, // Antenna 3 -> Designer 2 (index 2)
  "4": 3, // Antenna 4 -> Designer 3 (index 3)
  "5": 4, // Antenna 5 -> Diamond Couting (index 4)
};

// Department-specific antenna mappings
export const departmentAntennaMap: Record<number, Record<string, number>> = {
  1: designersAntennaMap,
  2: jewelersAntennaMap,
  3: settersAntennaMap,
};

// Special case antenna mapping (like antenna 6 on Setters reader mapping to Polishers)
export const specialCaseAntennaMap: Array<{readerId: string, antenna: string, departmentId: number}> = [
  {readerId: 'Fx96006e8fB7'.toLowerCase(), antenna: '6', departmentId: 4} // Antenna 6 on Setters reader -> Polishers
];
