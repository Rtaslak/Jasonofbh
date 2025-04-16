
import jsPDF from 'jspdf';
import { Order } from '@/types/orders';

export const addOrderDetails = (doc: jsPDF, order: Order, yPosition: number): number => {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageMargin = 10;
  
  // Format with fallbacks for missing data
  const customerName = order.customer || 'Not provided';
  const storeLocation = order.storeLocation || 'Not specified';
  const dueDate = order.dueDate || 'Not specified';
  const salesperson = order.salesperson || 'Not assigned';
  const serialNumber = order.serialNumber || 'Not specified';
  
  // Calculate table dimensions for a 2x2 grid
  const tableWidth = pageWidth - (pageMargin * 2);
  const rowHeight = 8;
  
  try {
    // Add order details tables
    doc.setDrawColor(0);
    doc.setFillColor(255, 255, 255);
    doc.setLineWidth(0.1);
    
    // Cell borders and text
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.1);
    
    // Row 1
    // First cell - Salesperson
    doc.rect(pageMargin, yPosition, tableWidth / 2, rowHeight);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text("Salesman:", pageMargin + 2, yPosition + 4);
    doc.setFont("helvetica", "normal");
    doc.text(salesperson, pageMargin + 25, yPosition + 4);
    
    // Second cell - Client Name
    doc.rect(pageMargin + tableWidth / 2, yPosition, tableWidth / 2, rowHeight);
    doc.setFont("helvetica", "bold");
    doc.text("Client Name:", pageMargin + tableWidth / 2 + 2, yPosition + 4);
    doc.setFont("helvetica", "normal");
    doc.text(customerName, pageMargin + tableWidth / 2 + 28, yPosition + 4);
    
    // Row 2
    yPosition += rowHeight;
    
    // First cell - Store Location
    doc.rect(pageMargin, yPosition, tableWidth / 2, rowHeight);
    doc.setFont("helvetica", "bold");
    doc.text("Store Location:", pageMargin + 2, yPosition + 4);
    doc.setFont("helvetica", "normal");
    doc.text(storeLocation, pageMargin + 28, yPosition + 4);
    
    // Second cell - Order Submitted (using createdAt)
    const orderDate = order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'Not specified';
    doc.rect(pageMargin + tableWidth / 2, yPosition, tableWidth / 2, rowHeight);
    doc.setFont("helvetica", "bold");
    doc.text("Order Submitted:", pageMargin + tableWidth / 2 + 2, yPosition + 4);
    doc.setFont("helvetica", "normal");
    doc.text(orderDate, pageMargin + tableWidth / 2 + 35, yPosition + 4);
    
    // Row 3
    yPosition += rowHeight;
    
    // First cell - Due Date
    doc.rect(pageMargin, yPosition, tableWidth / 2, rowHeight);
    doc.setFont("helvetica", "bold");
    doc.text("Due Date:", pageMargin + 2, yPosition + 4);
    doc.setFont("helvetica", "normal");
    doc.text(dueDate, pageMargin + 25, yPosition + 4);
    
    // Second cell - Serial Number
    doc.rect(pageMargin + tableWidth / 2, yPosition, tableWidth / 2, rowHeight);
    doc.setFont("helvetica", "bold");
    doc.text("Serial Number:", pageMargin + tableWidth / 2 + 2, yPosition + 4);
    doc.setFont("helvetica", "normal");
    doc.text(serialNumber, pageMargin + tableWidth / 2 + 30, yPosition + 4);
    
    // Add some spacing after the table
    yPosition += rowHeight + 5;
    
    return yPosition;
  } catch (error) {
    console.error('Error creating order details layout:', error);
    
    // Fallback to simple text
    doc.setFontSize(10);
    doc.text(`Salesperson: ${salesperson}`, pageMargin, yPosition + 4);
    doc.text(`Client: ${customerName}`, pageMargin, yPosition + 8);
    doc.text(`Store: ${storeLocation}`, pageMargin, yPosition + 12);
    doc.text(`Due Date: ${dueDate}`, pageMargin, yPosition + 16);
    
    return yPosition + 20;
  }
};
