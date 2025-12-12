// neverland-backend/models/User.js - UPDATED VERSION
import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const User = sequelize.define(
  "User",
  {
    username_changes_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    username_changes_month: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: { msg: "Nama wajib diisi" },
        len: [2, 100],
      },
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      // Validasi diselaraskan dengan `utils/validation.js` untuk konsistensi
      validate: {
        is: /^[a-zA-Z0-9_-]{3,30}$/i,
        notEmpty: { msg: "Username wajib diisi" },
        len: [3, 30],
      },
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: { msg: "Email tidak valid" },
      },
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: true, // Boleh kosong untuk user Google/GitHub
      validate: {
        // Password wajib diisi jika provider adalah 'email'
        isEmailProviderPasswordRequired(value) {
          if (this.provider === "email" && (!value || value.length === 0)) {
            throw new Error(
              "Password is required for email-based registration."
            );
          }
        },
      },
    },
    image: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    provider: {
      type: DataTypes.ENUM("email", "google", "github"),
      defaultValue: "email",
    },
    googleId: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: true,
    },
    githubId: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: true,
    },
    role: {
      type: DataTypes.ENUM("user", "admin"),
      defaultValue: "user",
      allowNull: false, // PENTING: role tidak boleh null
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    lastLogin: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    resetPasswordToken: {
      type: DataTypes.STRING(255),
      allowNull: true,
      unique: false,
    },
    resetPasswordExpires: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    verificationToken: {
      type: DataTypes.STRING(255),
      allowNull: true,
      unique: false,
    },
    verificationTokenExpires: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    twoFactorSecret: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    twoFactorEnabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    twoFactorRecoveryCodes: {
      type: DataTypes.TEXT, // JSON string array
      allowNull: true,
    },
  },
    // Mengaktifkan soft deletes. `destroy()` akan set `deletedAt` daripada menghapus permanen.
    paranoid: true,
    timestamps: true,
    hooks: {
      // Hook untuk menormalkan data sebelum validasi dan penyimpanan
      beforeValidate: (user, options) => {
        if (user.email) user.email = user.email.toLowerCase().trim();
        if (user.username) user.username = user.username.toLowerCase().trim();
      },
    },
    indexes: [
      { fields: ["email"] },
      { fields: ["username"] },
      { fields: ["googleId"] },
      { fields: ["githubId"] },
    ],
  }
);

export default User;
