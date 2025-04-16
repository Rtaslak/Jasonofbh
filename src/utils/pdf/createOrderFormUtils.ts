
import { FormValues } from "@/components/orders/form/FormSchema";
import { Order } from "@/types/orders";

// Function to include salesperson info when creating/formatting orders
export const includeSalespersonInfo = (order: Order, salesmanName: string): Order => {
  return {
    ...order,
    salesperson: salesmanName || "Not specified"
  };
};
