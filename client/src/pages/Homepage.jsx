import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Homepage.css';

export default function Homepage({ user }) {
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/departments', { credentials: 'include' }).then(r => r.json()),
      fetch('/api/courses', { credentials: 'include' }).then(r => r.json()),
    ])
      .then(([depts, crs]) => {
        setDepartments(depts);
        setCourses(crs);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <p className="loading-text">Loading...</p>;

  return (
    <div className="fade-in">
      <section className="home-hero">
        <h1>Past Paper Hub</h1>
        <p className="home-hero-sub">
          Zambia University of Technology — examination archive
        </p>
        <p className="home-hero-desc">
          Browse, download, and upload past examination papers across all schools and courses.
        </p>
      </section>

      <section className="home-stats">
        <div className="stat-card">
          <span className="stat-number">{departments.length}</span>
          <span className="stat-label">Schools</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{courses.length}</span>
          <span className="stat-label">Courses</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">&mdash;</span>
          <span className="stat-label">Papers</span>
        </div>
      </section>

      <section className="home-actions">
        <Link to="/departments" className="action-card">
          <span className="action-icon action-icon-browse" aria-hidden="true"></span>
          <span className="action-title">Browse Papers</span>
          <span className="action-desc">Explore past papers by school and course</span>
        </Link>
        {(user?.role === 'lecturer' || user?.role === 'admin') && (
          <Link to="/upload" className="action-card">
            <span className="action-icon action-icon-upload" aria-hidden="true"></span>
            <span className="action-title">Upload Paper</span>
            <span className="action-desc">Contribute a past paper to the archive</span>
          </Link>
        )}
        {user?.role === 'admin' && (
          <Link to="/admin" className="action-card">
            <span className="action-icon action-icon-admin" aria-hidden="true"></span>
            <span className="action-title">Admin Panel</span>
            <span className="action-desc">Manage schools, courses, and users</span>
          </Link>
        )}
      </section>
    </div>
  );
}
