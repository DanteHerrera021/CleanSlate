import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  FlatList,
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
  loadUncompletedGoals,
  removeGoalById
} from "../../utils/storage";
import { Link } from "expo-router";

export default function HomeScreen() {
  const [uncompletedGoals, setUncompletedGoals] = useState([]);
  const [completedGoals, setCompletedGoals] = useState([]);
  const rowTranslateAnimatedValues = useRef({});
  const animationIsRunning = useRef(false);
  const insets = useSafeAreaInsets();
  const windowWidth = Dimensions.get("window").width;

  useEffect(() => {
    cleanBrokenGoals();
    const fetchGoals = async () => {
      const data = await loadUncompletedGoals();
      const animatedMap = {};
      data.forEach((g) => {
        animatedMap[g.id] = new Animated.Value(1);
      });
      rowTranslateAnimatedValues.current = animatedMap;
      setUncompletedGoals(data);

      const loadedCompletedGoals = await loadCompletedGoals();
      setCompletedGoals(loadedCompletedGoals);
    };

    fetchGoals();
  }, []);

  const onSwipeValueChange = ({ key, value }) => {
    if (
      value < -windowWidth &&
      !animationIsRunning.current &&
      rowTranslateAnimatedValues.current[key]
    ) {
      animationIsRunning.current = true;

      Animated.timing(rowTranslateAnimatedValues.current[key], {
        toValue: 0,
        duration: 200,
        useNativeDriver: false
      }).start(async () => {
        await removeGoalById(key);
        const updated = await loadUncompletedGoals();
        setUncompletedGoals(updated);
        animationIsRunning.current = false;
      });
    }
  };

  const renderItem = ({ item }) => {
    const animatedStyle = {
      height: rowTranslateAnimatedValues.current[item.id]?.interpolate({
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
      <View style={styles.headerRow}>
        <Link style={styles.headerLeft} href={"/allGoals/incomplete"}>
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
        data={uncompletedGoals}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        renderHiddenItem={renderHiddenItem}
        rightOpenValue={-windowWidth}
        disableRightSwipe
        onSwipeValueChange={onSwipeValueChange}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 16,
          paddingBottom: insets.bottom + 16
        }}
        useNativeDriver={false}
      />

      <View style={styles.completedHeader}>
        <Pressable style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={globalStyles.titleText}>Completed Goals </Text>
          <Ionicons
            name="arrow-forward"
            size={20}
            style={{ fontWeight: "bold" }}
            color={colors.primaryText}
          />
        </Pressable>
      </View>

      <FlatList
        contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 16 }}
        style={{ flexGrow: 1, height: "50%" }}
        data={completedGoals}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item, index }) => (
          <View
            style={
              index !== completedGoals.length - 1 && globalStyles.notLastItem
            }
          >
            <GoalTab goal={item} />
          </View>
        )}
      />
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
