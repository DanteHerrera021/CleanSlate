// components/PageContainer.jsx
import { View, StyleSheet } from "react-native";
import colors from "../constants/colors";

export default function PageContainer({ children }) {
  return <View style={styles.container}>{children}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    padding: 16
  }
});
