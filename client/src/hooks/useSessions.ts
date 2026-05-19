import { useState, useEffect } from 'react';
import { sessionsApi } from '../api/sessions.api';
import { Session, SessionsPage } from '../types';

export function useSessions(page = 1) {
  const [data, setData] = useState<SessionsPage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    sessionsApi.list(page)
      .then(({ data }) => setData(data))
      .catch(() => setError('Failed to load sessions'))
      .finally(() => setIsLoading(false));
  }, [page]);

  function invalidate() {
    setIsLoading(true);
    sessionsApi.list(page)
      .then(({ data }) => setData(data))
      .catch(() => setError('Failed to load sessions'))
      .finally(() => setIsLoading(false));
  }

  return { data, isLoading, error, invalidate };
}

export function useSession(id: string) {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    sessionsApi.get(id)
      .then(({ data }) => setSession(data.session))
      .catch(() => setError('Failed to load session'))
      .finally(() => setIsLoading(false));
  }, [id]);

  return { session, setSession, isLoading, error };
}
