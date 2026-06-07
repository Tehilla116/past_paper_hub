import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api.js';
import './Navbar.css';

export default function Navbar({ user, setUser }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await api('/api/auth/logout', { method: 'POST' });
    setUser(null);
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">Past Paper Hub</Link>
        {user && (
          <div className="navbar-links">
            <Link to="/" className="nav-link">Home</Link>
            {(user.role === 'lecturer' || user.role === 'admin') && (
              <Link to="/upload" className="nav-link">Upload</Link>
            )}
            {user.role === 'admin' && (
              <Link to="/admin" className="nav-link">Admin</Link>
            )}
            <span className="nav-user">
              <span className="nav-role">{user.role}</span>
              <button onClick={handleLogout} className="btn-logout">Logout</button>
            </span>
          </div>
        )}
      </div>
    </nav>
  );
}
