import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { api } from './api.js';
import Navbar from './components/Navbar.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Departments from './pages/Departments.jsx';
import Courses from './pages/Courses.jsx';
import Papers from './pages/Papers.jsx';
import UploadPaper from './pages/UploadPaper.jsx';
import AdminPanel from './pages/AdminPanel.jsx';
import './App.css';

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api('/api/auth/me')
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data && data.id) {
          setUser(data);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-screen">Loading...</div>;

  return (
    <div className="app">
      <Navbar user={user} setUser={setUser} />
      <main className="main-content">
        <Routes>
          <Route path="/login" element={user ? <Navigate to="/" /> : <Login setUser={setUser} />} />
          <Route path="/register" element={user ? <Navigate to="/" /> : <Register setUser={setUser} />} />
          <Route path="/" element={user ? <Departments /> : <Navigate to="/login" />} />
          <Route path="/departments/:departmentId/courses" element={user ? <Courses /> : <Navigate to="/login" />} />
          <Route path="/courses/:courseId/papers" element={user ? <Papers user={user} /> : <Navigate to="/login" />} />
          <Route path="/upload" element={user && (user.role === 'lecturer' || user.role === 'admin') ? <UploadPaper /> : <Navigate to="/" />} />
          <Route path="/admin" element={user && user.role === 'admin' ? <AdminPanel /> : <Navigate to="/" />} />
          <Route path="*" element={<div className="not-found"><h2>404 — Page Not Found</h2></div>} />
        </Routes>
      </main>
    </div>
  );
}
