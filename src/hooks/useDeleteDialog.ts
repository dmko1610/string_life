import { useCallback, useState } from 'react';

export default function useDeleteDialog() {
  const [visible, setVisible] = useState(false);
  const [deleteId, setDeleteId] = useState<string>('');

  const showDialog = useCallback((id?: string) => {
    if (!id) {
      setVisible(true);
    } else {
      setVisible(true);
      setDeleteId(id);
    }
  }, []);

  const hideDialog = useCallback(() => {
    setVisible(false);
    setDeleteId('');
  }, []);

  return {
    visible,
    deleteId,
    showDialog,
    hideDialog,
  };
}
