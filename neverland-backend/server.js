// Muat variabel lingkungan dari file .env sesegera mungkin. Ini harus menjadi baris pertama.
import dotenv from 'dotenv';
dotenv.config(); 

import express from 'express';
import cors from 'cors';
import sequelize from './config/database.js'; // Import koneksi sequelize

// Import model agar Sequelize tahu tabel apa yang harus dibuat
import './models/User.js';

// Import routes
import authRoutes from './config/authRoutes.js';

const app = express();

// Middleware (urutan ini penting)
// 1. Aktifkan CORS untuk semua request
app.use(cors());
// 2. Aktifkan parser untuk membaca JSON dari request body
app.use(express.json());

// Routes
// Semua route yang dimulai dengan /api/auth akan diarahkan ke file authRoutes.js
app.use('/api/auth', authRoutes);

// Gunakan port dari .env atau default ke 5000
const PORT = process.env.PORT || 5000; 

const startServer = async () => {
  try {
    // Test Database Connection
    await sequelize.authenticate();
    console.log('Database connected successfully.');

    // Sinkronisasi model dengan database. { force: false } berarti tidak akan menghapus tabel jika sudah ada.
    await sequelize.sync({ force: false }); 
    console.log('All models were synchronized successfully.');
    
    app.listen(PORT, () => console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`));
  } catch (err) {
    console.error('Failed to sync models or start server:', err);
  }
};

startServer();
