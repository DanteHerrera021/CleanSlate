import { View, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { globalStyles } from "../constants/styles";
import colors from "../constants/colors";

export default function PageContainer({ children, showHeader, padding }) {
  const insets = useSafeAreaInsets();
  console.log(showHeader);

  return (
    <View style={{ flex: 1 }}>
      {showHeader && (
        <View
          style={{
            backgroundColor: colors.secondary,
            paddingVertical: 8,
            paddingHorizontal: 16
          }}
        >
          <Link href={"/"}>
            <Image
              source={require("../assets/CleanSlate TypefaceColor.png")}
              style={{
                height: 40,
                width: 200,
                resizeMode: "contain"
              }}
            />
          </Link>
        </View>
      )}
      <View
        style={[
          globalStyles.pageContainer,
          padding
            ? {
                paddingTop: insets.top + 16,
                paddingBottom: insets.bottom,
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
