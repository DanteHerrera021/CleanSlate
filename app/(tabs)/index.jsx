import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  View
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SwipeListView } from "react-native-swipe-list-view";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import PageContainer from "../../components/PageContainer";
import GoalTab from "../../components/GoalTab";
import colors from "../../constants/colors";
import { globalStyles } from "../../constants/styles";
import {
  cleanBrokenGoals,
  loadCompletedGoals,
  loadGoalById,
  loadIncompleteGoals,
  removeGoalById
} from "../../utils/storage";
import { Link } from "expo-router";

export default function HomeScreen() {
  const [incompleteGoals, setIncompleteGoals] = useState([]);
  const [completedGoals, setCompletedGoals] = useState([]);
  const incompleteAnims = useRef({});
  const completedAnims = useRef({});
  const animating = useRef(false);
  const insets = useSafeAreaInsets();
  const windowWidth = Dimensions.get("window").width;

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

  const onSwipeIncomplete = ({ key, value }) => {
    if (value < -windowWidth) handleSwipe(key, "incomplete");
  };

  const onSwipeCompleted = ({ key, value }) => {
    if (value < -windowWidth) handleSwipe(key, "completed");
  };

  const renderItem = (item, map) => {
    const animatedStyle = {
      height: map[item.id]?.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 96]
      }),
      overflow: "hidden"
    };

    return (
      <Animated.View style={animatedStyle}>
        <GoalTab goal={item} />
      </Animated.View>
    );
  };

  const renderHiddenItem = () => (
    <View style={styles.rowBack}>
      <Ionicons name="trash-bin-outline" size={32} style={{ color: "white" }} />
    </View>
  );

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

        <SwipeListView
          data={incompleteGoals}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => renderItem(item, incompleteAnims.current)}
          renderHiddenItem={renderHiddenItem}
          rightOpenValue={-windowWidth}
          onSwipeValueChange={onSwipeIncomplete}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingTop: 16,
            paddingBottom: insets.bottom + 16
          }}
          useNativeDriver={false}
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

        <SwipeListView
          data={completedGoals}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => renderItem(item, completedAnims.current)}
          renderHiddenItem={renderHiddenItem}
          rightOpenValue={-windowWidth}
          disableRightSwipe
          onSwipeValueChange={onSwipeCompleted}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingTop: 16,
            paddingBottom: insets.bottom + 16
          }}
          useNativeDriver={false}
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
  },
  rowBack: {
    alignItems: "flex-end",
    backgroundColor: colors.danger,
    flex: 1,
    justifyContent: "center",
    paddingRight: 24,
    marginBottom: 14,
    borderRadius: 10
  }
});
