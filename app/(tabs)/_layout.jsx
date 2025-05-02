import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, View, Platform } from "react-native";

function CustomTabBarButton({ children, onPress }) {
  return (
    <Pressable
      android_ripple={{
        color: "rgba(0,0,0,.1)", // subtle ripple
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

        tabBarActiveTintColor: "black",
        tabBarInactiveTintColor: "black",
        tabBarStyle: {
          height: 55
        }
      })}
    >
      <Tabs.Screen name="goals" options={{ title: "Saved Goals" }} />
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="account" options={{ title: "Account" }} />
    </Tabs>
  );
}
