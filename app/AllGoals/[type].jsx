import { useEffect, useRef, useState } from "react";
import { Animated, Text, View } from "react-native";
import {
  loadCompletedGoals,
  loadIncompleteGoals,
  removeGoalById
} from "../../utils/storage";
import PageContainer from "../../components/PageContainer";
import colors from "../../constants/colors";
import { globalStyles } from "../../constants/styles";
import { Link, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import SwipeToDelete from "../../components/SwipeToDelete";

export default function AllGoals() {
  const { type } = useLocalSearchParams();
  const [goals, setGoals] = useState([]);
  const mapAnims = useRef({});
  const animating = useRef(false);

  useEffect(() => {
    const loadGoals = async () => {
      const data =
        type.toLowerCase() === "complete"
          ? await loadCompletedGoals()
          : await loadIncompleteGoals();

      const animatedMap = {};
      data.forEach((g) => {
        animatedMap[g.id] = new Animated.Value(1);
      });
      mapAnims.current = animatedMap;
      setGoals(data);
    };

    loadGoals();
  }, [type]);

  const handleSwipe = (key, type) => {
    const ref = mapAnims;

    const setList = setGoals;

    if (!animating.current && ref[key]) {
      animating.current = true;
      Animated.timing(ref[key], {
        toValue: 0,
        duration: 200,
        useNativeDriver: false
      }).start(async () => {
        await removeGoalById(key);
        const updated =
          type === "incomplete"
            ? await loadIncompleteGoals()
            : await loadCompletedGoals();
        setList(updated);
        animating.current = false;
      });
    }
  };

  return (
    <PageContainer showHeader={true}>
      <View
        style={{
          paddingHorizontal: 16,
          backgroundColor: colors.secondary,
          paddingTop: 16,
          paddingBottom: 8,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center"
          }}
        >
          <Text style={globalStyles.titleText}>
            {type === "complete" ? "Completed Goals Today" : "Your Goals Today"}
          </Text>
        </View>
        <Link style={{ padding: 2 }} href={"/addGoal"}>
          <Ionicons name="add" size={30} color={colors.primaryText}></Ionicons>
        </Link>
      </View>
      <SwipeToDelete
        goals={goals}
        animatedValues={mapAnims.current}
        handleSwipe={handleSwipe}
      />
    </PageContainer>
  );
}
