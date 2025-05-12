import { Pressable, Text, TextInput, View } from "react-native";
import PageContainer from "../components/PageContainer";
import { useRouter } from "expo-router";
import { syncGoal } from "../utils/storage";
import { useEffect, useRef, useState } from "react";
import { globalStyles } from "../constants/styles";
import colors from "../constants/colors";
import RadioCircle from "../components/RadioCircle";
import ProgressSlider from "../components/ProgressSlider";
import Goal from "../models/goal";

export default function AddGoal() {
  const router = useRouter();

  const [focusedField, setFocusedField] = useState(false);

  const [goalName, setGoalName] = useState("");
  const [goalDesc, setGoalDesc] = useState("");
  const [goalDifficulty, setGoalDifficulty] = useState(null);
  const options = [
    { id: 1, name: "easy" },
    { id: 2, name: "medium" },
    { id: 3, name: "hard" }
  ];

  const submitGoal = async () => {
    try {
      const goal = new Goal(goalName, goalDesc, goalDifficulty);

      await syncGoal(goal);
      router.replace("/");
    } catch (e) {
      console.error("Failed to save goal:", e);
    }
  };

  return (
    <PageContainer showHeader={true} padding={true}>
      <View
        style={{
          justifyContent: "space-between",
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 16
        }}
      >
        <Text style={globalStyles.titleText}>Add Goal</Text>
      </View>

      <Text style={globalStyles.label}>Goal Name:</Text>
      <TextInput
        onFocus={() => setFocusedField("goalName")}
        onBlur={() => setFocusedField(null)}
        style={[
          globalStyles.input,
          focusedField === "goalName" && globalStyles.inputFocused
        ]}
        value={goalName}
        onChangeText={setGoalName}
        placeholder="Enter your goal name"
      />

      <Text style={globalStyles.label}>Goal Description:</Text>
      <TextInput
        onFocus={() => setFocusedField("goalDesc")}
        onBlur={() => setFocusedField(null)}
        style={[
          globalStyles.input,
          focusedField === "goalDesc" && globalStyles.inputFocused
        ]}
        value={goalDesc}
        onChangeText={setGoalDesc}
        placeholder="Enter your goal description"
        multiline={true}
      />

      <Text style={globalStyles.label}>Goal Priority:</Text>

      {/* RADIO BUTTONS */}

      <View
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 16
        }}
      >
        {options.map((option) => (
          <RadioCircle
            key={option.id}
            option={option}
            isSelected={goalDifficulty === option.id}
            onPress={setGoalDifficulty}
          />
        ))}
      </View>

      <Pressable style={globalStyles.submitBtn} onPress={submitGoal}>
        <Text style={globalStyles.submitBtnText}>Add Goal</Text>
      </Pressable>
    </PageContainer>
  );
}
