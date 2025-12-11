// Migration: add username change limit fields
import { DataTypes } from "sequelize";

export async function up(queryInterface, Sequelize) {
  return queryInterface.sequelize.transaction(async (transaction) => {
    await queryInterface.addColumn(
      "Users",
      "username_changes_count",
      {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      { transaction }
    );
    await queryInterface.addColumn(
      "Users",
      "username_changes_month",
      {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      { transaction }
    );
  });
}

export async function down(queryInterface, Sequelize) {
  return queryInterface.sequelize.transaction(async (transaction) => {
    await queryInterface.removeColumn("Users", "username_changes_count", {
      transaction,
    });
    await queryInterface.removeColumn("Users", "username_changes_month", {
      transaction,
    });
  });
}
