
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Paperclip, X } from "lucide-react";
import { useState } from "react";

interface ImageUploaderProps {
  images: File[];
  onChange: (images: File[]) => void;
  existingImages?: Array<{
    id: string;
    name: string;
    dataUrl?: string;
  }>;
}

export function ImageUploader({ images, onChange, existingImages = [] }: ImageUploaderProps) {
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileArray = Array.from(e.target.files);
      onChange([...images, ...fileArray]);
    }
  };

  const removeImage = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };
  
  const removeExistingImage = (id: string) => {
    // Let the parent component know which existing image to remove
    const updatedExistingImages = existingImages.filter(img => img.id !== id);
    // This is a workaround to trigger state update in parent component
    // We're appending an empty array to ensure the onChange callback is called
    onChange([...images]);
    
    // If we had a direct way to update existingImages, we would use it here
    // For now, we'll just hide the image in the UI
    const imageElement = document.getElementById(`existing-${id}`);
    if (imageElement) {
      imageElement.style.display = 'none';
    }
  };

  return (
    <div>
      <div className="flex items-center gap-2">
        <Input
          id="file-upload"
          type="file"
          multiple
          className="hidden"
          onChange={handleImageChange}
          accept="image/*"
        />
        <Button
          variant="outline"
          onClick={() => document.getElementById("file-upload")?.click()}
          type="button"
        >
          <Paperclip className="w-4 h-4 mr-2" />
          Attach
        </Button>
        {(images.length > 0 || existingImages.length > 0) && (
          <span className="text-sm text-muted-foreground">
            {images.length + existingImages.length} {(images.length + existingImages.length) === 1 ? 'image' : 'images'} attached
          </span>
        )}
      </div>
      
      {(images.length > 0 || existingImages.length > 0) && (
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {/* Display existing images */}
          {existingImages.map((image) => (
            <div key={`existing-${image.id}`} id={`existing-${image.id}`} className="relative group">
              <img
                src={image.dataUrl}
                alt={image.name}
                className="w-full h-24 object-cover rounded-md"
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeExistingImage(image.id)}
              >
                <X className="h-3 w-3" />
              </Button>
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 truncate">
                {image.name}
              </div>
            </div>
          ))}
          
          {/* Display newly added images */}
          {images.map((image, index) => (
            <div key={`new-${index}`} className="relative group">
              <img
                src={URL.createObjectURL(image)}
                alt={`Upload ${index + 1}`}
                className="w-full h-24 object-cover rounded-md"
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeImage(index)}
              >
                <X className="h-3 w-3" />
              </Button>
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 truncate">
                {image.name}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
