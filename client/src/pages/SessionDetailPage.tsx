import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSession } from '../hooks/useSessions';
import { sessionsApi } from '../api/sessions.api';
import { Route } from '../types';
import { useState } from 'react';

export default function SessionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { session, setSession, isLoading, error } = useSession(id!);
  const [editingRoute, setEditingRoute] = useState<string | null>(null);

  async function handleDeleteSession() {
    if (!confirm('Delete this session? This cannot be undone.')) return;
    await sessionsApi.delete(id!);
    navigate('/sessions');
  }

  async function handleToggleComplete(route: Route) {
    const { data } = await sessionsApi.updateRoute(id!, route.id, { completed: !route.completed });
    setSession((s) => s ? { ...s, routes: s.routes.map((r) => r.id === route.id ? data.route : r) } : s);
  }

  async function handleDeleteRoute(routeId: string) {
    await sessionsApi.deleteRoute(id!, routeId);
    setSession((s) => s ? { ...s, routes: s.routes.filter((r) => r.id !== routeId) } : s);
  }

  if (isLoading) return <div className="page"><p>Loading...</p></div>;
  if (error || !session) return <div className="page"><p>Session not found.</p></div>;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>{new Date(session.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</h1>
          <p className="sub">{session.location} · {session.locationType}</p>
          {session.notes && <p className="notes">{session.notes}</p>}
        </div>
        <div className="actions">
          <Link to={`/sessions/${id}/edit`} className="btn-secondary">Edit</Link>
          <button onClick={handleDeleteSession} className="btn-danger">Delete</button>
        </div>
      </div>

      <table className="routes-table">
        <thead>
          <tr>
            <th>Grade</th><th>Style</th><th>Attempts</th><th>Sent</th><th>Notes</th><th></th>
          </tr>
        </thead>
        <tbody>
          {session.routes.map((route) => (
            <tr key={route.id}>
              <td>{route.grade} <span className="grade-system">{route.gradeSystem}</span></td>
              <td>{route.style}</td>
              <td>{route.attempts}</td>
              <td>
                <input type="checkbox" checked={route.completed} onChange={() => handleToggleComplete(route)} />
              </td>
              <td>{route.notes ?? '—'}</td>
              <td>
                <button onClick={() => handleDeleteRoute(route.id)} className="btn-ghost btn-sm">Remove</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {session.routes.length === 0 && <p className="empty-state">No routes logged for this session.</p>}
    </div>
  );
}
