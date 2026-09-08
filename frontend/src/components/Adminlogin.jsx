// src/components/AdminLogin.jsx
import React, { useState } from 'react';

export default function AdminLogin({ onLogin }) {
  const [tokenInput, setTokenInput] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (typeof onLogin === 'function') {
      onLogin(tokenInput.trim());
    }
  }

  return (
    <div style={{ maxWidth: 420 }}>
      <h3>Admin Login</h3>

      <form onSubmit={handleSubmit}>
        <div className="mb-2">
          <input
            type="text"
            className="form-control"
            placeholder="Admin password"
            value={tokenInput}
            onChange={(e) => setTokenInput(e.target.value)}
            autoFocus
          />
        </div>

        <div className="d-flex gap-2">
          <button type="submit" className="btn btn-primary">Login</button>
          <button type="button" className="btn btn-outline-secondary" onClick={() => setTokenInput('')}>Clear</button>
        </div>
      </form>
    </div>
  );
}
