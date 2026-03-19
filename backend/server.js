const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const dataRoutes = require('./routes/dataRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
// Make sure to add MONGO_URI=mongodb://localhost:27017/waterquality in your .env file
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/waterquality')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log('MongoDB connection error:', err));

// Routes
app.use('/api/data', dataRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});