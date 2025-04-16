
import React from "react";
import { ImageUploader } from "./ImageUploader";

interface OrderFormActionsProps {
  isEditing: boolean;
  images: File[];
  setImages: (images: File[]) => void;
  existingImages?: any[]; // Support for existing images
}

export function OrderFormActions({ isEditing, images, setImages, existingImages = [] }: OrderFormActionsProps) {
  return (
    <div>
      <ImageUploader 
        images={images} 
        onChange={setImages}
        existingImages={existingImages} 
      />
    </div>
  );
}
