import { z } from "zod";
import { addWeeks } from "date-fns";

// 👉 Zod schema definition for the order form
export const formSchema = z.object({
  storeLocation: z.string().min(1, "Store location is required"),
  clientName: z.string().min(1, "Client name is required"),
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

  // ✅ Backend-side fields added for DB processing
  salesperson: z.string().optional(),
  updatedAt: z.string().optional(),
});

// 👉 TypeScript type inferred from Zod schema
export type FormValues = z.infer<typeof formSchema>;

// 📅 Get default due date (3 weeks from now)
export const getDefaultDueDate = (orderDate: Date = new Date()): Date => {
  return addWeeks(orderDate, 3);
};

// 🏪 Store locations used in the dropdown
export const storeLocations = [
  "Private Showroom(HQ)", 
  "Beverly Wilshire", 
  "Las Vegas", 
  "Nashville", 
  "Charlotte"
];

// 🎨 Designers (used in designer select input)
export const designers = [
  "Zach", "Kai", "Sebouh"
];

// 📦 Product types (used in product type select input)
export const productTypes = [
  "Ring", "Pendant", "Necklace", "Bracelet", "Earrings", "Chain", "Other"
];

// 🧱 Metal types (used in metal type dropdown)
export const metalTypes = [
  "10kt Gold", "14kt Gold", "18kt Gold", "22kt Gold", "24kt Gold", 
  "Platinum", "Silver", "Other"
];

// 🎨 Metal color tone options
export const metalColors = [
  "Yellow", "White", "Rose", "Black"
];

// 🟡 Used for marking required fields in the UI
export const isFieldRequired = (fieldName: string): boolean => {
  switch (fieldName) {
    case "storeLocation":
    case "designer":
    case "productType":
    case "salePrice":
    case "metal.primaryMetal":
    case "clientName":
      return true;
    default:
      return false;
  }
};
