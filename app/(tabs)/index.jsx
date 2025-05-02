// app/(tabs)/index.tsx
import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function HomeScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Home Page</Text>
      {/* <Link href="/about">Go to About</Link> */}
    </View>
  );
}
