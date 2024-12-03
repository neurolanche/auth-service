const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
require('dotenv').config();

const app = express();
app.use(express.json());

// CORS Middleware
app.use(cors());

// MongoDB Bağlantısı
connectDB().then(r => console.log('Connected to MongoDB'));

// API Routes
app.use('/api/auth', authRoutes);

// Sunucuyu Başlat
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
