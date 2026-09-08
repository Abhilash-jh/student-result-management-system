// src/components/AdminDashboard.jsx
import React, { useEffect, useState } from 'react';
import { fetchStudents, adminAddStudent, adminDeleteStudent } from '../api';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000';

export default function AdminDashboard({ token, onLogout, onEdit, onView }) {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({
    roll_no: '', name: '', class: '', dob: '', email: '', phone: '',
    semester1: '', semester2: '', semester3: '', semester4: '', image: null
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // load students
  async function load() {
    try {
      const s = await fetchStudents();
      setStudents(s);
    } catch (e) {
      console.error('fetchStudents error', e);
    }
  }

  useEffect(() => { load(); }, []);

  // add student
  async function add(e) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const fd = new FormData();
      Object.keys(form).forEach(k => {
        if (k === 'image') {
          if (form.image) fd.append('image', form.image);
        } else {
          fd.append(k, form[k] ?? '');
        }
      });
      await adminAddStudent(fd, token);
      await load();
      // reset form (keep token)
      setForm({
        roll_no: '', name: '', class: '', dob: '', email: '', phone: '',
        semester1: '', semester2: '', semester3: '', semester4: '', image: null
      });
    } catch (err) {
      console.error('Add error', err);
      setError(err.message || 'Add failed');
    } finally {
      setSaving(false);
    }
  }

  async function del(id) {
    if (!window.confirm('Delete?')) return;
    try {
      await adminDeleteStudent(id, token);
      await load();
    } catch (err) {
      console.error('Delete error', err);
      alert('Delete failed');
    }
  }

  // filter students by search term
  const filtered = students.filter(s => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (s.name || '').toLowerCase().includes(q)
      || (s.roll_no || '').toLowerCase().includes(q)
      || ((s.class || '') + '').toLowerCase().includes(q);
  });

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Admin Dashboard</h3>
        <div>
          <button className="btn btn-secondary me-2" onClick={onLogout}>Logout</button>
        </div>
      </div>

      <div className="row g-3">
        {/* Left: Add Student */}
        <div className="col-md-5">
          <div className="card p-3">
            <h5 className="mb-3">Add Student</h5>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={add}>
              <input className="form-control my-1" placeholder="Roll No" value={form.roll_no}
                onChange={e => setForm({ ...form, roll_no: e.target.value })} required />
              <input className="form-control my-1" placeholder="Name" value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })} required />
              <div className="d-flex gap-2">
                <input className="form-control my-1" placeholder="Class" value={form.class}
                  onChange={e => setForm({ ...form, class: e.target.value })} />
                <input className="form-control my-1" type="date" value={form.dob}
                  onChange={e => setForm({ ...form, dob: e.target.value })} />
              </div>
              <input className="form-control my-1" placeholder="Email" value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })} />
              <input className="form-control my-1" placeholder="Phone" value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })} />

              <div className="d-flex gap-2 mt-2">
                <input className="form-control" placeholder="S1" value={form.semester1}
                  onChange={e => setForm({ ...form, semester1: e.target.value })} />
                <input className="form-control" placeholder="S2" value={form.semester2}
                  onChange={e => setForm({ ...form, semester2: e.target.value })} />
                <input className="form-control" placeholder="S3" value={form.semester3}
                  onChange={e => setForm({ ...form, semester3: e.target.value })} />
                <input className="form-control" placeholder="S4" value={form.semester4}
                  onChange={e => setForm({ ...form, semester4: e.target.value })} />
              </div>

              <div className="my-2">
                <label className="form-label small">Photo (optional)</label>
                <input type="file" className="form-control" onChange={e => setForm({ ...form, image: e.target.files[0] })} />
              </div>

              <button className="btn btn-primary w-100" type="submit" disabled={saving}>
                {saving ? 'Saving…' : 'Add'}
              </button>
            </form>
          </div>
        </div>

        {/* Right: Student list + search */}
        <div className="col-md-7">
          <div className="card p-3">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h5 className="mb-0">Students</h5>
              <input
                type="text"
                className="form-control form-control-sm ms-3"
                placeholder="Search by name, roll or class..."
                style={{ maxWidth: 320 }}
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>

            <div className="list-group mt-2">
              {filtered.length === 0 && <div className="text-muted p-3">No results</div>}

              {filtered.map(s => (
                <div key={s.id} className="list-group-item d-flex gap-3 align-items-center">
                  {/* photo thumbnail */}
                  <div style={{ width: 64, height: 64, flex: '0 0 64px' }}>
                    {s.image_path ? (
                      <img
                        src={`${API_BASE}${s.image_path}`}
                        alt={s.name}
                        style={{ width: '64px', height: '64px', objectFit: 'cover', borderRadius: 6 }}
                      />
                    ) : (
                      <div style={{ width: 64, height: 64, background: '#f1f5f9', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666' }}>
                        No Photo
                      </div>
                    )}
                  </div>

                  {/* main details */}
                  <div style={{ flex: 1 }}>
                    <div className="fw-bold">{s.name}</div>
                    <div className="text-muted small">{s.roll_no} • {s.class}</div>
                  </div>

                  {/* actions */}
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => {
                        console.log('View clicked', s.id);
                        if (typeof onView === 'function') {
                          onView(s.id);
                        } else if (typeof window.appSetRoute === 'function') {
                          window.appSetRoute({ name: 'view', id: s.id, from: 'admin' });
                        } else {
                          alert('View handler not available (onView prop missing).');
                        }
                      }}
                    >
                      View
                    </button>

                    <button
                      type="button"
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => {
                        console.log('Edit clicked', s.id);
                        if (typeof onEdit === 'function') onEdit(s.id);
                        else if (typeof window.appSetRoute === 'function') window.appSetRoute({ name: 'edit', id: s.id });
                        else alert('Edit handler not available.');
                      }}
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      className="btn btn-sm btn-danger"
                      onClick={() => del(s.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div> {/* .list-group */}
          </div> {/* .card */}
        </div> {/* .col-md-7 */}
      </div> {/* .row */}
    </div>
  );
}
