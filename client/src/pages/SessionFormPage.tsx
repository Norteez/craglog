import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { sessionsApi } from '../api/sessions.api';
import { useSession } from '../hooks/useSessions';
import { GradeSystem, ClimbStyle, Route } from '../types';

const sessionSchema = z.object({
  date: z.string().min(1, 'Date is required'),
  location: z.string().min(1, 'Location is required'),
  locationType: z.enum(['GYM', 'OUTDOOR']),
  notes: z.string().optional(),
});
type SessionFormData = z.infer<typeof sessionSchema>;

// A draft route before it has a real ID (not yet saved to the server).
type DraftRoute = Omit<Route, 'id' | 'sessionId' | 'createdAt'> & { _draftId: string };

function addRoute(
  _routes: DraftRoute[],
  setRoutes: React.Dispatch<React.SetStateAction<DraftRoute[]>>
): void {
  setRoutes((prev) => [
    ...prev,
    { _draftId: crypto.randomUUID(), grade: '', gradeSystem: 'YOSEMITE', style: 'SPORT', attempts: 1, completed: false },
  ]);
}

function removeRoute(
  _routes: DraftRoute[],
  setRoutes: React.Dispatch<React.SetStateAction<DraftRoute[]>>,
  draftId: string
): void {
  setRoutes((prev) => prev.filter((r) => r._draftId !== draftId));
}

function updateRoute(
  _routes: DraftRoute[],
  setRoutes: React.Dispatch<React.SetStateAction<DraftRoute[]>>,
  draftId: string,
  field: string,
  value: unknown
): void {
  setRoutes((prev) => prev.map((r) => r._draftId === draftId ? { ...r, [field]: value } : r));
}

export default function SessionFormPage() {
  const { id } = useParams<{ id?: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { session } = useSession(id ?? '');
  const [routes, setRoutes] = useState<DraftRoute[]>([]);
  const [serverError, setServerError] = useState('');

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<SessionFormData>({
    resolver: zodResolver(sessionSchema),
    defaultValues: { locationType: 'GYM' },
  });

  useEffect(() => {
    if (session) {
      reset({
        date: session.date.split('T')[0],
        location: session.location,
        locationType: session.locationType,
        notes: session.notes ?? '',
      });
      setRoutes(session.routes.map((r) => ({ ...r, _draftId: r.id })));
    }
  }, [session, reset]);

  async function onSubmit(data: SessionFormData) {
    setServerError('');
    try {
      const payload = { ...data, date: new Date(data.date).toISOString() };

      if (isEdit && id) {
        await sessionsApi.update(id, payload);
        // Sync routes: delete all existing, re-add (simple approach for MVP)
        for (const route of session?.routes ?? []) {
          await sessionsApi.deleteRoute(id, route.id);
        }
        for (const route of routes) {
          const { _draftId: _, ...routeData } = route;
          await sessionsApi.addRoute(id, routeData);
        }
        navigate(`/sessions/${id}`);
      } else {
        const { data: { session: newSession } } = await sessionsApi.create(payload);
        for (const route of routes) {
          const { _draftId: _, ...routeData } = route;
          await sessionsApi.addRoute(newSession.id, routeData);
        }
        navigate(`/sessions/${newSession.id}`);
      }
    } catch {
      setServerError('Failed to save session. Please try again.');
    }
  }

  return (
    <div className="page">
      <h1>{isEdit ? 'Edit session' : 'Log a session'}</h1>
      {serverError && <p className="error">{serverError}</p>}

      <form onSubmit={handleSubmit(onSubmit)} className="session-form">
        <div className="form-row">
          <label>
            Date
            <input type="date" {...register('date')} />
            {errors.date && <span className="field-error">{errors.date.message}</span>}
          </label>
          <label>
            Location type
            <select {...register('locationType')}>
              <option value="GYM">Gym</option>
              <option value="OUTDOOR">Outdoor</option>
            </select>
          </label>
        </div>
        <label>
          Location name
          <input type="text" placeholder="The Spot, Red River Gorge..." {...register('location')} />
          {errors.location && <span className="field-error">{errors.location.message}</span>}
        </label>
        <label>
          Notes
          <textarea {...register('notes')} rows={3} placeholder="How'd it go?" />
        </label>

        <h2>Routes</h2>
        {routes.map((route) => (
          <div key={route._draftId} className="route-row-form">
            <input
              placeholder="Grade (e.g. V4, 5.11a)"
              value={route.grade}
              onChange={(e) => updateRoute(routes, setRoutes, route._draftId, 'grade', e.target.value)}
            />
            <select
              value={route.gradeSystem}
              onChange={(e) => updateRoute(routes, setRoutes, route._draftId, 'gradeSystem', e.target.value as GradeSystem)}
            >
              <option value="YOSEMITE">Yosemite</option>
              <option value="V_SCALE">V-Scale</option>
              <option value="FRENCH">French</option>
            </select>
            <select
              value={route.style}
              onChange={(e) => updateRoute(routes, setRoutes, route._draftId, 'style', e.target.value as ClimbStyle)}
            >
              <option value="SPORT">Sport</option>
              <option value="TRAD">Trad</option>
              <option value="BOULDER">Boulder</option>
              <option value="TOP_ROPE">Top rope</option>
            </select>
            <input
              type="number"
              min={1}
              value={route.attempts}
              onChange={(e) => updateRoute(routes, setRoutes, route._draftId, 'attempts', Number(e.target.value))}
              style={{ width: 60 }}
            />
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={route.completed}
                onChange={(e) => updateRoute(routes, setRoutes, route._draftId, 'completed', e.target.checked)}
              />
              Sent
            </label>
            <button type="button" onClick={() => removeRoute(routes, setRoutes, route._draftId)} className="btn-ghost btn-sm">
              ✕
            </button>
          </div>
        ))}

        <button type="button" onClick={() => addRoute(routes, setRoutes)} className="btn-secondary">
          + Add route
        </button>

        <div className="form-actions">
          <button type="submit" disabled={isSubmitting} className="btn-primary">
            {isSubmitting ? 'Saving...' : isEdit ? 'Save changes' : 'Log session'}
          </button>
          <button type="button" onClick={() => navigate(-1)} className="btn-ghost">Cancel</button>
        </div>
      </form>
    </div>
  );
}
