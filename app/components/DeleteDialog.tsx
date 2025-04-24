import { Button, Dialog, Text, useTheme } from 'react-native-paper';

import i18n from '@/lib/i18n';

export default function DeleteDialog({
  visible,
  deleteFn,
  deleteId,
  hideDialog,
}: {
  visible: boolean;
  deleteFn: (id: number) => Promise<void>;
  deleteId: number;
  hideDialog: () => void;
}) {
  const { colors } = useTheme();

  return (
    <Dialog visible={visible} dismissable={false}>
      <Dialog.Icon icon="alert" />
      <Dialog.Title style={{ textAlign: 'center' }}>
        {i18n.t('Dashboard.delete.question')}
      </Dialog.Title>

      <Dialog.Content>
        <Text variant="bodyLarge">{i18n.t('Dashboard.delete.confirm')}</Text>
        <Dialog.Actions>
          <Button
            onPress={() => {
              deleteFn(deleteId);
              hideDialog();
            }}
            textColor={colors.error}
          >
            {i18n.t('Dashboard.delete.delete_button')}
          </Button>
          <Button onPress={hideDialog} textColor={colors.primary}>
            {i18n.t('Dashboard.delete.cancel_button')}
          </Button>
        </Dialog.Actions>
      </Dialog.Content>
    </Dialog>
  );
}
