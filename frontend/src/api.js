// src/api.js
const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000'; // keep this empty if CRA proxy is set to backend

function getCurrentToken(passedToken) {
  return passedToken || localStorage.getItem('adminToken') || '';
}

async function handleJsonResponse(res) {
  const text = await res.text();
  try {
    const json = text ? JSON.parse(text) : {};
    if (!res.ok) throw new Error(json.error || json.message || text || res.statusText);
    return json;
  } catch (e) {
    if (!res.ok) throw new Error(text || res.statusText);
    return text;
  }
}

export async function fetchStudents() {
  const res = await fetch(`${API_BASE}/api/students`);
  return res.json();
}

export async function fetchStudent(id) {
  const res = await fetch(`${API_BASE}/api/students/${id}`);
  if (!res.ok) throw new Error('Not found');
  return res.json();
}

export async function adminAddStudent(formData, passedToken) {
  const token = getCurrentToken(passedToken);
  const headers = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
    headers['x-admin-token'] = token;
  }

  // IMPORTANT: don't set Content-Type here; let browser set multipart boundary
  const res = await fetch(`${API_BASE}/api/students`, {
    method: 'POST',
    headers,
    body: formData
  });

  return handleJsonResponse(res);
}

export async function adminUpdateStudent(id, formData, passedToken) {
  const token = getCurrentToken(passedToken);
  const headers = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
    headers['x-admin-token'] = token;
  }

  const res = await fetch(`${API_BASE}/api/students/${id}`, {
    method: 'PUT',
    headers,
    body: formData
  });

  return handleJsonResponse(res);
}

export async function adminDeleteStudent(id, passedToken) {
  const token = getCurrentToken(passedToken);
  const headers = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
    headers['x-admin-token'] = token;
  }

  const res = await fetch(`${API_BASE}/api/students/${id}`, {
    method: 'DELETE',
    headers
  });

  return handleJsonResponse(res);
}
