'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    static associate(models) {
      // define association here (e.g., with Users, Departments, etc.)
    }
  }

  Order.init({
    id: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    orderNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      unique: true
    },
    customer: DataTypes.STRING,
    email: DataTypes.STRING,
    productType: DataTypes.STRING,        // e.g., "Ring"
    metal: DataTypes.STRING,              // e.g., "Gold"
    karat: DataTypes.STRING,              // e.g., "18K"
    fingerSize: DataTypes.STRING,
    note: DataTypes.TEXT,
    tagId: DataTypes.STRING,              // RFID tag
    status: {
      type: DataTypes.STRING,
      defaultValue: "Submitted"
    },
    submittedBy: DataTypes.STRING,        // salesperson email or name
    currentDepartment: DataTypes.STRING,  // optional for tracking
    currentStation: DataTypes.STRING      // optional for tracking
  }, {
    sequelize,
    modelName: 'Order',
  });

  return Order;
};
