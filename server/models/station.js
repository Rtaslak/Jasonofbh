'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Station extends Model {
    static associate(models) {
      // 🔗 Each station belongs to one department
      Station.belongsTo(models.Department, {
        foreignKey: 'departmentId',
        as: 'department',
      });
    }
  }

  Station.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: DataTypes.STRING,
    departmentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    antennaNumber: {
      type: DataTypes.INTEGER,
      allowNull: true,
    }
  }, {
    sequelize,
    modelName: 'Station',
  });

  return Station;
};
