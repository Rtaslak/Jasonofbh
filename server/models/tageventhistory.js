'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Tageventhistory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Tageventhistory.init({
    orderId: DataTypes.INTEGER,
    tagId: DataTypes.STRING,
    readerId: DataTypes.STRING,
    antenna: DataTypes.STRING,
    timestamp: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Tageventhistory',
  });
  return Tageventhistory;
};