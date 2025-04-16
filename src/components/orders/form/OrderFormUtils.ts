
import { format } from "date-fns";
import { FormValues } from "./FormSchema";
import { orders, saveOrdersToLocalStorage, getNextOrderNumber } from "@/utils/orders/orderStorage";
import { v4 as uuidv4 } from "uuid";
import { Order } from "@/types/orders";
import { orderService } from "@/services/orderService";

// Function to create a new order with the form data
export const createNewOrder = (
  data: FormValues, 
  email: string, 
  salesmanName: string,
  images: File[] = []
): string => {
  // Generate a unique ID for the new order
  const orderId = getNextOrderNumber();
  
  // Create timestamp for the order
  const timestamp = new Date().toISOString();
  
  // Prepare the new order object with proper typing
  const newOrder: Order = {
    id: orderId,
    status: "new", // Explicitly using the literal type "new"
    customer: data.clientName || "",
    email: email,
    createdAt: timestamp,
    updatedAt: timestamp,
    items: [data.productType],
    storeLocation: data.storeLocation,
    designer: data.designer,
    serialNumber: data.serialNumber,
    salePrice: data.salePrice,
    salesperson: salesmanName, // Add salesperson field
    metal: {
      primaryMetal: data.metal.primaryMetal || "", 
      secondaryMetal: data.metal.secondaryMetal,
      isMultiTone: data.metal.isMultiTone || false, 
      tones: {
        yellow: data.metal.tones?.yellow || false, 
        white: data.metal.tones?.white || false,
        rose: data.metal.tones?.rose || false,
        black: data.metal.tones?.black || false
      }
    },
    stoneDetails: data.stoneDetails,
    additionalNotes: data.additionalNotes,
    dueDate: data.dueDate?.toISOString(),
    images: images.map(image => ({
      id: uuidv4(),
      name: image.name,
      type: image.type,
      size: image.size,
      lastModified: image.lastModified,
      dataUrl: URL.createObjectURL(image) 
    }))
  };
  
  console.log("Creating new order:", newOrder);
  
  // Add the new order to the mock orders array
  orders.push(newOrder);
  
  // Save orders to localStorage
  saveOrdersToLocalStorage();
  
  return orderId;
};

// Function to update an existing order
export const updateExistingOrder = (
  orderId: string, 
  data: FormValues, 
  email: string,
  images: File[] = []
): void => {
  // Find the index of the order in the orders array
  const orderIndex = orders.findIndex(order => order.id === orderId);
  
  if (orderIndex !== -1) {
    // Get current order status and salesperson to maintain them
    const currentStatus = orders[orderIndex].status;
    const currentSalesperson = orders[orderIndex].salesperson;
    
    // Preserve existing images and add new ones
    const existingImages = orders[orderIndex].images || [];
    
    // Convert new File objects to image metadata
    const newImages = images.map(image => ({
      id: uuidv4(),
      name: image.name,
      type: image.type,
      size: image.size,
      lastModified: image.lastModified,
      dataUrl: URL.createObjectURL(image)
    }));
    
    // Update the order with the new data
    orders[orderIndex] = {
      ...orders[orderIndex],
      customer: data.clientName || "",
      email: email,
      updatedAt: new Date().toISOString(),
      items: [data.productType],
      status: currentStatus, // Maintain the existing status
      storeLocation: data.storeLocation,
      designer: data.designer,
      serialNumber: data.serialNumber,
      salePrice: data.salePrice,
      salesperson: currentSalesperson, // Maintain existing salesperson
      metal: {
        primaryMetal: data.metal.primaryMetal || "",
        secondaryMetal: data.metal.secondaryMetal,
        isMultiTone: data.metal.isMultiTone || false,
        tones: {
          yellow: data.metal.tones?.yellow || false,
          white: data.metal.tones?.white || false,
          rose: data.metal.tones?.rose || false,
          black: data.metal.tones?.black || false
        }
      },
      stoneDetails: data.stoneDetails,
      additionalNotes: data.additionalNotes,
      dueDate: data.dueDate?.toISOString(),
      // Combine existing and new images
      images: [...existingImages, ...newImages]
    };
    
    // Save orders to localStorage
    saveOrdersToLocalStorage();
  }
};

// Get default due date (3 weeks from today)
export const getDefaultDueDate = (orderDate: Date = new Date()): Date => {
  const dueDate = new Date(orderDate);
  dueDate.setDate(dueDate.getDate() + 21); // Add 21 days (3 weeks)
  return dueDate;
};

// Function to format order data for the form
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
        black: order.metal?.tones?.black || false
      }
    },
    stoneDetails: order.stoneDetails || "",
    additionalNotes: order.additionalNotes || "",
  };
};
