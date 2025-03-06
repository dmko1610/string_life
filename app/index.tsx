import { useDrizzleStudio } from 'expo-drizzle-studio-plugin';
import { Image, ImageBackground } from 'expo-image';
import {
  Link,
  RelativePathString,
  useFocusEffect,
  useRouter,
} from 'expo-router';
import * as SQLite from 'expo-sqlite';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { Card, FAB, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import { typeToIcon } from '@/helpers/iconizator';
import images from '@/helpers/images';

export type Instrument = {
  id: number;
  name: string;
  type: string;
  replacement_date?: number | null;
  progress?: number | null;
};

const emptyStateWidth = Dimensions.get('window').width;

const TITLE_TEXT = 'MY GUITARS';

const HORIZONTAL_MARGIN = 32;
const HALF_SIZE = 2;
const PADDING = 4;

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

export default function Index() {
  useDrizzleStudio(db);

  const { colors } = useTheme();
  const router = useRouter();

  const [rows, setRows] = useState<Instrument[]>([]);

  const width = useWindowDimensions().width;

  const calculatedElementWidth: number =
    width / HALF_SIZE - HORIZONTAL_MARGIN - PADDING;

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
    }, [fetchData])
  );

  return (
    <SafeAreaView
      edges={['left', 'right', 'bottom', 'top']}
      style={[styles.dashboard, { backgroundColor: colors.background }]}
    >
      <Text style={[styles.title, { color: colors.onBackground }]}>
        {TITLE_TEXT}
      </Text>

      {rows.length ? (
        <ScrollView
          contentContainerStyle={styles.instrumentList}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.instrumentListWrapper}>
            {rows.map((row) => (
              <Card
                mode="contained"
                contentStyle={[
                  styles.card,
                  { backgroundColor: colors.primary },
                ]}
                onPress={() =>
                  router.push({
                    pathname: '/instrument',
                    params: { id: row.id },
                  })
                }
              >
                <Card.Cover
                  resizeMode="contain"
                  resizeMethod="resize"
                  source={typeToIcon(row.type)}
                  style={[
                    styles.cardCover,
                    {
                      width: calculatedElementWidth,
                      backgroundColor: colors.background,
                    },
                  ]}
                />
                <Card.Title
                  title={row.name}
                  titleStyle={[styles.cardTitle, { color: colors.onPrimary }]}
                />
              </Card>
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
  card: {
    paddingHorizontal: 6,
    paddingTop: 6,
    borderRadius: 12,
  },
  cardCover: {
    borderRadius: 6,
    padding: 8,
  },
  cardTitle: {
    alignSelf: 'center',
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
