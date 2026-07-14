import { useCallback, useEffect, useState } from 'react';

import {
  deleteInstrumentById,
  getInstrument,
  updateInstrument,
} from '@/services/instrumentService';

export default function useInstrument(id: string) {
  const [type, setType] = useState('');
  const [progress, setProgress] = useState(0);
  const [replacementDate, setReplacementDate] = useState<Date | null>(null);
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
        setReplacementDate(
          data.replacement_date ? new Date(data.replacement_date) : null
        );
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

      if (replacementDate) {
        await updateInstrument(id, newProgress, replacementDate.getTime());
      }
    },
    [id, replacementDate]
  );

  const editInstrument = useCallback(
    async (newProgress: number, date: Date | null) => {
      if (!date) return;

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

  const deleteInstrument = useCallback(async () => {
    await deleteInstrumentById(id);
  }, [id]);

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
    deleteInstrument,
    refetch: fetchInstrument,
  };
}
