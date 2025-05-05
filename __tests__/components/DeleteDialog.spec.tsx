import {
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react-native';
import mockSafeAreaContext from 'react-native-safe-area-context/jest/mock';

import DeleteDialog from '@/app/components/DeleteDialog';
import i18n, { KEYS } from '@/lib/i18n';

jest.mock('expo-font');
jest.mock('react-native-safe-area-context', () => mockSafeAreaContext);

const mockDeleteFn = jest.fn();
const mockDeleteId = 123123123;
const mockHideDialog = jest.fn();

function renderDeleteDialog({
  visible = true,
  deleteFn = mockDeleteFn,
  deleteId = mockDeleteId,
  hideDialog = mockHideDialog,
}) {
  render(
    <DeleteDialog
      visible={visible}
      deleteFn={deleteFn}
      deleteId={deleteId}
      hideDialog={hideDialog}
    />
  );
}

describe('DeleteDialog', () => {
  describe('visible', () => {
    it('displays dialog with texts', () => {
      renderDeleteDialog({});

      expect(screen.getByTestId('dialog')).toBeTruthy();
      expect(
        screen.getByText(i18n.t(KEYS.DASHBOARD.DELETE_QUESTION))
      ).toBeTruthy();
      expect(
        screen.getByText(i18n.t(KEYS.DASHBOARD.DELETE_CONFIRM))
      ).toBeTruthy();
      expect(
        screen.getByText(i18n.t(KEYS.DASHBOARD.DELETE_BUTTON))
      ).toBeTruthy();
      expect(
        screen.getByText(i18n.t(KEYS.DASHBOARD.CANCEL_BUTTON))
      ).toBeTruthy();
    });
  });

  describe('deleteFn & deleteId', () => {
    it('calls given function with given deleteId on delete', async () => {
      const mockDeleteId = 123123;
      const mockDeleteFn = jest.fn();
      renderDeleteDialog({ deleteFn: mockDeleteFn, deleteId: mockDeleteId });

      const deleteButton = await screen.findByTestId('deleteButton');
      fireEvent.press(deleteButton);

      await waitFor(() =>
        expect(mockDeleteFn).toHaveBeenCalledWith(mockDeleteId)
      );
    });
  });

  describe('hide dialog', () => {
    it('calls given function on cancel', async () => {
      const mockHideDialog = jest.fn();
      renderDeleteDialog({ hideDialog: mockHideDialog });

      const cancelButton = await screen.findByTestId('cancelButton');
      fireEvent.press(cancelButton);

      await waitFor(() => expect(mockHideDialog).toHaveBeenCalledTimes(1));
    });
  });
});
