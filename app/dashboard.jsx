import React from "react"
import { Dimensions, StyleSheet, Text, View } from "react-native"
import { Image } from "expo-image"
import images from "@/helpers/images"
import { BlurView } from "expo-blur"

export default function Dashboard() {
  const emptyStateWidth = Dimensions.get("screen").width
  const emptyStateHeight = Dimensions.get("screen").height / 2

  return (
    <View style={styles.dashboard}>
      <Text style={styles.title}>MY GUITARS</Text>
      <View
        style={{
          // flex: 1,
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <BlurView intensity={100} tint="dark" />
        <Image
          source={images.emptyState}
          width={emptyStateWidth}
          height={emptyStateHeight}
          contentFit="contain"
          contentPosition={"center"}
          style={{ alignSelf: "center" }}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  dashboard: {
    // backgroundColor: "#151515",
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    paddingHorizontal: 16,
    paddingTop: 70,
  },
  title: {
    fontSize: 20,
    fontWeight: "400",
    color: "#E5DBD0",
  },
})
