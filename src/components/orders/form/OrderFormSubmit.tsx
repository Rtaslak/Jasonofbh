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

interface CreatedOrderResponse {
  id: string;
  orderNumber: number;
  [key: string]: any;
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

  const handleSubmit = async () => {
    if (!isFormValid) {
      showNotification(
        "Validation Error", 
        "Please fill out all required fields marked with an asterisk (*)"
      );
      return;
    }

    setIsSubmitting(true);

    try {
      if (isEditing && orderId) {
        await updateExistingOrder(orderId, data, currentUserEmail, images);
        showNotification(
          "Order Updated", 
          `Order ${orderId} has been successfully updated.`
        );
      } else {
        const newOrder: CreatedOrderResponse = await createNewOrder(
          data,
          currentUserEmail,
          currentUserName,
          images
        );

        const displayNumber = newOrder?.orderNumber ?? "unknown";

        showNotification(
          "New Order Submitted", 
          `Order ${displayNumber} has been successfully created.`
        );
      }

      onSuccess();
    } catch (error) {
      console.error("Error submitting order:", error);
      showNotification(
        "Submission Error",
        "There was a problem submitting your order. Please try again."
      );
    } finally {
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
