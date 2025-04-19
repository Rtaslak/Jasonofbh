'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await Promise.all([
      queryInterface.addColumn('Orders', 'metal', {
        type: Sequelize.STRING,
        allowNull: true
      }),
      queryInterface.addColumn('Orders', 'karat', {
        type: Sequelize.STRING,
        allowNull: true
      }),
      queryInterface.addColumn('Orders', 'fingerSize', {
        type: Sequelize.STRING,
        allowNull: true
      }),
      queryInterface.addColumn('Orders', 'note', {
        type: Sequelize.TEXT,
        allowNull: true
      }),
      queryInterface.addColumn('Orders', 'submittedBy', {
        type: Sequelize.STRING,
        allowNull: true
      }),
      queryInterface.addColumn('Orders', 'currentDepartment', {
        type: Sequelize.STRING,
        allowNull: true
      }),
      queryInterface.addColumn('Orders', 'currentStation', {
        type: Sequelize.STRING,
        allowNull: true
      })
    ]);
  },

  async down(queryInterface, Sequelize) {
    await Promise.all([
      queryInterface.removeColumn('Orders', 'metal'),
      queryInterface.removeColumn('Orders', 'karat'),
      queryInterface.removeColumn('Orders', 'fingerSize'),
      queryInterface.removeColumn('Orders', 'note'),
      queryInterface.removeColumn('Orders', 'submittedBy'),
      queryInterface.removeColumn('Orders', 'currentDepartment'),
      queryInterface.removeColumn('Orders', 'currentStation')
    ]);
  }
};
