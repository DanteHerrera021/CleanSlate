import React, { useEffect, useRef, useState } from "react";
import { Animated, Dimensions, StyleSheet, Text, View } from "react-native";
import { SwipeListView } from "react-native-swipe-list-view";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  loadCompletedGoals,
  loadIncompleteGoals,
  removeGoalById
} from "../../utils/storage";
import PageContainer from "../../components/PageContainer";
import GoalTab from "../../components/GoalTab";
import colors from "../../constants/colors";
import { globalStyles } from "../../constants/styles";
import { Link, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const windowWidth = Dimensions.get("window").width;

export default function AllGoals() {
  const { type } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const [goals, setGoals] = useState([]);
  const rowTranslateAnimatedValues = useRef({});
  const animationIsRunning = useRef(false);

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
      rowTranslateAnimatedValues.current = animatedMap;
      setGoals(data);
    };

    loadGoals();
  }, [type]);

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
        const updated =
          type.toLowerCase() === "complete"
            ? await loadCompletedGoals()
            : await loadIncompleteGoals();

        setGoals(updated);
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
      <Ionicons
        name="trash-bin-outline"
        size={32}
        style={{
          color: "white"
        }}
      />
    </View>
  );

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
      <SwipeListView
        data={goals}
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
    </PageContainer>
  );
}

const styles = StyleSheet.create({
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
