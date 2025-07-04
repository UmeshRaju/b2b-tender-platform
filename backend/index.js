const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // Your frontend URL
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// ✅ Auth routes - Added /api prefix
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// ✅ Company - Added /api prefix
const companyRoutes = require('./routes/company');
app.use('/api/company', companyRoutes);

// ✅ Tenders - Added /api prefix
const tenderRoutes = require('./routes/tender');
app.use('/api/tenders', tenderRoutes);

// ✅ Applications - Added /api prefix
const applicationRoutes = require('./routes/application');
app.use('/api/applications', applicationRoutes);

// ✅ Search - Added /api prefix
const searchRoutes = require('./routes/search');
app.use('/api/search', searchRoutes);

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend server is running!' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
  console.log(`Auth endpoint: http://localhost:${PORT}/api/auth`);
});