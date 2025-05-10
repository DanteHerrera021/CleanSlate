import Slider from "@react-native-community/slider";
import { useState, useEffect } from "react";
import { View, Text } from "react-native";
import { globalStyles } from "../constants/styles";

export default function GoalProgressSlider({ progress, onUpdate }) {
  const [sliderValue, setSliderValue] = useState(0);

  useEffect(() => {
    if (progress !== undefined) {
      setSliderValue(progress / 100);
    }
  }, [progress]);

  const handleSlidingComplete = (value) => {
    const newProgress = Math.round(value * 100);
    onUpdate?.(newProgress);
  };

  return (
    <View style={{ paddingVertical: 16 }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          paddingHorizontal: 8
        }}
      >
        <Text style={globalStyles.label}>Goal Progress:</Text>
        <Text style={globalStyles.label}>{Math.round(sliderValue * 100)}%</Text>
      </View>

      <Slider
        style={{ width: "100%", height: 40 }}
        minimumValue={0}
        maximumValue={1}
        step={0.01}
        value={sliderValue}
        onValueChange={setSliderValue}
        onSlidingComplete={handleSlidingComplete}
        minimumTrackTintColor="#007bff"
        maximumTrackTintColor="#ccc"
        thumbTintColor="#007bff"
      />
    </View>
  );
}
