import { useAuth } from '../context/AuthContext';
import { useStats } from '../hooks/useStats';

export default function ProfilePage() {
  const { user } = useAuth();
  const { summary } = useStats();

  return (
    <div className="page">
      <h1>Profile</h1>
      <div className="profile-card">
        <h2>{user?.username}</h2>
        <p>{user?.email}</p>
        <p className="sub">Member since {user ? new Date(user.createdAt).toLocaleDateString() : ''}</p>
      </div>
      {summary && (
        <div className="stats-strip">
          <div className="stat-card"><span className="stat-value">{summary.totalSessions}</span><span className="stat-label">Sessions</span></div>
          <div className="stat-card"><span className="stat-value">{summary.totalRoutes}</span><span className="stat-label">Routes</span></div>
          <div className="stat-card"><span className="stat-value">{summary.successRate}%</span><span className="stat-label">Send rate</span></div>
        </div>
      )}
    </div>
  );
}
