import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { Form } from "@/components/ui/form";
import { validateEmail } from "@/utils/auth";
import { AccessDenied } from "@/components/orders/form/AccessDenied";
import { SalesInformation } from "@/components/orders/form/SalesInformation";
import { ProductInformation } from "@/components/orders/form/ProductInformation";
import { ProductDetails } from "@/components/orders/form/ProductDetails";
import { OrderFormContainer } from "@/components/orders/form/OrderFormContainer";
import { OrderFormFooter } from "@/components/orders/form/OrderFormFooter";
import { useOrderForm } from "@/hooks/useOrderForm";
import { useOrdersData } from "@/hooks/orders/useOrdersData";

export default function OrderForm() {
  const {
    form,
    images,
    setImages,
    isEditing,
    isLoading,
    existingImages,
    orderId,
    navigate,
    showNotification
  } = useOrderForm();

  const { refreshOrders } = useOrdersData(); // ✅ To refresh after submit
  const [isFormValid, setIsFormValid] = useState(false);

  const currentUser = {
    name: "John Doe",
    email: "john@jasonofbh.com",
  };

  const isValidUserEmail = validateEmail(currentUser.email);

  const handleCancel = () => {
    navigate("/orders");
  };

  const handleSuccess = () => {
    form.reset();           // ✅ Clear form fields
    setImages([]);          // ✅ Clear attached images
    refreshOrders();        // ✅ Refresh live order list
    navigate("/orders");    // ✅ Redirect to orders page
  };

  if (!isValidUserEmail) {
    return <AccessDenied />;
  }

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <OrderFormContainer title={isEditing ? `Edit Order ${orderId}` : "New Order"}>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(
            (data) => {
              setIsFormValid(true); // ✅ Form is valid
              console.log("Form data valid:", data);
            },
            (errors) => {
              setIsFormValid(false); // ❌ Validation failed
              console.error("Form validation errors:", errors);
              showNotification(
                "Validation Error",
                "Please fill out all required fields marked with an asterisk (*)"
              );
            }
          )}
          className="space-y-8"
        >
          <SalesInformation control={form.control} />

          <Separator className="my-8" />

          <ProductInformation control={form.control} />

          <Separator className="my-8" />

          <ProductDetails control={form.control} />

          <OrderFormFooter
            isEditing={isEditing}
            orderId={orderId}
            images={images}
            setImages={setImages}
            existingImages={existingImages}
            formData={form.getValues()}
            onCancel={handleCancel}
            onSuccess={handleSuccess}
            currentUserEmail={currentUser.email}
            currentUserName={currentUser.name}
            showNotification={showNotification}
            isFormValid={form.formState.isValid}
          />
        </form>
      </Form>
    </OrderFormContainer>
  );
}
