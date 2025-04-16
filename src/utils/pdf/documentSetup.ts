
import jsPDF from 'jspdf';

// Create and configure the PDF document
export const setupDocument = (): jsPDF => {
  try {
    // Standard letter size in portrait mode
    return new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'letter',
      compress: true,
      putOnlyUsedFonts: true,
      hotfixes: ['px_scaling'],
    });
  } catch (error) {
    console.error('Error setting up PDF document:', error);
    // Fallback to standard letter size if custom size fails
    return new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      compress: true
    });
  }
};
