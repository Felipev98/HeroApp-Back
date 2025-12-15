const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/database');
const heroesRoutes = require('./routes/heroes');
const authRoutes = require('./routes/auth');
const { errorHandler } = require('./middleware/errorHandler');

if (process.env.NODE_ENV !== 'test') {
  connectDB();
}

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/heroes', heroesRoutes);

app.use(errorHandler);

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📍 Health check: http://localhost:${PORT}/health`);
  });
}

module.exports = app;

