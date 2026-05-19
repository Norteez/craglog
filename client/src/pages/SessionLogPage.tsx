import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSessions } from '../hooks/useSessions';

export default function SessionLogPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useSessions(page);

  return (
    <div className="page">
      <div className="page-header">
        <h1>Sessions</h1>
        <Link to="/sessions/new" className="btn-primary">+ Log session</Link>
      </div>

      {isLoading && <p>Loading...</p>}

      {data?.sessions.map((s) => (
        <Link key={s.id} to={`/sessions/${s.id}`} className="session-row">
          <span className="session-date">{new Date(s.date).toLocaleDateString()}</span>
          <span className="session-location">{s.location}</span>
          <span className="session-type">{s.locationType}</span>
          <span className="session-count">{s._count?.routes ?? 0} routes</span>
        </Link>
      ))}

      {data?.sessions.length === 0 && (
        <p className="empty-state">No sessions yet. <Link to="/sessions/new">Log your first climb</Link></p>
      )}

      {data && data.pages > 1 && (
        <div className="pagination">
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>Previous</button>
          <span>{page} / {data.pages}</span>
          <button onClick={() => setPage((p) => Math.min(data.pages, p + 1))} disabled={page === data.pages}>Next</button>
        </div>
      )}
    </div>
  );
}
