import { View, StyleSheet, Image } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { globalStyles } from "../constants/styles";
import colors from "../constants/colors";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { deletePrevGoals } from "../utils/storage.js";

export default function PageContainer({ children, showHeader, padding }) {
  const insets = useSafeAreaInsets();
  deletePrevGoals();

  return (
    <View style={{ flex: 1 }}>
      {showHeader && (
        <View
          style={{
            backgroundColor: colors.secondary,
            paddingTop: 38,
            paddingVertical: 16,
            paddingHorizontal: 16
          }}
        >
          <Link href={"/"}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center"
              }}
            >
              <Ionicons
                name="arrow-back"
                size={28}
                color={"black"}
                style={{
                  paddingRight: 8
                }}
              ></Ionicons>
              <Image
                source={require("../assets/CleanSlate TypefaceColor.png")}
                style={{
                  height: 40,
                  width: 200,
                  resizeMode: "contain"
                }}
              />
            </View>
          </Link>
        </View>
      )}
      <View
        style={[
          globalStyles.pageContainer,
          padding
            ? {
                paddingTop: insets.top,
                paddingLeft: insets.left + 16,
                paddingRight: insets.right + 16
              }
            : null
        ]}
      >
        {children}
      </View>
    </View>
  );
}
