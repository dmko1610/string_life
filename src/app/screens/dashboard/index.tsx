import { router } from 'expo-router';
import { StyleSheet } from 'react-native';
import { Appbar, FAB, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import DeleteDialog from '@/app/components/DeleteDialog';
import EmptyState from '@/app/components/EmptyState';
import GuitarCardList from '@/app/components/GuitarCardList';
import LanguageSwitcher from '@/app/components/LanguageSwitcher';
import useDeleteDialog from '@/hooks/useDeleteDialog';
import useInstruments from '@/hooks/useInstruments';
import { useTranslation } from '@/hooks/useTranslation';
import { KEYS } from '@/lib/i18n';

interface DashboardProps {
  onLayout: () => void;
}

export default function Dashboard({ onLayout }: DashboardProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { rows, deleteInstrument } = useInstruments();

  const { visible, deleteId, showDialog, hideDialog } = useDeleteDialog();

  const navigate = () => router.navigate('/screens/add-instrument');

  return (
    <SafeAreaView
      edges={['bottom']}
      style={[styles.dashboard, { backgroundColor: colors.background }]}
      onLayout={onLayout}
    >
      <Appbar.Header mode="center-aligned">
        <Appbar.Content title={t(KEYS.DASHBOARD.TITLE)} />
        <LanguageSwitcher />
      </Appbar.Header>

      {Array.isArray(rows) && rows.length > 0 ? (
        <GuitarCardList instruments={rows} showDeleteDialog={showDialog} />
      ) : (
        <EmptyState />
      )}

      <FAB
        onPress={navigate}
        color={colors.primary}
        icon="plus"
        size="large"
        variant="primary"
        style={styles.addButton}
      />

      <DeleteDialog
        visible={visible}
        deleteFn={deleteInstrument}
        deleteId={deleteId}
        hideDialog={hideDialog}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  addButton: {
    position: 'absolute',
    borderRadius: 50,
    marginBottom: 64,
    alignSelf: 'center',
    bottom: 0,
  },
  instrumentList: {
    paddingTop: 30,
    paddingBottom: 80,
  },
  instrumentListWrapper: {
    flexWrap: 'wrap',
    rowGap: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  dashboard: {
    flex: 1,
    paddingHorizontal: 16,
  },
});
