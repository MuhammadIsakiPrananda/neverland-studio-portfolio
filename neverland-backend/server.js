// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database'); // Import koneksi sequelize

// Import model agar Sequelize tahu tabel apa yang harus dibuat
require('./models/User');

const app = express();

// Middleware (urutan ini penting)
// 1. Aktifkan CORS untuk semua request
app.use(cors());
// 2. Aktifkan body-parser untuk membaca JSON dari request body
app.use(express.json());

// Test Database Connection
sequelize.authenticate()
  .then(() => console.log('Database connected to MariaDB...'))
  .catch(err => console.error('Error: ' + err));

// Routes
// Semua route yang dimulai dengan /api/auth akan diarahkan ke file auth.js
app.use('/api/auth', require('./auth'));

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Sinkronisasi model dengan database. { force: false } berarti tidak akan menghapus tabel jika sudah ada.
    await sequelize.sync({ force: false });
    console.log('All models were synchronized successfully.');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error('Failed to sync models or start server:', err);
  }
};

startServer();
