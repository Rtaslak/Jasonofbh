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
    if (images.length > 0) {
      const formDataWithFiles = new FormData();

      formDataWithFiles.append('orderData', JSON.stringify(formData));

      images.forEach((image, index) => {
        formDataWithFiles.append(`image-${index}`, image);
      });

      return apiClient.post<Order>("orders", formDataWithFiles, {
        headers: {
          // Let browser set content-type (multipart/form-data)
        }
      });
    }

    // ✅ No images: send plain JSON
    return apiClient.post<Order>("orders", formData);
  },

  /**
   * Update an existing order
   */
  updateOrder: async (id: string, formData: FormValues, images: File[] = []): Promise<Order> => {
    if (images.length > 0) {
      const formDataWithFiles = new FormData();

      formDataWithFiles.append('orderData', JSON.stringify(formData));

      images.forEach((image, index) => {
        formDataWithFiles.append(`image-${index}`, image);
      });

      return apiClient.put<Order>(`orders/${id}`, formDataWithFiles, {
        headers: {
          // Let browser set content-type
        }
      });
    }

    // ✅ No images: send plain JSON
    return apiClient.put<Order>(`orders/${id}`, formData);
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

    return apiClient.post<Order>(`orders/${orderId}/images`, formData);
  },

  /**
   * Delete an image from an order
   */
  deleteOrderImage: async (orderId: string, imageId: string): Promise<void> => {
    return apiClient.delete<void>(`orders/${orderId}/images/${imageId}`);
  }
};
