'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // await queryInterface.addColumn('Orders', 'orderNumber', {
    //   type: Sequelize.INTEGER,
    //   allowNull: false,
    //   unique: true
    // });
  },

  async down(queryInterface, Sequelize) {
    // await queryInterface.removeColumn('Orders', 'orderNumber');
  }
};
