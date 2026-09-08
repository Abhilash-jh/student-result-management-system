// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, process.env.UPLOAD_DIR || 'uploads')));

const students = require('./routes/students');
app.use('/api/students', students);

app.get('/', (req, res) => {
  res.json({ ok: true, message: 'Student Result Management System API', database: 'mongodb' });
});

app.get('/api/ping', (req, res) => res.json({ ok: true, database: 'mongodb' }));

async function startServer() {
  try {
    await connectDB();
    app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
  } catch (err) {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  }
}

startServer();
