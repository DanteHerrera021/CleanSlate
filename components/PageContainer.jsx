import { View, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { globalStyles } from "../constants/styles";

export default function PageContainer({ children }) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        globalStyles.pageContainer,
        {
          paddingTop: insets.top + 16,
          paddingBottom: insets.bottom,
          paddingLeft: insets.left + 16,
          paddingRight: insets.right + 16
        }
      ]}
    >
      {children}
    </View>
  );
}
