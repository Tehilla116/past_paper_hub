import { useState, useEffect } from 'react';
import './UploadPaper.css';

export default function UploadPaper() {
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [departmentId, setDepartmentId] = useState('');
  const [courseId, setCourseId] = useState('');
  const [title, setTitle] = useState('');
  const [year, setYear] = useState(new Date().getFullYear());
  const [examType, setExamType] = useState('Final');
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/departments', { credentials: 'include' })
      .then(r => r.json())
      .then(data => setDepartments(data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!departmentId) return setCourses([]);
    fetch(`/api/departments/${departmentId}/courses`, { credentials: 'include' })
      .then(r => r.json())
      .then(data => setCourses(data))
      .catch(() => {});
  }, [departmentId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    if (!courseId || !title || !file) return setError('All fields are required.');
    const formData = new FormData();
    formData.append('course_id', courseId);
    formData.append('title', title);
    formData.append('year', year);
    formData.append('exam_type', examType);
    formData.append('file', file);
    const res = await fetch('/api/papers', {
      method: 'POST',
      credentials: 'include',
      body: formData,
    });
    const data = await res.json();
    if (!res.ok) return setError(data.error);
    setMessage('Paper uploaded successfully.');
    setTitle('');
    setFile(null);
    setYear(new Date().getFullYear());
    setExamType('Final');
  };

  return (
    <div className="upload-page">
      <div className="upload-card">
        <h1>Upload a past paper</h1>
        <form onSubmit={handleSubmit}>
          <label>School</label>
          <select value={departmentId} onChange={e => { setDepartmentId(e.target.value); setCourseId(''); }}>
            <option value="">Select school</option>
            {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
          <label>Course</label>
          <select value={courseId} onChange={e => setCourseId(e.target.value)} disabled={!departmentId}>
            <option value="">Select course</option>
            {courses.map(c => <option key={c.id} value={c.id}>{c.name} ({c.code})</option>)}
          </select>
          <label>Title</label>
          <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Computer Science Final Exam" />
          <div className="upload-row">
            <div>
              <label>Year</label>
              <input type="number" value={year} onChange={e => setYear(e.target.value)} min="2000" max={new Date().getFullYear()} />
            </div>
            <div>
              <label>Exam type</label>
              <select value={examType} onChange={e => setExamType(e.target.value)}>
                <option>Final</option>
                <option>Midterm</option>
                <option>Quiz</option>
                <option>Assignment</option>
              </select>
            </div>
          </div>
          <label>File (PDF, DOC, DOCX, PNG, JPG — max 10MB)</label>
          <input type="file" onChange={e => setFile(e.target.files[0])} accept=".pdf,.doc,.docx,.png,.jpg,.jpeg" />
          {error && <p className="upload-error">{error}</p>}
          {message && <p className="upload-success">{message}</p>}
          <button type="submit">Upload paper</button>
        </form>
      </div>
    </div>
  );
}
