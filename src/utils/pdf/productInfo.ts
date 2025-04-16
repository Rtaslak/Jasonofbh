
import jsPDF from 'jspdf';
import { Order } from '@/types/orders';

export const addProductInformation = (doc: jsPDF, order: Order, yPosition: number): number => {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageMargin = 10;
  const tableWidth = pageWidth - (pageMargin * 2);
  
  // Formatting product information
  const productType = order.items && order.items.length > 0 ? order.items[0] : 'Not specified';
  const stoneDetails = order.stoneDetails || 'Not specified';
  
  // Format metal information
  const metalInfo = formatMetalInfo(order);
  const metalColor = formatMetalColor(order);
  
  try {
    // Add section title
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("Product Information", pageMargin, yPosition);
    yPosition += 6;
    
    // Create a single table for product information
    doc.setDrawColor(0);
    doc.setLineWidth(0.1);
    
    // Single row for product type
    doc.rect(pageMargin, yPosition, tableWidth, 12);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text("Product Type:", pageMargin + 2, yPosition + 4);
    doc.setFont("helvetica", "normal");
    
    // We'll add product type and necklace length if available
    let productDisplay = productType;
    const productDetails = `Necklace Length: ${
      order.additionalNotes && order.additionalNotes.includes("15\"") ? 
      "15\" with 2\" extender so 17\" total" : 
      "Not specified"
    }`;
    
    doc.text(productDisplay, pageMargin + 28, yPosition + 4);
    
    // Second line for necklace length if it's a necklace
    if (productType.toLowerCase().includes("necklace")) {
      doc.text(productDetails, pageMargin + 28, yPosition + 9);
    }
    
    yPosition += 12;
    
    // Row for metal information
    doc.rect(pageMargin, yPosition, tableWidth, 8);
    doc.setFont("helvetica", "bold");
    doc.text("Metal / Material:", pageMargin + 2, yPosition + 4);
    doc.setFont("helvetica", "normal");
    doc.text(metalInfo, pageMargin + 32, yPosition + 4);
    
    yPosition += 8;
    
    // Row for gold color
    doc.rect(pageMargin, yPosition, tableWidth, 8);
    doc.setFont("helvetica", "bold");
    doc.text("Gold Color:", pageMargin + 2, yPosition + 4);
    doc.setFont("helvetica", "normal");
    doc.text(metalColor, pageMargin + 32, yPosition + 4);
    
    yPosition += 8;
    
    // Row for stone type/color
    doc.rect(pageMargin, yPosition, tableWidth, 8);
    doc.setFont("helvetica", "bold");
    doc.text("Stone Type/Color:", pageMargin + 2, yPosition + 4);
    doc.setFont("helvetica", "normal");
    
    let stoneText = stoneDetails;
    if (stoneDetails === 'Not specified' && order.additionalNotes) {
      if (order.additionalNotes.toLowerCase().includes('round')) {
        stoneText = 'Round';
      }
    }
    
    doc.text(stoneText, pageMargin + 32, yPosition + 4);
    
    yPosition += 13;
    
    return yPosition;
  } catch (error) {
    console.error('Error adding product information:', error);
    
    // Fallback to simple text
    doc.setFontSize(10);
    doc.text("Product Information", pageMargin, yPosition);
    doc.text(`Product Type: ${productType}`, pageMargin, yPosition + 5);
    doc.text(`Metal: ${metalInfo}`, pageMargin, yPosition + 10);
    doc.text(`Gold Color: ${metalColor}`, pageMargin, yPosition + 15);
    doc.text(`Stone: ${stoneDetails}`, pageMargin, yPosition + 20);
    
    return yPosition + 25;
  }
};

// Helper function to format metal information
function formatMetalInfo(order: Order): string {
  try {
    if (!order.metal || !order.metal.primaryMetal) return 'Not specified';
    
    return `${order.metal.primaryMetal}${order.metal.secondaryMetal ? 
      ` & ${order.metal.secondaryMetal}` : ''}`;
  } catch (error) {
    console.error('Error formatting metal info:', error);
    return 'Not specified';
  }
};

// Helper function to format metal color
function formatMetalColor(order: Order): string {
  try {
    if (!order.metal || !order.metal.tones) return 'Not specified';
    
    const tones = order.metal.tones;
    
    // Handle case where tones object exists but has no properties or all are false
    if (!tones || Object.keys(tones).length === 0 || 
        !Object.values(tones).some(value => value)) {
      return 'Not specified';
    }
    
    return Object.entries(tones)
      .filter(([_, value]) => value)
      .map(([key]) => key.charAt(0).toUpperCase() + key.slice(1))
      .join(', ') || 'Not specified';
  } catch (error) {
    console.error('Error formatting metal color:', error);
    return 'Not specified';
  }
};
