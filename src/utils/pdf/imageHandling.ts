
import jsPDF from 'jspdf';

type OrderImage = {
  id: string;
  name: string;
  type: string;
  size: number;
  lastModified: number;
  dataUrl?: string;
};

export const addOrderImages = (doc: jsPDF, images: OrderImage[], yPosition: number): number => {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageMargin = 10;
  const contentWidth = pageWidth - (pageMargin * 2);
  
  // Add main image (first image) if available
  if (images.length > 0) {
    const mainImage = images[0];
    
    try {
      // Validate data URL
      if (!mainImage.dataUrl) {
        throw new Error("No image data available");
      }
      
      // Create a temporary image element to get the actual dimensions
      const img = new Image();
      img.src = mainImage.dataUrl;
      
      // Calculate dimensions that preserve aspect ratio
      let imgWidth = contentWidth;
      let imgHeight = 110; // Maximum height
      
      // If the image has loaded, use its actual aspect ratio
      if (img.width && img.height) {
        const aspectRatio = img.width / img.height;
        imgHeight = imgWidth / aspectRatio;
        
        // If calculated height exceeds max height, scale both dimensions down
        if (imgHeight > 110) {
          imgHeight = 110;
          imgWidth = imgHeight * aspectRatio;
        }
      }
      
      // Center the image horizontally
      const xPos = pageMargin + (contentWidth - imgWidth) / 2;
      
      // Add border around the image
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.1);
      doc.rect(xPos, yPosition, imgWidth, imgHeight);
      
      // Add main image with proper dimensions
      doc.addImage(
        mainImage.dataUrl, 
        'JPEG', 
        xPos, 
        yPosition, 
        imgWidth, 
        imgHeight
      );
      
      // Update Y position after image
      yPosition += imgHeight + 10;
    } catch (error) {
      console.error("Image processing error:", error);
      
      // Fallback text if image fails
      doc.setFontSize(10);
      doc.setTextColor(150, 150, 150);
      doc.text("Image unavailable", pageWidth / 2, yPosition + 20, { align: "center" });
      yPosition += 40;
    }
  }
  
  return yPosition;
};
