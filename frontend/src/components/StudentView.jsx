// src/components/StudentView.jsx
import React, { useEffect, useState } from 'react';
import { fetchStudent } from '../api';

function formatDob(d) {
  try {
    const iso = /^\d{4}-\d{2}-\d{2}$/.test(d) ? `${d}T00:00:00` : d;
    return new Date(iso).toLocaleDateString();
  } catch (e) {
    return d;
  }
}

export default function StudentView({ id, onBack }) {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetchStudent(id)
      .then(data => setStudent(data))
      .catch(e => setErr('Failed to load student'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div>Loading…</div>;
  if (err) return <div className="alert alert-danger">{err}</div>;
  if (!student) return <div>No student found</div>;

  return (
    <div>
      <button className="btn btn-link mb-3" onClick={onBack}>← Back</button>
      <div className="card p-3">
        <div className="row">
          <div className="col-md-8">
            <h3>{student.name} <small className="text-muted">({student.roll_no})</small></h3>
            <p className="mb-1"><strong>Class:</strong> {student.class || 'N/A'}</p>
            <p className="mb-1"><strong>DOB:</strong> {student.dob ? formatDob(student.dob) : 'N/A'}</p>
            <p className="mb-1"><strong>Email:</strong> {student.email || 'N/A'}</p>
            <p className="mb-1"><strong>Phone:</strong> {student.phone || 'N/A'}</p>

            <h5 className="mt-3">Semesters</h5>
            <div className="d-flex gap-2">
              <div className="p-2 border rounded">S1: {student.semester1 ?? 'N/A'}</div>
              <div className="p-2 border rounded">S2: {student.semester2 ?? 'N/A'}</div>
              <div className="p-2 border rounded">S3: {student.semester3 ?? 'N/A'}</div>
              <div className="p-2 border rounded">S4: {student.semester4 ?? 'N/A'}</div>
            </div>

            <p className="mt-3"><strong>Percentage:</strong> {student.percentage ?? 'N/A'}</p>
          </div>

          <div className="col-md-4 text-center">
            {student.image_path ? (
              <div style={{
                width:200, height:200, backgroundImage:`url(${process.env.REACT_APP_API_BASE || 'http://localhost:5000'}${student.image_path})`,
                backgroundSize:'cover', backgroundPosition:'center', borderRadius:12
              }} />
            ) : (
              <div style={{width:200, height:200, background:'#f1f5f9', borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center'}}>
                No Photo
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
