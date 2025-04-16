'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  async up(queryInterface, Sequelize) {
    const hashedPassword = await bcrypt.hash('admin123', 10); // 👈 8-character password
    await queryInterface.bulkInsert('Users', [{
      name: 'Admin',
      email: 'admin@jasonofbh.com',
      role: 'admin',
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    }], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', { email: 'admin@jasonofbh.com' }, {});
  }
};
