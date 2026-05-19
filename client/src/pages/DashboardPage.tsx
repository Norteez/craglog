import { useStats } from '../hooks/useStats';
import { useSessions } from '../hooks/useSessions';
import VolumeChart from '../components/charts/VolumeChart';
import SuccessRateChart from '../components/charts/SuccessRateChart';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function DashboardPage() {
  const { user } = useAuth();
  const { summary, volume, successRate, isLoading } = useStats();
  const { data: sessionsData } = useSessions(1);

  if (isLoading) return <div className="page"><p>Loading dashboard...</p></div>;

  return (
    <div className="page">
      <h1>Welcome back, {user?.username}</h1>

      {summary && (
        <div className="stats-strip">
          <div className="stat-card">
            <span className="stat-value">{summary.totalSessions}</span>
            <span className="stat-label">Sessions</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{summary.totalRoutes}</span>
            <span className="stat-label">Routes logged</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{summary.successRate}%</span>
            <span className="stat-label">Send rate</span>
          </div>
          {summary.hardestSend && (
            <div className="stat-card">
              <span className="stat-value">{summary.hardestSend.grade}</span>
              <span className="stat-label">Hardest send</span>
            </div>
          )}
        </div>
      )}

      <div className="charts-grid">
        <div className="chart-card">
          <h2>Sessions per week</h2>
          <VolumeChart data={volume} />
        </div>
        <div className="chart-card">
          <h2>Send rate by grade</h2>
          <SuccessRateChart data={successRate} />
        </div>
      </div>

      <div className="recent-sessions">
        <div className="section-header">
          <h2>Recent sessions</h2>
          <Link to="/sessions">View all</Link>
        </div>
        {sessionsData?.sessions.slice(0, 5).map((s) => (
          <Link key={s.id} to={`/sessions/${s.id}`} className="session-row">
            <span>{new Date(s.date).toLocaleDateString()}</span>
            <span>{s.location}</span>
            <span>{s._count?.routes ?? s.routes?.length} routes</span>
          </Link>
        ))}
        {sessionsData?.sessions.length === 0 && (
          <p className="empty-state">No sessions yet. <Link to="/sessions/new">Log your first climb</Link></p>
        )}
      </div>
    </div>
  );
}
