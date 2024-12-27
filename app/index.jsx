import * as SQLite from "expo-sqlite"
import React, { useEffect, useState } from "react"
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  Pressable,
  ScrollView,
  useWindowDimensions,
} from "react-native"
import { Image, ImageBackground } from "expo-image"
import { Link, useFocusEffect } from "expo-router"
import { SafeAreaView } from "react-native-safe-area-context"
import { useDrizzleStudio } from "expo-drizzle-studio-plugin"

import images from "@/helpers/images"
import IconAddButton from "@/assets/icons/addButton.svg"
import { Colors } from "@/constants/Colors"

const emptyStateWidth = Dimensions.get("window").width

const TITLE_TEXT = "MY GUITARS"

const HORIZONTAL_MARGIN = 32
const HALF_SIZE = 2
const PADDING = 4

const db = SQLite.openDatabaseSync("stringLife")

const createTable = async () => {
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS stringLife (
      id INTEGER PRIMARY KEY NOT NULL, 
      name TEXT NOT NULL, 
      type TEXT NOT NULL, 
      replacement_date INTEGER, 
      progress INTEGER);
  `)
}

const typesToIcons = {
  electro: images.electroGuitar,
  acoustic: images.acousticGuitar,
  bass: images.bassGuitar,
  ukulele: images.ukulele,
}

function typeToIcon(type) {
  return typesToIcons[type]
}

export default function Index() {
  useDrizzleStudio(db)

  const [rows, setRows] = useState([])

  async function fetchData() {
    const allRows = await db.getAllAsync("SELECT * FROM stringLife")

    setRows(allRows)
  }

  useEffect(() => {
    createTable()
  }, [])

  useFocusEffect(() => {
    fetchData()
  })

  const width = useWindowDimensions().width

  const calculatedElementWidth = width / HALF_SIZE - HORIZONTAL_MARGIN - PADDING

  return (
    <SafeAreaView
      edges={["left", "right", "bottom", "top"]}
      style={styles.dashboard}
    >
      <Text style={styles.title}>{TITLE_TEXT}</Text>

      {rows.length ? (
        <ScrollView contentContainerStyle={styles.instrumentList}>
          <View style={styles.instrumentListWrapper}>
            {rows.map((row) => (
              <View style={styles.instrument}>
                <View style={styles.instrumentImage}>
                  <Image
                    source={typeToIcon(row.type)}
                    width={calculatedElementWidth}
                    height="140"
                    contentFit="contain"
                  />
                </View>
                <Text style={styles.instrumentTitle}>{row.name}</Text>
              </View>
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
        <Pressable style={{ alignSelf: "center" }}>
          <IconAddButton style={styles.addButton} testID="addButton" />
        </Pressable>
      </Link>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  instrument: {
    borderRadius: 16,
    paddingHorizontal: 6,
    paddingTop: 8,
    backgroundColor: Colors.dark.text,
  },
  instrumentImage: {
    backgroundColor: Colors.dark.background,
    borderRadius: 15,
    marginBottom: 15,
    paddingVertical: 10,
  },
  instrumentTitle: {
    color: "#161616",
    fontSize: 12,
    alignSelf: "center",
    marginBottom: 15,
  },
  instrumentList: {
    marginTop: 60,
  },
  instrumentListWrapper: {
    flexWrap: "wrap",
    rowGap: 24,
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  dashboard: {
    backgroundColor: "#151515",
    flex: 1,
    alignItems: "flex-start",
    paddingHorizontal: 16,
  },
  image: {
    width: emptyStateWidth,
    height: emptyStateWidth,
  },
  imageBackgroundCentered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  title: {
    fontSize: 20,
    fontWeight: "400",
    color: "#E5DBD0",
    alignSelf: "flex-start",
    marginTop: 60,
    marginLeft: 16,
  },
  addButton: { marginBottom: 60 },
})
