import { useDrizzleStudio } from 'expo-drizzle-studio-plugin';
import { Image, ImageBackground } from 'expo-image';
import { Link, router, useFocusEffect } from 'expo-router';
import * as SQLite from 'expo-sqlite';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { IconButton, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import images from '@/helpers/images';

const emptyStateWidth = Dimensions.get('window').width;

const TITLE_TEXT = 'MY GUITARS';

const HORIZONTAL_MARGIN = 32;
const HALF_SIZE = 2;
const PADDING = 4;

const db = SQLite.openDatabaseSync('stringLife');

const createTable = async () => {
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS stringLife (
      id INTEGER PRIMARY KEY NOT NULL, 
      name TEXT NOT NULL, 
      type TEXT NOT NULL, 
      replacement_date INTEGER, 
      progress INTEGER);
  `);
};

const typesToIcons = {
  electro: images.electroGuitar,
  acoustic: images.acousticGuitar,
  bass: images.bassGuitar,
  ukulele: images.ukulele,
};

function typeToIcon(type) {
  return typesToIcons[type];
}

export default function Index() {
  useDrizzleStudio(db);

  const { colors } = useTheme();

  const [rows, setRows] = useState([]);

  async function fetchData() {
    const allRows = await db.getAllAsync('SELECT * FROM stringLife');

    setRows(allRows);
  }

  useEffect(() => {
    createTable();
  }, []);

  useFocusEffect(() => {
    fetchData();
  });

  const width = useWindowDimensions().width;

  const calculatedElementWidth =
    width / HALF_SIZE - HORIZONTAL_MARGIN - PADDING;

  return (
    <SafeAreaView
      edges={['left', 'right', 'bottom', 'top']}
      style={[styles.dashboard, { backgroundColor: colors.background }]}
    >
      <Text style={[styles.title, { color: colors.scrim }]}>{TITLE_TEXT}</Text>

      {rows.length ? (
        <ScrollView contentContainerStyle={styles.instrumentList}>
          <View style={styles.instrumentListWrapper}>
            {rows.map((row) => (
              <Pressable
                style={styles.instrument}
                key={row.id}
                onPress={() => router.push('/instrument')}
              >
                <View style={styles.instrumentImage}>
                  <Image
                    source={typeToIcon(row.type)}
                    width={calculatedElementWidth}
                    height="140"
                    contentFit="contain"
                  />
                </View>
                <Text style={styles.instrumentTitle}>{row.name}</Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>
      ) : (
        <View style={styles.imageBackgroundCentered}>
          <ImageBackground
            source={images.emptyStateBackground}
            contentFit="contain"
          >
            <Image
              source={images.emptyState}
              style={styles.image}
              contentFit="contain"
            />
          </ImageBackground>
        </View>
      )}
      <Link href="/add-instrument" asChild>
        <IconButton
          containerColor={colors.primary}
          iconColor={colors.scrim}
          mode="contained"
          icon={'plus'}
          size={40}
          style={styles.addButton}
        />
      </Link>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  addButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 60,
    alignSelf: 'center',
  },
  instrument: {
    borderRadius: 16,
    paddingHorizontal: 6,
    paddingTop: 8,
  },
  instrumentImage: {
    backgroundColor: '#24221F',
    borderRadius: 15,
    marginBottom: 15,
    paddingVertical: 10,
  },
  gradient: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
  },
  instrumentTitle: {
    color: '#161616',
    fontSize: 12,
    alignSelf: 'center',
    marginBottom: 15,
  },
  instrumentList: {
    marginTop: 60,
  },
  instrumentListWrapper: {
    flexWrap: 'wrap',
    rowGap: 24,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  dashboard: {
    flex: 1,
    alignItems: 'flex-start',
    paddingHorizontal: 16,
  },
  image: {
    width: emptyStateWidth,
    height: emptyStateWidth,
  },
  imageBackgroundCentered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  title: {
    fontSize: 20,
    fontWeight: '400',
    alignSelf: 'flex-start',
    marginTop: 60,
    marginLeft: 16,
  },
});
