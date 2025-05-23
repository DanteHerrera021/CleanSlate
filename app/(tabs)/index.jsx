import React, { useEffect, useRef, useState } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import PageContainer from "../../components/PageContainer";
import colors from "../../constants/colors";
import { globalStyles } from "../../constants/styles";
import {
  addTestDayStats,
  cleanBrokenGoals,
  getRecords,
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

      const incompleteSort = incomplete.sort(
        (a, b) => b.difficulty - a.difficulty
      );
      const completedSort = completed.sort(
        (a, b) => b.difficulty - a.difficulty
      );

      const incompleteMap = {};
      incompleteSort.forEach((g) => {
        incompleteMap[g.id] = new Animated.Value(1);
      });

      const completedMap = {};
      completedSort.forEach((g) => {
        completedMap[g.id] = new Animated.Value(1);
      });

      incompleteAnims.current = incompleteMap;
      completedAnims.current = completedMap;
      setIncompleteGoals(incompleteSort);
      setCompletedGoals(completedSort);
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

        const updatedSorted = updated.sort(
          (a, b) => b.difficulty - a.difficulty
        );
        setList(updatedSorted);
        animating.current = false;
      });
    }
  };
  return (
    <PageContainer>
      <View style={{ flex: 1 }}>
        <View style={globalStyles.headerRow}>
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

      <View style={{ flex: 1 }}>
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
    elevation: 2,
    backgroundColor: colors.secondary
  }
});
