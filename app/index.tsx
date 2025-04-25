import { useDrizzleStudio } from 'expo-drizzle-studio-plugin';
import { Link, RelativePathString, useFocusEffect } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useCallback, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { FAB, Text, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import useInstruments from '@/hooks/useInstruments';
import i18n, { KEYS } from '@/lib/i18n';
import db, { createTable } from '@/services/db';

import DeleteDialog from './components/DeleteDialog';
import EmptyState from './components/EmptyState';
import GuitarCard from './components/GuitarCard';

SplashScreen.preventAutoHideAsync();

SplashScreen.setOptions({
  duration: 1000,
  fade: true,
});

export default function Index() {
  useDrizzleStudio(db);

  const { colors } = useTheme();

  const [appIsReady, setAppIsReady] = useState(false);
  const [visible, setVisible] = useState(false);
  const [deleteId, setDeleteId] = useState(0);
  const { rows, loading, deleteInstrument } = useInstruments();

  const showDialog = (id: number) => {
    setVisible(true);
    setDeleteId(id);
  };
  const hideDialog = () => setVisible(false);

  useEffect(() => {
    createTable();
  }, []);

  useFocusEffect(
    useCallback(() => {
      setAppIsReady(true);
    }, [])
  );

  const onLayoutRootView = useCallback(() => {
    if (appIsReady) {
      SplashScreen.hide();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <SafeAreaView
      edges={['left', 'right', 'bottom', 'top']}
      style={[styles.dashboard, { backgroundColor: colors.background }]}
      onLayout={onLayoutRootView}
    >
      <Text style={styles.title}>{i18n.t(KEYS.DASHBOARD.TITLE)}</Text>

      {rows.length ? (
        <ScrollView
          contentContainerStyle={styles.instrumentList}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.instrumentListWrapper}>
            {rows.map((row) => (
              <GuitarCard
                key={row.id}
                id={row.id}
                type={row.type}
                name={row.name}
                onLongPress={showDialog}
              />
            ))}
          </View>
        </ScrollView>
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
        hideDialog={hideDialog}
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
