
import jsPDF from 'jspdf';
import { Order } from '@/types/orders';
import { setupDocument } from './documentSetup';
import { addOrderImages } from './imageHandling';
import { addOrderDetails } from './orderDetails';
import { addProductInformation } from './productInfo';
import { addNotesSection } from './notesSection';
import { addFooter } from './documentFooter';
import { toast } from "@/hooks/use-toast";

export const generateOrderPDF = (order: Order): void => {
  console.log("Starting PDF generation for order:", order.id);
  
  try {
    // Validate required data
    if (!order.id) {
      throw new Error("Order ID is missing");
    }
    
    // Create and setup the PDF document
    const doc = setupDocument();
    
    let yPosition = 10; // Starting Y position
    
    // Add header with just the order number to save space
    yPosition = addOrderHeader(doc, order, yPosition);
    
    // Add images if available
    if (order.images && order.images.length > 0) {
      try {
        yPosition = addOrderImages(doc, order.images, yPosition);
      } catch (imageError) {
        console.error('Error adding images to PDF:', imageError);
        yPosition += 2;
      }
    }
    
    // Add order details section with salesperson first
    try {
      yPosition = addOrderDetails(doc, order, yPosition);
    } catch (detailsError) {
      console.error('Error adding order details to PDF:', detailsError);
      yPosition += 2;
    }
    
    // Add product information section
    try {
      yPosition = addProductInformation(doc, order, yPosition);
    } catch (productError) {
      console.error('Error adding product information to PDF:', productError);
      yPosition += 2;
    }
    
    // Add notes section
    if (order.additionalNotes) {
      try {
        yPosition = addNotesSection(doc, order.additionalNotes, yPosition);
      } catch (notesError) {
        console.error('Error adding notes to PDF:', notesError);
      }
    }
    
    // Add minimal footer
    try {
      addFooter(doc, order.id);
    } catch (footerError) {
      console.error('Error adding footer to PDF:', footerError);
    }
    
    // Debug log to check page count
    console.log(`PDF generated with ${doc.getNumberOfPages()} pages`);
    
    // Save the PDF with the order ID as the filename
    doc.save(`JewelryOrder-${order.id}.pdf`);
    console.log("PDF generated successfully");
    toast({
      title: "PDF Generated",
      description: `Order #${order.id} PDF created successfully`,
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    toast({
      variant: "destructive",
      title: "PDF Generation Failed",
      description: `Error creating PDF for order #${order?.id || 'unknown'}`,
    });
  }
};

// Helper function to add the order header
const addOrderHeader = (doc: jsPDF, order: Order, yPosition: number): number => {
  const pageWidth = doc.internal.pageSize.getWidth();
  
  try {
    // Add header with order number prominently displayed
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(`Order Number: ${order.id}`, 10, yPosition + 5);
    
    return yPosition + 10;
  } catch (headerError) {
    console.error('Error adding header to PDF:', headerError);
    return yPosition + 10;
  }
};
