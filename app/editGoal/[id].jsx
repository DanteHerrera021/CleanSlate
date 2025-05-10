// TODO: CREATE RADIO BUTTONS
// TODO: CHANGE DEFAULT STYLING IN STYLES.JS
// TODO: CREATE SUBMIT METHOD UTILIZING STORAGE.JS

import { Button, Pressable, Text, TextInput, View } from "react-native";
import PageContainer from "../../components/PageContainer";
import { useLocalSearchParams, useRouter } from "expo-router";
import Goal from "./../../models/goal";
import { getGoalById, syncGoal } from "../../utils/storage";
import { useEffect, useState } from "react";
import { globalStyles } from "../../constants/styles";
import colors from "../../constants/colors";
import RadioCircle from "../../components/RadioCircle";
import ProgressSlider from "../../components/ProgressSlider";

export default function EditGoal() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [focusedField, setFocusedField] = useState(false);

  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0);

      const diff = midnight - now;

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      const h = hours.toString().padStart(2, "0");
      const m = minutes.toString().padStart(2, "0");
      const s = seconds.toString().padStart(2, "0");

      setTimeLeft(`${h}:${m}:${s}`);
    };

    updateTime(); // initial call
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  const [goal, setGoal] = useState(null);

  useEffect(() => {
    const fetchGoals = async () => {
      const loadedGoal = await getGoalById(id);
      setGoal(loadedGoal);
    };

    fetchGoals();
  }, []);

  const [goalName, setGoalName] = useState("");
  const [goalDesc, setGoalDesc] = useState("");
  const [goalDifficulty, setGoalDifficulty] = useState(null);
  const [goalProgress, setGoalProgress] = useState(null);
  const options = [
    { id: 1, name: "easy" },
    { id: 2, name: "medium" },
    { id: 3, name: "hard" }
  ];

  useEffect(() => {
    if (goal) {
      console.log("Loaded goal:", goal);
      setGoalName(goal.name);
      setGoalDesc(goal.description);
      setGoalDifficulty(goal.difficulty);
      setGoalProgress(goal.progress);
    }
  }, [goal]);

  const submitGoal = async () => {
    try {
      goal.name = goalName;
      goal.description = goalDesc;
      goal.difficulty = goalDifficulty;
      goal.progress = goalProgress;

      await syncGoal(goal);
      console.log("Goal saved!");
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
        <Text style={globalStyles.titleText}>Edit Goal</Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center"
          }}
        >
          <Text
            style={
              (globalStyles.subHeaderText, { color: colors.secondaryAccent })
            }
          >
            Time left -{" "}
          </Text>
          <Text
            style={{
              backgroundColor: colors.secondaryText,
              color: colors.secondary,
              padding: 4,
              borderRadius: 5
            }}
          >
            {timeLeft}
          </Text>
        </View>
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
          justifyContent: "space-between"
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

      <View
        style={{
          marginBottom: 16
        }}
      >
        {goal && (
          <ProgressSlider
            progress={goal.progress}
            onUpdate={(newProgress) => {
              const updatedGoal = { ...goal, progress: newProgress };
              setGoal(updatedGoal);
            }}
          />
        )}
      </View>

      <Pressable style={globalStyles.submitBtn} onPress={submitGoal}>
        <Text style={globalStyles.submitBtnText}>Save Goal</Text>
      </Pressable>
    </PageContainer>
  );
}
