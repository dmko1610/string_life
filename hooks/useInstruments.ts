import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

import { deleteInstrumentById, getAllInstruments } from '@/services/db';
import { Instrument } from '@/model/types';

export default function useInstruments() {
  const [rows, setRows] = useState<Instrument[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    const allRows = await getAllInstruments();
    setRows(allRows);
    setLoading(false);
  }, []);

  const deleteInstrument = useCallback(
    async (id: number) => {
      await deleteInstrumentById(id);
      fetchData();
    },
    [fetchData]
  );

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [fetchData])
  );

  return { rows, loading, deleteInstrument };
}
