
import jsPDF from 'jspdf';

export const addNotesSection = (doc: jsPDF, notes: string, yPosition: number): number => {
  const pageMargin = 10;
  const pageWidth = doc.internal.pageSize.getWidth();
  const contentWidth = pageWidth - (pageMargin * 2);
  
  // Handle empty or invalid notes
  if (!notes || typeof notes !== 'string' || notes.trim() === '') {
    return yPosition;
  }
  
  try {
    // Add notes section heading
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("Additional Notes:", pageMargin, yPosition);
    yPosition += 5;
    
    // Draw a rectangle for the notes
    doc.setDrawColor(0);
    doc.setFillColor(255, 255, 255);
    doc.setLineWidth(0.1);
    
    // Calculate height needed for notes - estimate based on content length
    const noteCharactersPerLine = 90; // Approximate characters per line
    const approxLines = Math.ceil(notes.length / noteCharactersPerLine);
    const lineHeight = 5;
    const boxHeight = Math.max(20, Math.min(80, approxLines * lineHeight)); // Min 20px, max 80px
    
    // Draw the notes box
    doc.rect(pageMargin, yPosition, contentWidth, boxHeight);
    
    // Add notes text inside the box
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    
    // Process the notes - extract common notes patterns if available
    let processedNotes = notes;
    
    // Try to extract rush information
    const rushInfo = notes.match(/\*\*Rush for push present\*\*/i) || 
                    notes.match(/rush.*present/i);
                    
    // Try to extract chain information
    const chainInfo = notes.match(/\d+\s*pointer\s*spread\s*prong\s*tennis\s*chain/i);
    
    // Try to extract length information
    const lengthInfo = notes.match(/\d+"\s*with\s*\d+"\s*of\s*O\s*rings\s*for\s*extension/i);
    
    // If we found specific information, format it nicely
    if (rushInfo || chainInfo || lengthInfo) {
      let formattedNotes = "";
      
      if (rushInfo) {
        formattedNotes += "**Rush for push present**\n";
      }
      
      if (chainInfo) {
        formattedNotes += chainInfo[0] + "\n";
      }
      
      if (lengthInfo) {
        formattedNotes += lengthInfo[0];
      }
      
      // If we couldn't extract everything, append the original notes
      if (formattedNotes.length < notes.length / 2) {
        formattedNotes = notes;
      }
      
      processedNotes = formattedNotes;
    }
    
    // Add the notes text with line wrapping
    const splitNotes = doc.splitTextToSize(processedNotes, contentWidth - 4);
    doc.text(splitNotes, pageMargin + 2, yPosition + 5);
    
    return yPosition + boxHeight + 5;
  } catch (error) {
    console.error('Error adding notes to PDF:', error);
    
    // Fallback to simple text
    doc.setFontSize(8);
    doc.text("Additional Notes:", pageMargin, yPosition);
    doc.text(notes.substring(0, 200) + (notes.length > 200 ? "..." : ""), 
             pageMargin, yPosition + 4, { maxWidth: contentWidth });
    
    return yPosition + 15;
  }
};
