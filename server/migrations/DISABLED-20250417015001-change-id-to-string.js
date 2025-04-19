'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('Orders', 'id', {
      type: Sequelize.STRING,
      allowNull: false,
      primaryKey: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('Orders', 'id', {
      type: Sequelize.INTEGER, // old state
      allowNull: false,
      primaryKey: true,
    });
  }
};
