import { apiClient } from "@/utils/api";
import { Order } from "@/types/orders";
import { FormValues } from "@/components/orders/form/FormSchema";

export const orderService = {
  /**
   * Get all orders
   */
  getAllOrders: async (): Promise<Order[]> => {
    return apiClient.get<Order[]>("orders");
  },

  /**
   * Get an order by ID
   */
  getOrderById: async (id: string): Promise<Order> => {
    return apiClient.get<Order>(`orders/${id}`);
  },

  /**
   * Create a new order with form data and images
   */
  createOrder: async (formData: FormValues, images: File[] = []): Promise<Order> => {
    // If there are images, we need to use FormData instead of JSON
    if (images.length > 0) {
      const formDataWithFiles = new FormData();
      
      // Add form data as JSON
      formDataWithFiles.append('orderData', JSON.stringify(formData));
      
      // Add each image to the FormData
      images.forEach((image, index) => {
        formDataWithFiles.append(`image-${index}`, image);
      });
      
      // Custom request with FormData
      return apiClient.post<Order>("orders", formDataWithFiles, {
        headers: {
          // Don't set content-type with FormData, browser will set it with boundary
        }
      });
    }
    
    // No images, just send JSON
    return apiClient.post<Order>("orders", { 
      orderData: formData 
    });
  },

  /**
   * Update an existing order
   */
  updateOrder: async (id: string, formData: FormValues, images: File[] = []): Promise<Order> => {
    // If there are images, we need to use FormData instead of JSON
    if (images.length > 0) {
      const formDataWithFiles = new FormData();
      
      // Add form data as JSON
      formDataWithFiles.append('orderData', JSON.stringify(formData));
      
      // Add each image to the FormData
      images.forEach((image, index) => {
        formDataWithFiles.append(`image-${index}`, image);
      });
      
      // Custom request with FormData
      return apiClient.put<Order>(`orders/${id}`, formDataWithFiles, {
        headers: {
          // Don't set content-type with FormData, browser will set it with boundary
        }
      });
    }
    
    // No images, just send JSON
    return apiClient.put<Order>(`orders/${id}`, { 
      orderData: formData 
    });
  },

  /**
   * Delete an order by ID
   */
  deleteOrder: async (id: string): Promise<void> => {
    return apiClient.delete<void>(`orders/${id}`);
  },

  /**
   * Update order status
   */
  updateOrderStatus: async (id: string, status: Order['status']): Promise<Order> => {
    return apiClient.put<Order>(`orders/${id}/status`, { status });
  },

  /**
   * Upload images to an existing order
   */
  uploadOrderImages: async (orderId: string, images: File[]): Promise<Order> => {
    const formData = new FormData();
    
    images.forEach((image, index) => {
      formData.append(`image-${index}`, image);
    });
    
    return apiClient.post<Order>(`orders/${orderId}/images`, formData, {
      headers: {
        // Don't set content-type with FormData, browser will set it with boundary
      }
    });
  },

  /**
   * Delete an image from an order
   */
  deleteOrderImage: async (orderId: string, imageId: string): Promise<void> => {
    return apiClient.delete<void>(`orders/${orderId}/images/${imageId}`);
  }
};
