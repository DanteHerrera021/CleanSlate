import React, { useEffect, useRef, useState } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import PageContainer from "../../components/PageContainer";
import colors from "../../constants/colors";
import { globalStyles } from "../../constants/styles";
import {
  cleanBrokenGoals,
  loadCompletedGoals,
  loadIncompleteGoals,
  removeGoalById
} from "../../utils/storage";
import { Link } from "expo-router";
import SwipeToDelete from "../../components/SwipeToDelete";

export default function HomeScreen() {
  const [incompleteGoals, setIncompleteGoals] = useState([]);
  const [completedGoals, setCompletedGoals] = useState([]);
  const incompleteAnims = useRef({});
  const completedAnims = useRef({});
  const animating = useRef(false);

  useEffect(() => {
    cleanBrokenGoals();

    const fetchGoals = async () => {
      const [incomplete, completed] = await Promise.all([
        loadIncompleteGoals(),
        loadCompletedGoals()
      ]);

      const incompleteMap = {};
      incomplete.forEach((g) => {
        incompleteMap[g.id] = new Animated.Value(1);
      });

      const completedMap = {};
      completed.forEach((g) => {
        completedMap[g.id] = new Animated.Value(1);
      });

      incompleteAnims.current = incompleteMap;
      completedAnims.current = completedMap;
      setIncompleteGoals(incomplete);
      setCompletedGoals(completed);
    };

    fetchGoals();
  }, []);

  const handleSwipe = (key, type) => {
    const ref =
      type === "incomplete" ? incompleteAnims.current : completedAnims.current;

    const setList =
      type === "incomplete" ? setIncompleteGoals : setCompletedGoals;

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
    <PageContainer>
      <View style={{ height: "50%" }}>
        <View style={styles.headerRow}>
          <Link style={styles.headerLeft} href={"/AllGoals/incomplete"}>
            <Text style={globalStyles.titleText}>Your Goals Today </Text>
            <Ionicons
              name="arrow-forward"
              size={20}
              style={{ fontWeight: "bold" }}
              color={colors.primaryText}
            />
          </Link>
          <Link style={{ padding: 2 }} href={"/addGoal"}>
            <Ionicons name="add" size={30} color={colors.primaryText} />
          </Link>
        </View>

        <SwipeToDelete
          goals={incompleteGoals}
          animatedValues={incompleteAnims.current}
          handleSwipe={handleSwipe}
          type="incomplete"
        />
      </View>

      <View style={{ height: "50%" }}>
        <View style={styles.completedHeader}>
          <Link style={styles.headerLeft} href={"/AllGoals/complete"}>
            <Text style={globalStyles.titleText}>Completed Goals </Text>
            <Ionicons
              name="arrow-forward"
              size={20}
              style={{ fontWeight: "bold" }}
              color={colors.primaryText}
            />
          </Link>
        </View>

        <SwipeToDelete
          goals={completedGoals}
          animatedValues={completedAnims.current}
          handleSwipe={handleSwipe}
          type="completed"
        />
      </View>
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    paddingHorizontal: 16,
    backgroundColor: colors.secondary,
    paddingTop: 16,
    paddingBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center"
  },
  completedHeader: {
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    shadowColor: colors.secondary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 20,
    backgroundColor: colors.secondary
  }
});
