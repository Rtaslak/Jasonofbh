'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Seed Users
    await queryInterface.bulkInsert('Users', [
      {
        name: 'Admin User',
        email: 'admin@jasonofbh.com',
        password: '$2b$10$2XyO.TfM3MuKokKHxHfPRe4On6e/3mUMrrxjCEaPaP3c8Tswl/xgq', // hashed: admin123
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Sales User',
        email: 'sales@jasonofbh.com',
        password: '$2b$10$2XyO.TfM3MuKokKHxHfPRe4On6e/3mUMrrxjCEaPaP3c8Tswl/xgq', // hashed: admin123
        role: 'salesman',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ], {});

    // Seed Orders (optional)
    await queryInterface.bulkInsert('Orders', [
      {
        customer: 'John Smith',
        email: 'john@example.com',
        status: 'new',
        tagId: 'E2003412010F01122233B97E', // test tag
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
    await queryInterface.bulkDelete('Orders', null, {});
  }
};
