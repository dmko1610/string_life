import { Link, RelativePathString } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Appbar, FAB, Text, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import useInstruments from '@/hooks/useInstruments';
import { useTranslation } from '@/hooks/useTranslation';
import { KEYS } from '@/lib/i18n';

import DeleteDialog from '../components/DeleteDialog';
import EmptyState from '../components/EmptyState';
import GuitarCardList from '../components/GuitarCardList';
import LanguageSwitcher from '../components/LanguageSwitcher';

interface DashboardProps {
  onLayout: () => void;
}

export default function Dashboard({ onLayout }: DashboardProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { rows, deleteInstrument } = useInstruments();

  const [visible, setVisible] = useState(false);
  const [deleteId, setDeleteId] = useState(0);

  const showDialog = (id: number) => {
    setVisible(true);
    setDeleteId(id);
  };

  return (
    <SafeAreaView
      edges={['bottom']}
      style={[styles.dashboard, { backgroundColor: colors.background }]}
      onLayout={onLayout}
    >
      <Appbar.Header>
        <Appbar.Content title={t(KEYS.DASHBOARD.TITLE)} />
        <LanguageSwitcher />
      </Appbar.Header>

      {rows.length ? (
        <GuitarCardList instruments={rows} showDeleteDialog={showDialog} />
      ) : (
        <EmptyState />
      )}

      <Link href={'/add-instrument' as RelativePathString} asChild>
        <FAB
          color={colors.primary}
          icon={'plus'}
          size={'large'}
          variant="primary"
          style={styles.addButton}
        />
      </Link>

      <DeleteDialog
        visible={visible}
        deleteFn={deleteInstrument}
        deleteId={deleteId}
        hideDialog={() => setVisible(false)}
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
    justifyContent: 'center',
    alignItems: 'center',
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
