import React, { useEffect } from "react"
import {
  Dimensions,
  ImageBackground,
  Image,
  StyleSheet,
  Text,
  View,
  Pressable,
} from "react-native"
import { Link } from "expo-router"
import images from "@/helpers/images"
import IconAddButton from "@/assets/icons/addButton.svg"
import { SafeAreaView } from "react-native-safe-area-context"
import * as SQLite from "expo-sqlite"
import { useDrizzleStudio } from "expo-drizzle-studio-plugin"

const emptyStateWidth = Dimensions.get("window").width

const TITLE_TEXT = "MY GUITARS"

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

export default function Index() {
  useDrizzleStudio(db)

  useEffect(() => {
    createTable()
  }, [])

  return (
    <SafeAreaView
      edges={["left", "right", "bottom", "top"]}
      style={styles.dashboard}
    >
      <Text style={styles.title}>{TITLE_TEXT}</Text>
      <View style={styles.imageBackgroundCentered}>
        <ImageBackground
          source={images.emptyStateBackground}
          resizeMode="stretch"
        >
          <Image
            source={images.emptyState}
            style={styles.image}
            resizeMode="contain"
          />
        </ImageBackground>
      </View>
      <Link href="/add-instrument" asChild>
        <Pressable>
          <IconAddButton style={styles.addButton} testID="addButton" />
        </Pressable>
      </Link>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  dashboard: {
    backgroundColor: "#151515",
    flex: 1,
    justifyContent: "space-around",
    alignItems: "center",
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
