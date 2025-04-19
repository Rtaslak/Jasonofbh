'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Department extends Model {
    static associate(models) {
      // One department has many stations
      Department.hasMany(models.Station, {
        foreignKey: 'departmentId',
        as: 'stations',
      });
    }
  }

  Department.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Department',
  });

  return Department;
};
