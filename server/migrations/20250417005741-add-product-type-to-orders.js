'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Orders', 'metal', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('Orders', 'karat', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('Orders', 'fingerSize', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('Orders', 'note', {
      type: Sequelize.TEXT,
      allowNull: true,
    });

    await queryInterface.addColumn('Orders', 'tagId', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('Orders', 'status', {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: 'new',
    });

    await queryInterface.addColumn('Orders', 'submittedBy', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('Orders', 'currentDepartment', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('Orders', 'currentStation', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Orders', 'metal');
    await queryInterface.removeColumn('Orders', 'karat');
    await queryInterface.removeColumn('Orders', 'fingerSize');
    await queryInterface.removeColumn('Orders', 'note');
    await queryInterface.removeColumn('Orders', 'tagId');
    await queryInterface.removeColumn('Orders', 'status');
    await queryInterface.removeColumn('Orders', 'submittedBy');
    await queryInterface.removeColumn('Orders', 'currentDepartment');
    await queryInterface.removeColumn('Orders', 'currentStation');
  }
};
