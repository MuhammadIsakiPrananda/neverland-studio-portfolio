// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database'); // Import koneksi sequelize

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test Database Connection
sequelize.authenticate()
  .then(() => console.log('Database connected to MariaDB...'))
  .catch(err => console.error('Error: ' + err));

// Routes
app.use('/api/auth', require('./auth'));

const PORT = process.env.PORT || 5000;

// Sinkronisasi model dengan database dan jalankan server
// { force: false } berarti tidak akan menghapus tabel jika sudah ada
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  console.log('All models were synchronized successfully.');
}).catch(err => console.error('Failed to sync models:', err));
