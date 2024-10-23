import { View } from "react-native";
import Guitar from "./guitar";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Guitar />
    </View>
  );
}
