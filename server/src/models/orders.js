
const fs = require('fs');
const path = require('path');
const { logDebug, logError } = require('../utils/logger');

// Default orders array to store orders
let orders = [];

// Path to the local storage file for orders
const ORDERS_FILE_PATH = path.join(__dirname, '../../data/orders.json');

// Ensure the data directory exists
const ensureDataDirectoryExists = () => {
  const dataDir = path.dirname(ORDERS_FILE_PATH);
  if (!fs.existsSync(dataDir)) {
    try {
      fs.mkdirSync(dataDir, { recursive: true });
      logDebug(`Created data directory: ${dataDir}`);
    } catch (error) {
      logError(`Failed to create data directory: ${error.message}`);
    }
  }
};

// Load orders from localStorage
const loadOrdersFromLocalStorage = () => {
  ensureDataDirectoryExists();
  try {
    if (fs.existsSync(ORDERS_FILE_PATH)) {
      const data = fs.readFileSync(ORDERS_FILE_PATH, 'utf8');
      orders = JSON.parse(data);
      logDebug(`Loaded ${orders.length} orders from local storage`);
    } else {
      logDebug('No orders file found, initializing with empty array');
      orders = [];
      saveOrdersToLocalStorage();
    }
  } catch (error) {
    logError(`Error loading orders from local storage: ${error.message}`);
    orders = [];
  }
};

// Save orders to localStorage
const saveOrdersToLocalStorage = () => {
  ensureDataDirectoryExists();
  try {
    fs.writeFileSync(ORDERS_FILE_PATH, JSON.stringify(orders, null, 2), 'utf8');
    logDebug(`Saved ${orders.length} orders to local storage`);
  } catch (error) {
    logError(`Error saving orders to local storage: ${error.message}`);
  }
};

// Initialize by loading orders
loadOrdersFromLocalStorage();

module.exports = {
  orders, // Export the orders array to be used throughout the application
  loadOrdersFromLocalStorage,
  saveOrdersToLocalStorage
};
