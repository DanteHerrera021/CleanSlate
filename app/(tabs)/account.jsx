// app/(tabs)/about.jsx
import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function AboutScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Account Page</Text>
      <Link href="/index">Go to Home</Link>
    </View>
  );
}
