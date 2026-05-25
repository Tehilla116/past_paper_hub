import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs.jsx';
import './Departments.css';
import './Courses.css';

export default function Courses() {
  const { departmentId } = useParams();
  const [courses, setCourses] = useState([]);
  const [deptName, setDeptName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/departments/${departmentId}/courses`, { credentials: 'include' })
      .then(r => r.json())
      .then(data => {
        setCourses(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));

    fetch('/api/departments', { credentials: 'include' })
      .then(r => r.json())
      .then(data => {
        const dept = data.find(d => d.id === Number(departmentId));
        if (dept) setDeptName(dept.name);
      })
      .catch(() => {});
  }, [departmentId]);

  if (loading) return <p className="loading-text">Loading courses...</p>;

  return (
    <div className="fade-in">
      <Breadcrumbs items={[
        { label: 'Departments', to: '/' },
        { label: deptName || 'Courses' },
      ]} />
      <div className="dept-hero">
        <h1>{deptName || 'Courses'}</h1>
        <p>Select a course to view its past papers.</p>
      </div>
      {courses.length === 0 ? (
        <p className="empty-state">No courses available for this school yet.</p>
      ) : (
        <div className="dept-grid">
          {courses.map(course => (
            <Link to={`/courses/${course.id}/papers`} key={course.id} className="dept-card">
              <div>
                <h2>{course.name}</h2>
                <span className="course-code-badge">{course.code}</span>
              </div>
              <span className="dept-arrow">→</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
