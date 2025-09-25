import { Button, Dialog, Text, useTheme } from 'react-native-paper';

import { useTranslation } from '@/hooks/useTranslation';
import { KEYS } from '@/lib/i18n';

export default function DeleteDialog({
  visible,
  deleteFn,
  deleteId,
  hideDialog,
}: {
  visible: boolean;
  deleteFn: (id?: string) => Promise<void>;
  deleteId: string;
  hideDialog: () => void;
}) {
  const { t } = useTranslation();
  const { colors } = useTheme();

  const handleDeleteFn = async () => {
    deleteFn(deleteId);
    hideDialog();
  };

  return (
    <Dialog visible={visible} dismissable={false} testID="dialog">
      <Dialog.Icon icon="alert" />
      <Dialog.Title style={{ textAlign: 'center' }}>
        {t(KEYS.DASHBOARD.DELETE_QUESTION)}
      </Dialog.Title>

      <Dialog.Content>
        <Text variant="bodyLarge">{t(KEYS.DASHBOARD.DELETE_CONFIRM)}</Text>
        <Dialog.Actions>
          <Button
            onPress={handleDeleteFn}
            textColor={colors.error}
            testID="deleteButton"
          >
            {t(KEYS.DASHBOARD.DELETE_BUTTON)}
          </Button>
          <Button
            onPress={hideDialog}
            textColor={colors.primary}
            testID="cancelButton"
          >
            {t(KEYS.DASHBOARD.CANCEL_BUTTON)}
          </Button>
        </Dialog.Actions>
      </Dialog.Content>
    </Dialog>
  );
}
