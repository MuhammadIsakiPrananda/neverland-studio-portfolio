'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Add 2FA fields to Users table
    await queryInterface.addColumn('Users', 'twoFactorSecret', {
      type: Sequelize.TEXT,
      allowNull: true,
    });

    await queryInterface.addColumn('Users', 'twoFactorEnabled', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    });

    await queryInterface.addColumn('Users', 'twoFactorRecoveryCodes', {
      type: Sequelize.JSON,
      allowNull: true,
    });
  },

  async down (queryInterface, Sequelize) {
    // Remove 2FA fields from Users table
    await queryInterface.removeColumn('Users', 'twoFactorSecret');
    await queryInterface.removeColumn('Users', 'twoFactorEnabled');
    await queryInterface.removeColumn('Users', 'twoFactorRecoveryCodes');
  }
};
