require('dotenv').config(); 

const express = require('express');
const mongoose = require('mongoose');
const doctorRoutes = require('./routes/doctorRoutes');
const slotRoutes = require('./routes/slotRoutes');
const tokenRoutes = require('./routes/tokenRoutes');

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/api', doctorRoutes);
app.use('/api', slotRoutes);
app.use('/api', tokenRoutes);

// MongoDB connection

const MONGO_URI =
  process.env.MONGO_URI || 'mongodb://localhost:27017/opd_engine';

async function start() {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`OPD Engine API listening on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server', err);
    process.exit(1);
  }
}

if (require.main === module) {
  start();
}

module.exports = { app, start };

