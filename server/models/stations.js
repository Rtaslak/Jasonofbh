'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Station extends Model {
    static associate(models) {
      // ✅ A Station belongs to a Department
      Station.belongsTo(models.Department, {
        foreignKey: 'departmentId',
        as: 'department'
      });
    }
  }

  Station.init({
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    departmentId: DataTypes.INTEGER,
    antennaNumber: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Station',
  });

  return Station;
};
