import { useState, useEffect } from 'react';
import { api } from '../api.js';
import './AdminPanel.css';

export default function AdminPanel() {
  const [tab, setTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [deptName, setDeptName] = useState('');
  const [deptSlug, setDeptSlug] = useState('');
  const [courseName, setCourseName] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const [courseSlug, setCourseSlug] = useState('');
  const [courseDept, setCourseDept] = useState('');
  const [editingDept, setEditingDept] = useState(null);
  const [editingCourse, setEditingCourse] = useState(null);

  const fetchUsers = () => {
    api('/api/users')
      .then(r => r.json())
      .then(data => setUsers(data))
      .catch(() => {});
  };

  const fetchDepartments = () => {
    api('/api/departments')
      .then(r => r.json())
      .then(data => setDepartments(data))
      .catch(() => {});
  };

  const fetchCourses = () => {
    api('/api/courses')
      .then(r => r.json())
      .then(data => setCourses(data))
      .catch(() => {});
  };

  useEffect(() => { fetchUsers(); fetchDepartments(); fetchCourses(); }, []);

  const handleRoleChange = async (userId, role) => {
    await api(`/api/users/${userId}/role`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ role }),
    });
    fetchUsers();
  };

  const handleDeactivate = async (userId) => {
    if (!confirm('Deactivate this user?')) return;
    await api(`/api/users/${userId}/deactivate`, {
      method: 'PUT',
      credentials: 'include',
    });
    fetchUsers();
  };

  const handleDeptSubmit = async (e) => {
    e.preventDefault();
    if (editingDept) {
      await api(`/api/departments/${editingDept}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name: deptName, slug: deptSlug }),
      });
    } else {
      await api('/api/departments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name: deptName, slug: deptSlug }),
      });
    }
    setDeptName(''); setDeptSlug(''); setEditingDept(null);
    fetchDepartments();
  };

  const handleCourseSubmit = async (e) => {
    e.preventDefault();
    if (editingCourse) {
      await api(`/api/courses/${editingCourse}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: courseName, code: courseCode, slug: courseSlug, department_id: courseDept,
        }),
      });
    } else {
      await api('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name: courseName, code: courseCode, slug: courseSlug, department_id: courseDept }),
      });
    }
    setCourseName(''); setCourseCode(''); setCourseSlug(''); setCourseDept('');
    setEditingCourse(null);
    fetchCourses();
  };

  const editDept = (d) => {
    setEditingDept(d.id); setDeptName(d.name); setDeptSlug(d.slug); setTab('departments');
  };

  const editCourse = (c) => {
    setEditingCourse(c.id); setCourseName(c.name); setCourseCode(c.code);
    setCourseSlug(c.slug); setCourseDept(c.department_id); setTab('courses');
  };

  return (
    <div className="fade-in">
      <div className="dept-hero">
        <h1>Admin panel</h1>
        <p>Manage users, schools, and courses.</p>
      </div>
      <div className="admin-tabs">
        <button className={`admin-tab ${tab === 'users' ? 'active' : ''}`} onClick={() => setTab('users')}>Users</button>
        <button className={`admin-tab ${tab === 'departments' ? 'active' : ''}`} onClick={() => setTab('departments')}>Schools</button>
        <button className={`admin-tab ${tab === 'courses' ? 'active' : ''}`} onClick={() => setTab('courses')}>Courses</button>
      </div>

      {tab === 'users' && (
        <div className="admin-section">
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id}>
                    <td>{u.name}</td>
                    <td style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>{u.email}</td>
                    <td><span className={`role-badge role-${u.role}`}>{u.role}</span></td>
                    <td style={{ fontSize: '0.85rem', color: u.active ? 'var(--text)' : 'var(--muted)' }}>{u.active ? 'Active' : 'Inactive'}</td>
                    <td>
                      <select value={u.role} onChange={e => handleRoleChange(u.id, e.target.value)} className="role-select">
                        <option value="student">student</option>
                        <option value="lecturer">lecturer</option>
                        <option value="admin">admin</option>
                      </select>
                      {u.active && <button onClick={() => handleDeactivate(u.id)} className="btn-deactivate">Deactivate</button>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'departments' && (
        <div className="admin-section">
          <form onSubmit={handleDeptSubmit} className="admin-form">
            <input type="text" placeholder="School name" value={deptName} onChange={e => setDeptName(e.target.value)} required />
            <input type="text" placeholder="Slug (e.g. engineering)" value={deptSlug} onChange={e => setDeptSlug(e.target.value)} required />
            <button type="submit">{editingDept ? 'Update' : 'Add'} school</button>
            {editingDept && (
              <button type="button" onClick={() => { setEditingDept(null); setDeptName(''); setDeptSlug(''); }} className="btn-cancel">Cancel</button>
            )}
          </form>
          <div className="admin-list">
            {departments.map(d => (
              <div key={d.id} className="admin-list-item">
                <span>{d.name}</span>
                <button onClick={() => editDept(d)} className="btn-edit">Edit</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'courses' && (
        <div className="admin-section">
          <form onSubmit={handleCourseSubmit} className="admin-form">
            <input type="text" placeholder="Course name" value={courseName} onChange={e => setCourseName(e.target.value)} required />
            <input type="text" placeholder="Code" value={courseCode} onChange={e => setCourseCode(e.target.value)} required />
            <input type="text" placeholder="Slug" value={courseSlug} onChange={e => setCourseSlug(e.target.value)} required />
            <select value={courseDept} onChange={e => setCourseDept(e.target.value)} required>
              <option value="">Select school</option>
              {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
            <button type="submit">{editingCourse ? 'Update' : 'Add'} course</button>
            {editingCourse && (
              <button type="button" onClick={() => { setEditingCourse(null); setCourseName(''); setCourseCode(''); setCourseSlug(''); setCourseDept(''); }} className="btn-cancel">Cancel</button>
            )}
          </form>
          <div className="admin-list">
            {courses.map(c => (
              <div key={c.id} className="admin-list-item">
                <span>{c.name} <span style={{ color: 'var(--muted)' }}>({c.code})</span></span>
                <button onClick={() => editCourse(c)} className="btn-edit">Edit</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
