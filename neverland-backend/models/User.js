// models/User.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import bcrypt from 'bcryptjs';

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  // Opsi Model
  tableName: 'users', // Secara eksplisit memberitahu Sequelize nama tabelnya
  timestamps: true, // Otomatis membuat kolom createdAt dan updatedAt
  hooks: {
    // Hook ini berjalan sebelum user dibuat atau diupdate
    beforeSave: async (user) => {
      // Hanya hash password jika field password diubah atau baru
      if (user.changed('password')) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    },
  },
});

export default User;
