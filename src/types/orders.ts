
export type Order = {
  id: string;
  customer: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  status: "new" | "in-progress" | "completed";
  items: string[];
  isEditing?: boolean;
  tagId?: string;
  lastSeen?: number; // Timestamp when the tag was last scanned
  
  // Additional fields for detailed order information
  storeLocation?: string;
  designer?: string;
  serialNumber?: string;
  salePrice?: string;
  salesperson?: string;
  metal?: {
    primaryMetal: string;
    secondaryMetal?: string;
    isMultiTone?: boolean; // Made optional since we're not using the toggle
    tones: {
      yellow: boolean;
      white: boolean;
      rose: boolean;
      black: boolean;
    };
  };
  stoneDetails?: string;
  additionalNotes?: string;
  dueDate?: string;
  images?: Array<{
    id: string;
    name: string;
    type: string;
    size: number;
    lastModified: number;
    dataUrl?: string; // Added dataUrl for displaying images
  }>;
  
  departmentId?: number; // Add departmentId to Order type
  
  departmentStatus?: {
    designers: boolean;
    jewelers: boolean;
    diamondCounting: boolean;
    setters: boolean;
    polisher: boolean;
    shipping: boolean;
  };
  departmentTransitions?: Array<{
    department: string;
    timestamp: number;
  }>;
};
