
import { z } from "zod";
import { addWeeks } from "date-fns";

// Form schema definition for order form
export const formSchema = z.object({
  storeLocation: z.string().min(1, "Store location is required"),
  clientName: z.string().min(1, "Client name is required"), // Updated to be required
  orderDate: z.date(),
  dueDate: z.date().optional(),
  designer: z.string().min(1, "Designer is required"),
  serialNumber: z.string().optional(),
  productType: z.string().min(1, "Product type is required"),
  salePrice: z.string().min(1, "Sale price is required"),
  metal: z.object({
    primaryMetal: z.string().min(1, "Primary metal is required"),
    secondaryMetal: z.string().optional(),
    isMultiTone: z.boolean().default(false),
    tones: z.object({
      yellow: z.boolean().default(false),
      white: z.boolean().default(false),
      rose: z.boolean().default(false),
      black: z.boolean().default(false),
    }).optional(),
  }),
  stoneDetails: z.string().optional(),
  additionalNotes: z.string().optional(),
});

export type FormValues = z.infer<typeof formSchema>;

// Get default due date (3 weeks from today)
export const getDefaultDueDate = (orderDate: Date = new Date()): Date => {
  return addWeeks(orderDate, 3);
};

// Updated store locations
export const storeLocations = [
  "Private Showroom(HQ)", 
  "Beverly Wilshire", 
  "Las Vegas", 
  "Nashville", 
  "Charlotte"
];

export const designers = [
  "Zach", "Kai", "Sebouh"
];

export const productTypes = [
  "Ring", "Pendant", "Necklace", "Bracelet", "Earrings", "Chain", "Other"
];

export const metalTypes = [
  "10kt Gold", "14kt Gold", "18kt Gold", "22kt Gold", "24kt Gold", 
  "Platinum", "Silver", "Other"
];

// Metal color options
export const metalColors = [
  "Yellow", "White", "Rose", "Black"
];

// Required field indicator function
export const isFieldRequired = (fieldName: string): boolean => {
  switch (fieldName) {
    case "storeLocation":
    case "designer":
    case "productType":
    case "salePrice":
    case "metal.primaryMetal":
    case "clientName": // Client name is a required field
      return true;
    default:
      return false;
  }
};
