import React from "react";
import { Animated, Dimensions, StyleSheet, Text, View } from "react-native";
import { SwipeListView } from "react-native-swipe-list-view";
import { Ionicons } from "@expo/vector-icons";
import GoalTab from "./GoalTab";
import colors from "../constants/colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const windowWidth = Dimensions.get("window").width;

export default function SwipeToDelete({
  goals,
  animatedValues,
  handleSwipe,
  type = "",
  editFolderName = "",
  showProgress = true
}) {
  const insets = useSafeAreaInsets();

  const renderItem = ({ item }) => {
    const animatedStyle = {
      height: animatedValues[item.id]?.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 96]
      }),
      overflow: "hidden"
    };

    return (
      <Animated.View style={animatedStyle}>
        <GoalTab
          goal={item}
          showProgress={showProgress}
          editFolderName={editFolderName}
        />
      </Animated.View>
    );
  };

  const renderHiddenItem = () => (
    <View style={styles.rowBack}>
      <Ionicons name="trash-bin-outline" size={32} style={{ color: "white" }} />
    </View>
  );

  const onSwipeComplete = ({ key, value }) => {
    if (value < -windowWidth) {
      handleSwipe(key, type);
    }
  };

  return goals.length ? (
    <SwipeListView
      data={goals}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderItem}
      renderHiddenItem={renderHiddenItem}
      rightOpenValue={-windowWidth}
      disableRightSwipe
      onSwipeValueChange={onSwipeComplete}
      contentContainerStyle={{
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: insets.bottom + 16
      }}
      useNativeDriver={false}
    />
  ) : (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 16
      }}
    >
      <Text style={{ color: "gray", fontSize: 16 }}>No goals to display</Text>
    </View>
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
