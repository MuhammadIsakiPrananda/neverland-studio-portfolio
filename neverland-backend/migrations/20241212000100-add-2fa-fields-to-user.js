// Migration: add 2FA fields to User
"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Users", "twoFactorSecret", {
      type: Sequelize.STRING(255),
      allowNull: true,
    });
    await queryInterface.addColumn("Users", "twoFactorEnabled", {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    });
    await queryInterface.addColumn("Users", "twoFactorRecoveryCodes", {
      type: Sequelize.TEXT, // JSON string array
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Users", "twoFactorSecret");
    await queryInterface.removeColumn("Users", "twoFactorEnabled");
    await queryInterface.removeColumn("Users", "twoFactorRecoveryCodes");
  },
};
