import { useCallback, useEffect, useState } from 'react';

import { getInstrument, updateInstrument } from '@/services/db';

export default function useInstrument(id: string) {
  const [type, setType] = useState('');
  const [progress, setProgress] = useState(0);
  const [replacementDate, setReplacementDate] = useState<Date>(null);
  const [loading, setLoading] = useState(true);

  const fetchInstrument = useCallback(async () => {
    if (!id) return;
    setLoading(true);

    try {
      setLoading(true);
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
      setProgress(newProgress);

      await updateInstrument(id, newProgress, replacementDate.getTime());
    },
    [id, replacementDate]
  );

  const editInstrument = useCallback(
    async (newProgress: number, date: Date) => {
      try {
        setLoading(true);
        setProgress(newProgress);
        setReplacementDate(date);

        await updateInstrument(id, newProgress, date.getTime());
      } catch (err) {
        console.error('Failed to update instrument', err);
      } finally {
        setLoading(false);
      }
    },
    [id]
  );

  useEffect(() => {
    fetchInstrument();
  }, [fetchInstrument]);

  return {
    type,
    progress,
    replacementDate,
    loading,
    saveProgress,
    editInstrument,
    refetch: fetchInstrument,
  };
}
