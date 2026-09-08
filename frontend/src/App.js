// src/App.js
import React, { useState } from 'react';
import StudentList from './components/StudentList';
import StudentView from './components/StudentView';
import AdminLogin from './components/Adminlogin';
import AdminDashboard from './components/AdminDashboard';
import EditStudent from './components/EditStudent';

export default function App() {
  const [route, setRoute] = useState({ name: 'home', id: null });
  const [token, setToken] = useState(localStorage.getItem('adminToken') || '');

React.useEffect(() => {
  // only auto-logout when we go to 'home'
  if (route.name === 'home' && token) {
    setToken('');
    localStorage.removeItem('adminToken');
    console.log('Auto-logged out because route changed to', route.name);
  }
}, [route.name, token]);


  return (
    <div>

      {/* NAVBAR */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary mb-4">
  <div className="container">

    {/* Brand */}
    <button
      className="navbar-brand btn btn-link p-0 text-decoration-none text-white"
      type="button"
      onClick={() => setRoute({ name: "home" })}
    >
      Student Results
    </button>

    {/* Mobile toggle */}
    <button
      className="navbar-toggler"
      type="button"
      data-bs-toggle="collapse"
      data-bs-target="#mainNav"
    >
      <span className="navbar-toggler-icon"></span>
    </button>

    <div className="collapse navbar-collapse" id="mainNav">
      <ul className="navbar-nav ms-auto">

        {/* HOME button */}
        <li className="nav-item">
          <button
            type="button"
            className="nav-link btn btn-link"
            onClick={() => setRoute({ name: "home" })}
          >
            Home
          </button>
        </li>

        {/* ADMIN / DASHBOARD button */}
        <li className="nav-item">
          <button
            type="button"
            className="nav-link btn btn-link"
            onClick={() => {
              if (token) setRoute({ name: "admin" });
              else setRoute({ name: "login" });
            }}
          >
            {token ? "Dashboard" : "Admin"}
          </button>
        </li>

      </ul>
    </div>
  </div>
</nav>


      {/* PAGE CONTENT */}
      <div className="container">

        {/* HOME */}
        {route.name === 'home' && (
          <StudentList onView={(id) => setRoute({ name: 'view', id, from: 'home' })} />
        )}

        {/* VIEW STUDENT */}
        {route.name === 'view' && (
          <StudentView
            id={route.id}
            onBack={() => setRoute({ name: route.from || 'home' })}
          />
        )}

        {/* ADMIN LOGIN */}
        {route.name === 'login' && (
          <AdminLogin
            onLogin={(t) => {
              setToken(t);
              localStorage.setItem('adminToken', t);
              setRoute({ name: 'admin' });
            }}
          />
        )}

        {/* ADMIN DASHBOARD */}
        {route.name === 'admin' && (
          <AdminDashboard
            token={token}
            onLogout={() => {
              setToken('');
              localStorage.removeItem('adminToken');
              setRoute({ name: 'home' });
            }}
            onEdit={(id) => setRoute({ name: 'edit', id })}
            onView={(id) => setRoute({ name: 'view', id, from: 'admin' })}
          />
        )}

        {/* EDIT PAGE */}
        {route.name === 'edit' && (
          <EditStudent
            id={route.id}
            token={token}
            onDone={() => setRoute({ name: 'admin' })}
            onCancel={() => setRoute({ name: 'admin' })}
          />
        )}

      </div>
    </div>
  );
}
