import { Pressable, Text, TextInput, View } from "react-native";
import PageContainer from "../../components/PageContainer";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  getSavedGoalById,
  removeSavedGoalById,
  syncGoal,
  syncSavedGoal
} from "../../utils/storage";
import { useEffect, useRef, useState } from "react";
import { globalStyles } from "../../constants/styles";
import RadioCircle from "../../components/RadioCircle";
import { Confetti } from "react-native-fast-confetti";
import Goal from "../../models/goal";

export default function EditSavedGoal() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [hasTriggered, setHasTriggered] = useState(false);
  const confettiRef = useRef();

  const [focusedField, setFocusedField] = useState(false);

  const [goal, setGoal] = useState(null);

  useEffect(() => {
    const fetchGoals = async () => {
      const loadedGoal = await getSavedGoalById(id);
      setGoal(loadedGoal);
    };

    fetchGoals();
  }, []);

  const [goalName, setGoalName] = useState("");
  const [goalDesc, setGoalDesc] = useState("");
  const [goalDifficulty, setGoalDifficulty] = useState(null);
  const options = [
    { id: 1, name: "easy" },
    { id: 2, name: "medium" },
    { id: 3, name: "hard" }
  ];

  useEffect(() => {
    if (goal) {
      setGoalName(goal.name);
      setGoalDesc(goal.description);
      setGoalDifficulty(goal.difficulty);
    }
  }, [goal]);

  useEffect(() => {
    if (!confettiRef.current) return;

    if (goal?.progress === 100 && !hasTriggered) {
      confettiRef.current?.resume?.();
      setHasTriggered(true);
    }

    if (goal?.progress < 100 && hasTriggered) {
      setHasTriggered(false);
    }
  }, [goal?.progress]);

  const submitGoal = async () => {
    try {
      goal.name = goalName;
      goal.description = goalDesc;
      goal.difficulty = goalDifficulty;

      await syncSavedGoal(goal);
      router.replace("/(tabs)/goals");
    } catch (e) {
      console.error("Failed to save goal:", e);
    }
  };

  const deleteGoal = async () => {
    await removeSavedGoalById(id);
    router.replace("/(tabs)/goals");
  };

  const addBackGoal = async () => {
    const saved = await getSavedGoalById(id);
    const goal = new Goal(saved.name, saved.description, saved.difficulty);

    await syncGoal(goal);
    router.replace("/(tabs)/goals");
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
        <Text style={globalStyles.titleText}>Edit Saved Goal</Text>
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

      <Pressable
        style={[globalStyles.submitBtn, { marginVertical: 16 }]}
        onPress={submitGoal}
      >
        <Text style={globalStyles.submitBtnText}>Update Goal</Text>
      </Pressable>

      <Pressable
        style={[globalStyles.addBackBtn, { marginBottom: 16 }]}
        onPress={addBackGoal}
      >
        <Text style={globalStyles.addBackBtnText}>Add to Daily Goals</Text>
      </Pressable>

      <Pressable style={globalStyles.deleteBtn} onPress={deleteGoal}>
        <Text style={globalStyles.deleteBtnText}>Delete Goal</Text>
      </Pressable>
      <Confetti
        ref={confettiRef}
        autoplay={false}
        origin={{ x: 0, y: 0 }}
        fallDuration={5000}
      ></Confetti>
    </PageContainer>
  );
}
