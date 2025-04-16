
const { orders } = require('../models/orders');

// Service layer for order operations
const orderService = {
  getAllOrders: () => {
    return orders;
  },
  
  getOrderById: (id) => {
    return orders.find(order => order.id === id);
  },
  
  createOrder: (orderData) => {
    // Generate ID if not provided
    if (!orderData.id) {
      orderData.id = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    }
    
    // Set timestamps
    orderData.createdAt = orderData.createdAt || new Date().toISOString();
    orderData.updatedAt = new Date().toISOString();
    
    // Add to orders array
    orders.push(orderData);
    
    return orderData;
  },
  
  updateOrder: (id, orderData) => {
    const index = orders.findIndex(o => o.id === id);
    if (index === -1) return null;
    
    // Update timestamp
    orderData.updatedAt = new Date().toISOString();
    // Preserve creation timestamp
    orderData.createdAt = orders[index].createdAt;
    
    // Update the order
    orders[index] = { ...orders[index], ...orderData, id };
    
    return orders[index];
  },
  
  deleteOrder: (id) => {
    const index = orders.findIndex(o => o.id === id);
    if (index === -1) return null;
    
    // Remove from orders array
    return orders.splice(index, 1)[0];
  }
};

module.exports = orderService;
