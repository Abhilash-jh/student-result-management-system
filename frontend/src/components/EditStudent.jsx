// src/components/EditStudent.jsx
import React, { useEffect, useState } from 'react';
import { fetchStudent, adminUpdateStudent } from '../api';

export default function EditStudent({ id, token, onDone, onCancel }) {
  const [student, setStudent] = useState(null);
  const [form, setForm] = useState({
    roll_no: '', name: '', class: '', dob: '', email: '', phone: '',
    semester1: '', semester2: '', semester3: '', semester4: '', image: null
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetchStudent(id)
      .then(s => {
        setStudent(s);
        setForm({
          roll_no: s.roll_no || '',
          name: s.name || '',
          class: s.class || '',
          dob: s.dob ? s.dob.slice(0, 10) : '',
          email: s.email || '',
          phone: s.phone || '',
          semester1: s.semester1 ?? '',
          semester2: s.semester2 ?? '',
          semester3: s.semester3 ?? '',
          semester4: s.semester4 ?? '',
          image: null
        });
      })
      .catch(() => setError('Failed to load student'))
      .finally(() => setLoading(false));
  }, [id]);

  function normalizeRoll(v) {
    if (!v) return '';
    return v.toString().trim().toUpperCase();
  }
  function normalizeClass(v) {
    return (v || '').toString().trim().toUpperCase();
  }
  function normalizePhone(v) {
    const digits = (v || '').toString().replace(/\D/g, '').slice(0, 10);
    return digits;
  }
  function clampSemesterVal(v) {
    if (v === '' || v === null || v === undefined) return '';
    const n = Number(v);
    if (!isFinite(n)) return '';
    return Math.max(0, Math.min(100, Number(n.toFixed(2))));
  }

  async function submit(e) {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      // Final normalization & validation
      const roll_no = normalizeRoll(form.roll_no);
      const cls = normalizeClass(form.class);
      const phone = normalizePhone(form.phone);

      if (!/^NMCA/.test(roll_no)) {
        setError('Roll number must start with NMCA (e.g. NMCA01).');
        setSaving(false);
        return;
      }

      if (phone && phone.length !== 10) {
        setError('Phone must be exactly 10 digits (or leave empty).');
        setSaving(false);
        return;
      }

      // clamp semester values
      const s1 = form.semester1 === '' ? '' : clampSemesterVal(form.semester1);
      const s2 = form.semester2 === '' ? '' : clampSemesterVal(form.semester2);
      const s3 = form.semester3 === '' ? '' : clampSemesterVal(form.semester3);
      const s4 = form.semester4 === '' ? '' : clampSemesterVal(form.semester4);

      // attach to a FormData
      const fd = new FormData();
      fd.append('roll_no', roll_no);
      fd.append('name', (form.name || '').toString());
      fd.append('class', cls);
      fd.append('dob', form.dob || '');
      fd.append('email', form.email || '');
      fd.append('phone', phone || '');
      if (s1 !== '') fd.append('semester1', s1);
      if (s2 !== '') fd.append('semester2', s2);
      if (s3 !== '') fd.append('semester3', s3);
      if (s4 !== '') fd.append('semester4', s4);
      if (form.image) fd.append('image', form.image);

      await adminUpdateStudent(id, fd, token);
      if (typeof onDone === 'function') onDone();
    } catch (err) {
      console.error('Save error:', err);
      setError(err.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div>Loading…</div>;
  if (!student) return <div>Student not found</div>;

  return (
    <div>
      <button className="btn btn-link mb-3" onClick={onCancel}>← Back to admin</button>

      <div className="card p-3">
        <h4>Edit — {student.name}</h4>
        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={submit}>
          <div className="row g-2">
            <div className="col-md-6">
              <label className="form-label">Roll No</label>
              <input
                className="form-control"
                placeholder="Roll No (starts with NMCA)"
                value={form.roll_no}
                onChange={e => setForm({ ...form, roll_no: normalizeRoll(e.target.value) })}
                pattern="^NMCA[0-9A-Z\-]*$"
                title="Roll no must start with NMCA"
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Name</label>
              <input
                className="form-control"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>

            <div className="col-md-4">
              <label className="form-label">Class</label>
              <input
                className="form-control"
                placeholder="Class (e.g. MCA)"
                value={form.class}
                onChange={e => setForm({ ...form, class: normalizeClass(e.target.value) })}
              />
            </div>

            <div className="col-md-4">
              <label className="form-label">DOB</label>
              <input
                className="form-control"
                type="date"
                value={form.dob}
                onChange={e => setForm({ ...form, dob: e.target.value })}
              />
            </div>

            <div className="col-md-4">
              <label className="form-label">Email</label>
              <input
                className="form-control"
                type="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
              />
            </div>

            <div className="col-md-4">
              <label className="form-label">Phone</label>
              <input
                className="form-control"
                placeholder="10 digits"
                inputMode="numeric"
                value={form.phone}
                onChange={e => setForm({ ...form, phone: normalizePhone(e.target.value) })}
                maxLength={10}
              />
            </div>
          </div>

          <div className="mt-3 d-flex gap-2">
            <input
              className="form-control"
              placeholder="S1"
              type="number"
              step="0.01"
              min="0"
              max="100"
              value={form.semester1}
              onChange={e => setForm({ ...form, semester1: e.target.value })}
            />
            <input
              className="form-control"
              placeholder="S2"
              type="number"
              step="0.01"
              min="0"
              max="100"
              value={form.semester2}
              onChange={e => setForm({ ...form, semester2: e.target.value })}
            />
            <input
              className="form-control"
              placeholder="S3"
              type="number"
              step="0.01"
              min="0"
              max="100"
              value={form.semester3}
              onChange={e => setForm({ ...form, semester3: e.target.value })}
            />
            <input
              className="form-control"
              placeholder="S4"
              type="number"
              step="0.01"
              min="0"
              max="100"
              value={form.semester4}
              onChange={e => setForm({ ...form, semester4: e.target.value })}
            />
          </div>

          <div className="mt-3">
            <label className="form-label">Replace photo (optional)</label>
            <input
              type="file"
              onChange={e => setForm({ ...form, image: e.target.files[0] })}
              className="form-control"
              accept="image/*"
            />
          </div>

          <div className="mt-3 d-flex gap-2">
            <button className="btn btn-primary" type="submit" disabled={saving}>
              {saving ? 'Saving…' : 'Save'}
            </button>
            <button type="button" className="btn btn-outline-secondary" onClick={onCancel}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
