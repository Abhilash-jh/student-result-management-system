const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Student = require('../models/Student');

const router = express.Router();
require('dotenv').config();

const UPLOAD_DIR = path.join(__dirname, '..', process.env.UPLOAD_DIR || 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, 'image-' + Date.now() + ext);
  }
});
const upload = multer({ storage, limits: { fileSize: 2 * 1024 * 1024 } });

function computePercentage(s1, s2, s3, s4) {
  const arr = [s1, s2, s3, s4]
    .map(Number)
    .filter(Number.isFinite)
    .filter(x => x > 0);
  if (!arr.length) return null;
  return Number((arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(2));
}

function normalizeMark(m) {
  if (m === undefined || m === null || m === '') return null;
  const v = Number(m);
  if (!Number.isFinite(v)) return null;
  return Number(Math.max(0, Math.min(100, v)).toFixed(2));
}

function normalizeInput(b) {
  return {
    roll_no: (b.roll_no || '').toString().trim().toUpperCase(),
    name: (b.name || '').toString().trim(),
    class: (b.class || '').toString().trim().toUpperCase(),
    dob: b.dob || null,
    email: (b.email || '').toString().trim(),
    phone: (b.phone || '').toString().replace(/\D/g, '').slice(0, 10),
    semester1: normalizeMark(b.semester1),
    semester2: normalizeMark(b.semester2),
    semester3: normalizeMark(b.semester3),
    semester4: normalizeMark(b.semester4)
  };
}

function validateInput(b) {
  if (!/^NMCA/.test(b.roll_no)) return 'Roll number must start with NMCA';
  if (b.phone && b.phone.length !== 10) return 'Phone number must have exactly 10 digits';
  if (!b.name) return 'Student name is required';
  return null;
}

// Public: list students
router.get('/', async (req, res) => {
  try {
    const rows = await Student.find({}, 'roll_no name class percentage image_path')
      .sort({ name: 1 })
      .lean();
    res.json(rows.map(s => ({ ...s, id: s._id.toString() })));
  } catch (err) {
    console.error('Fetch students error:', err);
    res.status(500).json({ error: 'DB error' });
  }
});

// Public: get one student
router.get('/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).lean();
    if (!student) return res.status(404).json({ error: 'Not found' });
    res.json({ ...student, id: student._id.toString() });
  } catch (err) {
    if (err.name === 'CastError') return res.status(404).json({ error: 'Not found' });
    console.error('Fetch student error:', err);
    res.status(500).json({ error: 'DB error' });
  }
});

function tokenIsValid(req) {
  const headerToken = req.headers['x-admin-token'] || req.query.token;
  if (headerToken && headerToken === process.env.ADMIN_TOKEN) return true;
  const auth = req.headers.authorization || '';
  const match = auth.match(/^Bearer\s+(.+)$/i);
  return !!(match && match[1] === process.env.ADMIN_TOKEN);
}

function ensureAdmin(req, res, next) {
  if (tokenIsValid(req)) return next();
  return res.status(401).json({ error: 'Unauthorized' });
}

// Admin: add student
router.post('/', ensureAdmin, upload.single('image'), async (req, res) => {
  try {
    const data = normalizeInput(req.body);
    const validationError = validateInput(data);
    if (validationError) return res.status(400).json({ error: validationError });

    const image_path = req.file ? '/uploads/' + req.file.filename : null;
    const percentage = computePercentage(
      data.semester1, data.semester2, data.semester3, data.semester4
    );

    const student = await Student.create({ ...data, percentage, image_path });
    res.json({ ok: true, id: student._id.toString() });
  } catch (err) {
    console.error('Insert failed:', err);
    if (err.code === 11000) return res.status(409).json({ error: 'Roll number already exists' });
    if (err.name === 'ValidationError') return res.status(400).json({ error: err.message });
    res.status(500).json({ error: 'Insert failed' });
  }
});

// Admin: update student
router.put('/:id', ensureAdmin, upload.single('image'), async (req, res) => {
  try {
    const data = normalizeInput(req.body);
    const validationError = validateInput(data);
    if (validationError) return res.status(400).json({ error: validationError });

    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ error: 'Not found' });

    if (req.file) {
      if (student.image_path) {
        const old = path.join(__dirname, '..', student.image_path.replace(/^\//, ''));
        if (fs.existsSync(old)) fs.unlinkSync(old);
      }
      student.image_path = '/uploads/' + req.file.filename;
    }

    Object.assign(student, data);
    student.percentage = computePercentage(
      data.semester1, data.semester2, data.semester3, data.semester4
    );
    await student.save();

    res.json({ ok: true });
  } catch (err) {
    console.error('Update failed:', err);
    if (err.code === 11000) return res.status(409).json({ error: 'Roll number already exists' });
    if (err.name === 'CastError') return res.status(404).json({ error: 'Not found' });
    if (err.name === 'ValidationError') return res.status(400).json({ error: err.message });
    res.status(500).json({ error: 'Update failed' });
  }
});

// Admin: delete student
router.delete('/:id', ensureAdmin, async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ error: 'Not found' });

    if (student.image_path) {
      const imageFile = path.join(__dirname, '..', student.image_path.replace(/^\//, ''));
      if (fs.existsSync(imageFile)) fs.unlinkSync(imageFile);
    }

    await Student.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    console.error('Delete failed:', err);
    if (err.name === 'CastError') return res.status(404).json({ error: 'Not found' });
    res.status(500).json({ error: 'Delete failed' });
  }
});

module.exports = router;
