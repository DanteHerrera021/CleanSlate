import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, View, Platform } from "react-native";
import colors from "../../constants/colors";

function CustomTabBarButton({ children, onPress }) {
  return (
    <Pressable
      android_ripple={{
        color: colors.tertiaryAccent, // subtle ripple
        radius: 50,
        borderless: false,
        foreground: false,
        centered: true // 👈 force ripple to start from center
      }}
      onPress={onPress}
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      {children}
    </Pressable>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      initialRouteName="index"
      screenOptions={({ route }) => ({
        tabBarButton: (props) => <CustomTabBarButton {...props} />,

        // Icons
        tabBarIcon: ({ color, size, focused }) => {
          let iconName;

          if (route.name === "index") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "goals") {
            iconName = focused ? "bookmark" : "bookmark-outline";
          } else if (route.name === "account") {
            iconName = focused ? "person" : "person-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },

        // Tab bar styling
        tabBarActiveTintColor: colors.secondaryText,
        tabBarInactiveTintColor: colors.secondaryText,
        tabBarStyle: {
          height: 55,
          backgroundColor: colors.secondary
        },

        // Header Styling
        headerStyle: {
          backgroundColor: colors.primary,
          elevation: 0,
          shadowOpacity: 0
        },
        headerTintColor: colors.primaryText,
        headerTitleStyle: {
          fontWeight: "bold"
        }
      })}
    >
      <Tabs.Screen name="goals" options={{ title: "Saved Goals" }} />
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="account" options={{ title: "Account" }} />
    </Tabs>
  );
}
