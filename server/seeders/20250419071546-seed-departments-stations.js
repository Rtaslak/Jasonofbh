'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Insert departments
    const departments = await queryInterface.bulkInsert('Departments', [
      { name: 'Designers', description: 'Creative design department', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Jewelers', description: 'Jewelry crafting station', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Polishers', description: 'Polishing department', createdAt: new Date(), updatedAt: new Date() },
    ], { returning: true });

    // Get inserted department IDs
    const [designers, jewelers, polishers] = departments;

    // Insert stations for each department
    await queryInterface.bulkInsert('Stations', [
      // Designers
      { name: 'Alice', description: 'Senior Designer', antennaNumber: 1, departmentId: designers.id, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Bob', description: 'Junior Designer', antennaNumber: 2, departmentId: designers.id, createdAt: new Date(), updatedAt: new Date() },

      // Jewelers
      { name: 'Roger', description: 'Master Jeweler', antennaNumber: 1, departmentId: jewelers.id, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Tro', description: 'Bench Jeweler', antennaNumber: 2, departmentId: jewelers.id, createdAt: new Date(), updatedAt: new Date() },

      // Polishers
      { name: 'Shiny', description: 'Polisher 1', antennaNumber: 1, departmentId: polishers.id, createdAt: new Date(), updatedAt: new Date() },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Stations', null, {});
    await queryInterface.bulkDelete('Departments', null, {});
  }
};
