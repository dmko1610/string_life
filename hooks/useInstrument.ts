import { useCallback, useEffect, useState } from 'react';

import { getInstrument, updateInstrument } from '@/services/db';

export default function useInstrument(id?: string) {
  const [type, setType] = useState('');
  const [progress, setProgress] = useState(0);
  const [replacementDate, setReplacementDate] = useState<Date>();
  const [loading, setLoading] = useState(true);

  const fetchInstrument = useCallback(async () => {
    if (!id) return;
    setLoading(true);

    try {
      const data = await getInstrument(id);
      if (data) {
        setType(data.type);
        setProgress(data.progress ?? 0);
        setReplacementDate(new Date(data.replacement_date as number));
      }
    } catch (err) {
      console.error('Failed to fetch instrument', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const saveProgress = useCallback(
    async (newProgress: number) => {
      if (!id) return;

      setProgress(newProgress);
      await updateInstrument(newProgress, id);
    },
    [id]
  );

  /* TODO: Extend API for saving replacement date
  const saveReplacementDate = useCallback(
    async (date: Date) => {
      if (!id) return;

      setReplacementDate(date);
      await updateInstrument(progress, id, date.getTime());
    },
    [id, progress]
  ); */

  useEffect(() => {
    fetchInstrument();
  }, [fetchInstrument]);

  return {
    type,
    progress,
    replacementDate,
    loading,
    saveProgress,
  };
}
