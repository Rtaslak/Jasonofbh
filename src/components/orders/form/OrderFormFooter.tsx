
import { OrderFormActions } from "./OrderFormActions";
import { OrderFormButtonGroup } from "./OrderFormButtonGroup";
import { FormValues } from "./FormSchema";

interface OrderFormFooterProps {
  isEditing: boolean;
  orderId?: string;
  images: File[];
  setImages: (images: File[]) => void;
  existingImages: any[];
  formData: FormValues;
  onCancel: () => void;
  onSuccess: () => void;
  currentUserEmail: string;
  currentUserName: string;
  showNotification: (title: string, message: string) => void;
  isFormValid: boolean; // Added form validation status prop
}

export function OrderFormFooter({
  isEditing,
  orderId,
  images,
  setImages,
  existingImages,
  formData,
  onCancel,
  onSuccess,
  currentUserEmail,
  currentUserName,
  showNotification,
  isFormValid // Add this prop to check form validation
}: OrderFormFooterProps) {
  return (
    <div className="flex items-center justify-between mt-8">
      <OrderFormActions 
        isEditing={isEditing} 
        images={images} 
        setImages={setImages}
        existingImages={existingImages}
      />
      <OrderFormButtonGroup
        isEditing={isEditing}
        orderId={orderId}
        data={formData}
        images={images}
        onCancel={onCancel}
        onSuccess={onSuccess}
        currentUserEmail={currentUserEmail}
        currentUserName={currentUserName}
        showNotification={showNotification}
        isFormValid={isFormValid}
      />
    </div>
  );
}
