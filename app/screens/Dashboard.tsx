import { Link, RelativePathString } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { FAB, Text, useTheme } from 'react-native-paper';
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
      edges={['left', 'right', 'bottom', 'top']}
      style={[styles.dashboard, { backgroundColor: colors.background }]}
      onLayout={onLayout}
    >
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{t(KEYS.DASHBOARD.TITLE)}</Text>
        <LanguageSwitcher />
      </View>

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
    marginLeft: 16,
    flex: 1,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 10,
  },
});
