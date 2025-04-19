export type Order = {
  id: string;
  orderNumber: number;
  customer: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  status: "new" | "in-progress" | "completed";
  items: string[];
  isEditing?: boolean;
  tagId?: string;
  lastSeen?: number;

  // Additional fields...
  storeLocation?: string;
  designer?: string;
  serialNumber?: string;
  salePrice?: string;
  salesperson?: string;
  metal?: {
    primaryMetal: string;
    secondaryMetal?: string;
    isMultiTone?: boolean;
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
    dataUrl?: string;
  }>;

  departmentId?: number;
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

  // ✅ Add this to support station-based filtering
  station?: string;
};
