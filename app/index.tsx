import { useDrizzleStudio } from 'expo-drizzle-studio-plugin';
import { Link, RelativePathString, useFocusEffect } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import * as SQLite from 'expo-sqlite';
import React, { useCallback, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { FAB, Text, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import EmptyState from './components/EmptyState';
import GuitarCard from './components/GuitarCard';

export type Instrument = {
  id: number;
  name: string;
  type: string;
  replacement_date?: number | null;
  progress?: number | null;
};

const TITLE_TEXT = 'MY GUITARS';

const GET_DATA_QUERY = 'SELECT * FROM stringLife';
const CREATE_TABLE_QUERY = `
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS stringLife (
      id INTEGER PRIMARY KEY NOT NULL, 
      name TEXT NOT NULL, 
      type TEXT NOT NULL, 
      replacement_date INTEGER, 
      progress INTEGER);
  `;

const db = SQLite.openDatabaseSync('stringLife');

const createTable = async () => {
  await db.execAsync(CREATE_TABLE_QUERY);
};

SplashScreen.preventAutoHideAsync();

SplashScreen.setOptions({
  duration: 1000,
  fade: true,
});

export default function Index() {
  useDrizzleStudio(db);

  const { colors } = useTheme();

  const [appIsReady, setAppIsReady] = useState(false);
  const [rows, setRows] = useState<Instrument[]>([]);

  const fetchData = useCallback(async () => {
    const allRows: Instrument[] = await db.getAllAsync(GET_DATA_QUERY);

    setRows(allRows);
  }, []);

  useEffect(() => {
    createTable();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchData();
      setAppIsReady(true);
    }, [fetchData])
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
      <Text style={styles.title}>{TITLE_TEXT}</Text>

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
  instrument: {
    borderRadius: 16,
    paddingHorizontal: 6,
    paddingTop: 8,
  },
  instrumentImage: {
    borderRadius: 15,
    marginBottom: 15,
    paddingVertical: 10,
  },
  instrumentTitle: {
    fontSize: 12,
    alignSelf: 'center',
    marginBottom: 15,
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
