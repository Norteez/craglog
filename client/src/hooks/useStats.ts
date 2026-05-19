import { useState, useEffect } from 'react';
import { statsApi } from '../api/stats.api';
import { StatsSummary, GradeOverTime, VolumePoint, SuccessRatePoint } from '../types';

export function useStats() {
  const [summary, setSummary] = useState<StatsSummary | null>(null);
  const [gradesOverTime, setGradesOverTime] = useState<GradeOverTime[]>([]);
  const [volume, setVolume] = useState<VolumePoint[]>([]);
  const [successRate, setSuccessRate] = useState<SuccessRatePoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      statsApi.summary(),
      statsApi.gradesOverTime(),
      statsApi.volume(),
      statsApi.successRate(),
    ]).then(([s, g, v, sr]) => {
      setSummary(s.data);
      setGradesOverTime(g.data);
      setVolume(v.data);
      setSuccessRate(sr.data);
    }).finally(() => setIsLoading(false));
  }, []);

  return { summary, gradesOverTime, volume, successRate, isLoading };
}
