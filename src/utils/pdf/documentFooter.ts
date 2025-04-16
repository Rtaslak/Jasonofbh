
import jsPDF from 'jspdf';

export const addFooter = (doc: jsPDF, orderId: string): void => {
  try {
    if (!orderId) {
      console.warn('Order ID is missing in footer');
      orderId = 'Unknown';
    }
    
    const pageWidth = doc.internal.pageSize.getWidth();
    const footerPosition = doc.internal.pageSize.getHeight() - 5;
    
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    
    // Only add the page number if multiple pages
    if (doc.getNumberOfPages() > 1) {
      // For each page
      const totalPages = doc.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.text(
          `Page ${i} of ${totalPages}`,
          pageWidth / 2, 
          footerPosition, 
          { align: "center" }
        );
      }
    }
  } catch (error) {
    console.error('Error adding footer to PDF:', error);
    // No fallback needed for footer
  }
};
