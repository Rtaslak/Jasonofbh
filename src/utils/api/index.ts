import { apiRequest } from "./requestHandler";
import { FetchOptions } from "./types";

// ✅ Clean API client: only real backend calls
export const apiClient = {
  /**
   * Make a GET request to the API
   */
  async get<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
    return apiRequest<T>(endpoint, { 
      ...options, 
      method: "GET"
    });
  },

  /**
   * Make a POST request to the API
   */
  async post<T>(endpoint: string, data: any, options: FetchOptions = {}): Promise<T> {
    return apiRequest<T>(endpoint, {
      ...options,
      method: "POST",
      body: JSON.stringify(data)
    });
  },

  /**
   * Make a PUT request to the API
   */
  async put<T>(endpoint: string, data: any, options: FetchOptions = {}): Promise<T> {
    return apiRequest<T>(endpoint, {
      ...options,
      method: "PUT",
      body: JSON.stringify(data)
    });
  },

  /**
   * Make a DELETE request to the API
   */
  async delete<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
    return apiRequest<T>(endpoint, { 
      ...options, 
      method: "DELETE"
    });
  }
};