// models/User.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const User = sequelize.define(
  'User',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    googleId: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        len: [2, 100],
      },
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      lowercase: true,
      validate: {
        len: [3, 50],
        isAlphanumeric: false, // Kita handle di aplikasi
      },
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      lowercase: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: true, // Null untuk user Google OAuth
    },
    image: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    provider: {
      type: DataTypes.ENUM('email', 'google'),
      defaultValue: 'email',
      allowNull: false,
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    lastLogin: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: 'users',
    timestamps: true,
  }
);

export default User;

