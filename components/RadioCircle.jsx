import { Pressable, Text, Animated } from "react-native";
import { useEffect, useRef } from "react";
import colors from "../constants/colors"; // adjust import as needed

export default function RadioCircle({ option, isSelected, onPress }) {
  const borderWidth = useRef(new Animated.Value(isSelected ? 5 : 0)).current;

  useEffect(() => {
    Animated.timing(borderWidth, {
      toValue: isSelected ? 3 : 0,
      duration: 100,
      useNativeDriver: false
    }).start();
  }, [isSelected]);

  return (
    <Pressable
      onPress={() => onPress(option.id)}
      style={{
        width: "22.5%"
      }}
    >
      <Animated.View
        style={{
          backgroundColor: colors[option.name + "Light"],
          width: "100%",
          aspectRatio: 1,
          borderRadius: 9999,
          justifyContent: "center",
          alignItems: "center",
          borderColor: colors[option.name + "Dark"],
          borderWidth: borderWidth
        }}
      >
        <Text
          style={{
            color: colors[option.name + "Dark"],
            fontSize: 30,
            fontWeight: "bold"
          }}
        >
          {option.name.toUpperCase().substring(0, 1)}
        </Text>
      </Animated.View>
    </Pressable>
  );
}
