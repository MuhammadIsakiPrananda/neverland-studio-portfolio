// neverland-backend/migrations/20241209000000-add-password-reset-fields.js
import { DataTypes } from "sequelize";

export async function up(queryInterface, Sequelize) {
  return queryInterface.sequelize.transaction(async (transaction) => {
    try {
      // Add resetPasswordToken column
      await queryInterface.addColumn(
        "Users",
        "resetPasswordToken",
        {
          type: DataTypes.STRING(255),
          allowNull: true,
          unique: false,
        },
        { transaction }
      );

      // Add resetPasswordExpires column
      await queryInterface.addColumn(
        "Users",
        "resetPasswordExpires",
        {
          type: DataTypes.DATE,
          allowNull: true,
        },
        { transaction }
      );

      // Add verificationToken column
      await queryInterface.addColumn(
        "Users",
        "verificationToken",
        {
          type: DataTypes.STRING(255),
          allowNull: true,
          unique: false,
        },
        { transaction }
      );

      // Add verificationTokenExpires column
      await queryInterface.addColumn(
        "Users",
        "verificationTokenExpires",
        {
          type: DataTypes.DATE,
          allowNull: true,
        },
        { transaction }
      );

      console.log(
        "✅ Password reset and verification fields added successfully"
      );
    } catch (error) {
      console.error("❌ Migration failed:", error.message);
      throw error;
    }
  });
}

export async function down(queryInterface, Sequelize) {
  return queryInterface.sequelize.transaction(async (transaction) => {
    try {
      // Remove columns in reverse order
      await queryInterface.removeColumn("Users", "verificationTokenExpires", {
        transaction,
      });
      await queryInterface.removeColumn("Users", "verificationToken", {
        transaction,
      });
      await queryInterface.removeColumn("Users", "resetPasswordExpires", {
        transaction,
      });
      await queryInterface.removeColumn("Users", "resetPasswordToken", {
        transaction,
      });

      console.log(
        "✅ Password reset and verification fields removed successfully"
      );
    } catch (error) {
      console.error("❌ Migration rollback failed:", error.message);
      throw error;
    }
  });
}
