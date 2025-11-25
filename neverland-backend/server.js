// Muat variabel lingkungan dari file .env sesegera mungkin. Ini harus menjadi baris pertama.
import dotenv from 'dotenv';
dotenv.config(); 

import express from 'express';
import cors from 'cors';
import sequelize from './config/database.js'; // Import koneksi sequelize

// Import model agar Sequelize tahu tabel apa yang harus dibuat
import './models/User.js';

// Import routes
import registerHandler from './api/auth/register.js';
import loginHandler from './api/auth/login.js';

const app = express();

// Middleware (urutan ini penting)
// 1. Aktifkan CORS untuk semua request
app.use(cors());
// 2. Aktifkan parser untuk membaca JSON dari request body
app.use(express.json());

// API Routes
// Menggunakan handler secara langsung untuk setiap endpoint
app.post('/api/auth/register', registerHandler);
app.post('/api/auth/login', loginHandler);

// Gunakan port dari .env atau default ke 5000
const PORT = process.env.PORT || 5000; 

const startServer = async () => {
  try {
    // Test Database Connection
    await sequelize.authenticate();
    console.log('Database connected successfully.');
    
    // Sinkronisasi model dengan database.
    // { alter: true } akan memeriksa status tabel saat ini di database (kolom apa yang ada, tipe datanya, dll),
    // lalu melakukan perubahan yang diperlukan di tabel agar sesuai dengan model. Ini tidak akan menghapus data.
    await sequelize.sync({ alter: true }); 
    console.log('All models were synchronized successfully.');
    
    // PENTING: Mulai server HANYA SETELAH sinkronisasi selesai.
    app.listen(PORT, () => console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`));
  } catch (err) {
    console.error('Unable to start the server:', err);
    process.exit(1); // Keluar dari proses jika server gagal start
  }
};

startServer();
