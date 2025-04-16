
import { Button } from "@/components/ui/button";
import { OrderFormSubmit } from "./OrderFormSubmit";
import { FormValues } from "./FormSchema";

interface OrderFormButtonGroupProps {
  isEditing: boolean;
  orderId?: string;
  data: FormValues;
  images: File[];
  onCancel: () => void;
  onSuccess: () => void;
  currentUserEmail: string;
  currentUserName: string;
  showNotification: (title: string, message: string) => void;
  isFormValid: boolean; // Added form validation status prop
}

export function OrderFormButtonGroup({
  isEditing,
  orderId,
  data,
  images,
  onCancel,
  onSuccess,
  currentUserEmail,
  currentUserName,
  showNotification,
  isFormValid // Add this prop to check form validation
}: OrderFormButtonGroupProps) {
  return (
    <div className="flex space-x-4">
      <Button 
        type="button" 
        variant="destructive" 
        onClick={onCancel} 
        className="w-full sm:w-auto"
      >
        Cancel
      </Button>
      <OrderFormSubmit
        isEditing={isEditing}
        orderId={orderId}
        data={data}
        images={images}
        currentUserEmail={currentUserEmail}
        currentUserName={currentUserName}
        onSuccess={onSuccess}
        showNotification={showNotification}
        isFormValid={isFormValid}
      />
    </div>
  );
}
