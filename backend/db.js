// MongoDB connection
const mongoose = require('mongoose');
require('dotenv').config();

async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI is not configured in the environment.');
  }

  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 10000
  });

  console.log('MongoDB connected successfully');
}

module.exports = connectDB;
