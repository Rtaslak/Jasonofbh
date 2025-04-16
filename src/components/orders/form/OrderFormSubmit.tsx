
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FormValues } from "./FormSchema";
import { createNewOrder, updateExistingOrder } from "./OrderFormUtils";

interface OrderFormSubmitProps {
  isEditing: boolean;
  orderId?: string;
  data: FormValues;
  images: File[];
  currentUserEmail: string;
  currentUserName: string;
  onSuccess: () => void;
  showNotification: (title: string, message: string) => void;
  isFormValid: boolean;
}

export function OrderFormSubmit({
  isEditing,
  orderId,
  data,
  images,
  currentUserEmail,
  currentUserName,
  onSuccess,
  showNotification,
  isFormValid
}: OrderFormSubmitProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    // Only proceed if the form is valid
    if (!isFormValid) {
      showNotification(
        "Validation Error", 
        "Please fill out all required fields marked with an asterisk (*)"
      );
      return;
    }
    
    // Set submitting state to show loading indicator
    setIsSubmitting(true);
    
    try {
      // Use setTimeout to prevent UI freezing during order processing
      setTimeout(() => {
        if (isEditing && orderId) {
          // Include images in the order update
          updateExistingOrder(orderId, data, currentUserEmail, images);
          showNotification(
            "Order Updated", 
            `Order #${orderId} has been successfully updated.`
          );
        } else {
          // Include images in the new order
          const newOrderId = createNewOrder(data, currentUserEmail, currentUserName, images);
          showNotification(
            "New Order Submitted", 
            `Order #${newOrderId} has been successfully created.`
          );
        }
        
        // Reset submitting state
        setIsSubmitting(false);
        onSuccess();
      }, 50);
    } catch (error) {
      console.error("Error submitting order:", error);
      showNotification(
        "Submission Error",
        "There was a problem submitting your order. Please try again."
      );
      setIsSubmitting(false);
    }
  };
  
  return (
    <Button 
      type="button" 
      onClick={handleSubmit}
      className="w-full sm:w-auto"
      disabled={isSubmitting}
    >
      {isSubmitting 
        ? "Processing..." 
        : (isEditing ? "Update Order" : "Submit Order")}
    </Button>
  );
}
