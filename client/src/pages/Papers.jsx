import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs.jsx';
import './Papers.css';

export default function Papers({ user }) {
  const { courseId } = useParams();
  const [papers, setPapers] = useState([]);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchPapers = () => {
    fetch(`/api/papers/course/${courseId}`, { credentials: 'include' })
      .then(r => r.json())
      .then(data => {
        setPapers(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetch(`/api/courses/${courseId}`, { credentials: 'include' })
      .then(r => r.json())
      .then(data => setCourse(data))
      .catch(() => {});
    fetchPapers();
  }, [courseId]);

  const handleDelete = async (id) => {
    if (!confirm('Delete this paper?')) return;
    await fetch(`/api/papers/${id}`, { method: 'DELETE', credentials: 'include' });
    fetchPapers();
  };

  const canManage = user.role === 'lecturer' || user.role === 'admin';

  if (loading) return <p className="loading-text">Loading papers...</p>;

  return (
    <div>
      <Breadcrumbs items={[
        { label: 'Departments', to: '/' },
        ...(course ? [
          { label: course.department_name, to: `/departments/${course.department_id}/courses` },
          { label: `${course.name} (${course.code})` },
        ] : [
          { label: 'Past Papers' },
        ]),
      ]} />
      <div className="dept-hero">
        <h1>{course ? `${course.name}` : 'Past Papers'}</h1>
        {course && <p>{course.code} &middot; {course.department_name}</p>}
      </div>
      {papers.length === 0 ? (
        <p className="empty-state">No past papers uploaded for this course yet.</p>
      ) : (
        <div className="papers-list">
          {papers.map(paper => (
            <div key={paper.id} className="paper-item">
              <div className="paper-year">{paper.year}</div>
              <div className="paper-body">
                <div className="paper-title">{paper.title}</div>
                <div className="paper-meta">
                  <span className="paper-exam-badge">{paper.exam_type}</span>
                  <span className="paper-uploader">{paper.file_name}</span>
                </div>
              </div>
              <div className="paper-actions">
                <a href={`/api/papers/${paper.id}/download`} className="download-link">Download</a>
                {canManage && (
                  <button onClick={() => handleDelete(paper.id)} className="btn-delete">Delete</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
