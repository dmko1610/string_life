import { Link, RelativePathString } from 'expo-router';
import { useState } from 'react';
import { StyleSheet } from 'react-native';
import { FAB, Text, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import useInstruments from '@/hooks/useInstruments';
import i18n, { KEYS } from '@/lib/i18n';

import DeleteDialog from '../components/DeleteDialog';
import EmptyState from '../components/EmptyState';
import GuitarCardList from '../components/GuitarCardList';

interface DashboardProps {
  onLayout: () => void;
}

export default function Dashboard({ onLayout }: DashboardProps) {
  const { colors } = useTheme();
  const { rows, loading, deleteInstrument } = useInstruments();

  const [visible, setVisible] = useState(false);
  const [deleteId, setDeleteId] = useState(0);

  const showDialog = (id: number) => {
    setVisible(true);
    setDeleteId(id);
  };

  return (
    <SafeAreaView
      edges={['left', 'right', 'bottom', 'top']}
      style={[styles.dashboard, { backgroundColor: colors.background }]}
      onLayout={onLayout}
    >
      <Text style={styles.title}>{i18n.t(KEYS.DASHBOARD.TITLE)}</Text>

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
    marginBottom: 42,
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
    alignItems: 'flex-start',
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '400',
    alignSelf: 'flex-start',
    marginTop: 60,
    marginBottom: 10,
    marginLeft: 16,
  },
});
