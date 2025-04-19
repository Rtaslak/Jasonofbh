
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";
import { useNotifications } from "@/context/NotificationContext";
import { formSchema, FormValues } from "@/components/orders/form/FormSchema";
import { 
  formatOrderDataForForm, 
  getDefaultDueDate 
} from "@/components/orders/form/OrderFormUtils";

export const useOrderForm = () => {
  const [images, setImages] = useState<File[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [existingImages, setExistingImages] = useState<any[]>([]);
  const navigate = useNavigate();
  const { orderId } = useParams();
  const { showNotification } = useNotifications();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      storeLocation: "",
      clientName: "",
      orderDate: new Date(),
      dueDate: getDefaultDueDate(),
      designer: "",
      serialNumber: "",
      productType: "",
      salePrice: "",
      metal: {
        primaryMetal: "",
        secondaryMetal: "",
        isMultiTone: false,
        tones: {
          yellow: false,
          white: false,
          rose: false,
          black: false
        }
      },
      stoneDetails: "",
      additionalNotes: "",
    },
  });

  useEffect(() => {
    if (orderId) {
      const order = orders.find(order => order.id === orderId);
      if (order) {
        setIsEditing(true);
        setCurrentOrder(order);
        
        try {
          // Use the improved formatOrderDataForForm function to properly format all fields
          const formattedData = formatOrderDataForForm(order);
          console.log("Formatted order data for form:", formattedData);
          form.reset(formattedData);
          
          // Handle images if they exist in the order
          if (order.images && Array.isArray(order.images) && order.images.length > 0) {
            console.log("Order has images:", order.images.length);
            setExistingImages(order.images);
          }
        } catch (error) {
          console.error("Error formatting order data:", error);
          // Fallback to default values if there's an error
          form.reset({
            storeLocation: order.storeLocation || "",
            clientName: order.customer || "",
            orderDate: new Date(),
            dueDate: getDefaultDueDate(),
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
          });
        }
      }
    }
    setIsLoading(false);
  }, [orderId, form]);

  return {
    form,
    images,
    setImages,
    isEditing,
    currentOrder,
    isLoading,
    existingImages,
    setExistingImages,
    orderId,
    navigate,
    showNotification
  };
};
