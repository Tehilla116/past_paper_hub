import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api.js';
import './Departments.css';

export default function Departments() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api('/api/departments')
      .then(r => r.json())
      .then(data => {
        setDepartments(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <p className="loading-text">Loading archive...</p>;

  return (
    <div>
      <div className="dept-hero">
        <h1>Browse past papers</h1>
        <p>Select a school to explore its examination archive.</p>
      </div>
      <div className="dept-grid">
        {departments.map(dept => (
          <Link to={`/departments/${dept.id}/courses`} key={dept.id} className="dept-card">
            <h2>{dept.name}</h2>
            <span className="dept-arrow">→</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
