// src/components/StudentList.jsx
import React, { useEffect, useState } from 'react';
import { fetchStudents } from '../api';

export default function StudentList({ onView }) {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchStudents().then(setStudents).catch(console.error);
  }, []);

  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.roll_no.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h2>Students</h2>

      {/* 🔍 Search bar */}
      <input
        type="text"
        className="form-control mb-3"
        placeholder="Search by name or roll no..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="list-group">
        {filtered.map(s => (
          <div key={s.id} className="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <strong>{s.name}</strong>
              <div className="text-muted">{s.roll_no}</div>
            </div>

            <button className="btn btn-primary btn-sm" onClick={() => onView(s.id)}>
              View
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
