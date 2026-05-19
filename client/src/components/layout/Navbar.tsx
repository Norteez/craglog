import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate('/login');
  }

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">CragLog</Link>
      {user && (
        <div className="navbar-links">
          <Link to="/">Dashboard</Link>
          <Link to="/sessions">Sessions</Link>
          <Link to="/sessions/new" className="btn-primary">+ Log Session</Link>
          <Link to="/profile">{user.username}</Link>
          <button onClick={handleLogout} className="btn-ghost">Log out</button>
        </div>
      )}
    </nav>
  );
}
