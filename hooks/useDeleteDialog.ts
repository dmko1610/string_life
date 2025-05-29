import { useCallback, useState } from 'react';

export default function useDeleteDialog() {
  const [visible, setVisible] = useState(false);
  const [deleteId, setDeleteId] = useState<number>(0);

  const showDialog = useCallback((id: number) => {
    setVisible(true);
    setDeleteId(id);
  }, []);

  const hideDialog = useCallback(() => {
    setVisible(false);
    setDeleteId(0);
  }, []);

  return {
    visible,
    deleteId,
    showDialog,
    hideDialog,
  };
}
