import { format } from "date-fns";
import { v4 as uuidv4 } from "uuid";
import { FormValues } from "./FormSchema";
import { orderService } from "@/services/orderService";

// Create a new order using real API
export const createNewOrder = async (
  data: FormValues,
  email: string,
  salesmanName: string,
  images: File[] = []
): Promise<{ id: string; orderNumber: number }> => {
  const enrichedFormData: FormValues = {
    ...data,
    clientName: data.clientName || "",
    orderDate: new Date(), // use current timestamp if not set
    salesperson: salesmanName,
  };

  try {
    const response = await orderService.createOrder(enrichedFormData, images);
    return response;
  } catch (err) {
    console.error("[ERROR] Failed to create order:", err);
    throw err;
  }
};

// Update an existing order using real API
export const updateExistingOrder = async (
  orderId: string,
  data: FormValues,
  email: string,
  images: File[] = []
): Promise<void> => {
  const enrichedFormData: FormValues = {
    ...data,
    clientName: data.clientName || "",
    updatedAt: new Date().toISOString(), // if your backend supports this
  };

  try {
    await orderService.updateOrder(orderId, enrichedFormData, images);
  } catch (err) {
    console.error(`[ERROR] Failed to update order ${orderId}:`, err);
    throw err;
  }
};

// Default due date = 3 weeks from today
export const getDefaultDueDate = (orderDate: Date = new Date()): Date => {
  const dueDate = new Date(orderDate);
  dueDate.setDate(dueDate.getDate() + 21);
  return dueDate;
};

// Format an order to pre-fill the form for editing
export const formatOrderDataForForm = (order: any): FormValues => {
  return {
    storeLocation: order.storeLocation || "",
    clientName: order.customer || "",
    orderDate: new Date(order.createdAt),
    dueDate: order.dueDate ? new Date(order.dueDate) : getDefaultDueDate(),
    designer: order.designer || "",
    serialNumber: order.serialNumber || "",
    productType: order.items?.[0] || "",
    salePrice: order.salePrice || "",
    metal: {
      primaryMetal: order.metal?.primaryMetal || "",
      secondaryMetal: order.metal?.secondaryMetal || "",
      isMultiTone: order.metal?.isMultiTone || false,
      tones: {
        yellow: order.metal?.tones?.yellow || false,
        white: order.metal?.tones?.white || false,
        rose: order.metal?.tones?.rose || false,
        black: order.metal?.tones?.black || false,
      },
    },
    stoneDetails: order.stoneDetails || "",
    additionalNotes: order.additionalNotes || "",
  };
};
