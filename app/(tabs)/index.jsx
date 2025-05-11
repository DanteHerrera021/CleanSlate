import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import PageContainer from "../../components/PageContainer";
import colors from "../../constants/colors";
import { globalStyles } from "../../constants/styles";
import GoalTab from "./../../components/GoalTab";
import Goal from "../../models/goal";
import {
  loadCompletedGoals,
  loadGoals,
  loadUncompletedGoals,
  saveGoals
} from "../../utils/storage";
import { useEffect, useState } from "react";
import { Link } from "expo-router";

export default function HomeScreen() {
  const [uncompletedGoals, setUncompletedGoals] = useState([]);
  const [completedGoals, setCompletedGoals] = useState([]);

  useEffect(() => {
    const fetchGoals = async () => {
      const loadedUncompletedGoals = await loadUncompletedGoals();
      const loadedCompletedGoals = await loadCompletedGoals();
      setUncompletedGoals(loadedUncompletedGoals);
      setCompletedGoals(loadedCompletedGoals);
    };

    fetchGoals();
  }, []);

  return (
    <PageContainer>
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
        <Pressable
          style={{
            flexDirection: "row",
            alignItems: "center"
          }}
        >
          <Text style={globalStyles.titleText}>Your Goals Today </Text>
          <Ionicons
            name="arrow-forward"
            size={20}
            style={{ fontWeight: "bold" }}
            color={colors.primaryText}
          ></Ionicons>
        </Pressable>
        <Link style={{ padding: 2 }} href={"/addGoal"}>
          <Ionicons name="add" size={30} color={colors.primaryText}></Ionicons>
        </Link>
      </View>

      {/* Goal List */}

      <FlatList
        style={{
          paddingHorizontal: 16,
          flexGrow: 0,
          height: "50%",
          paddingVertical: 16
        }}
        data={uncompletedGoals}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <View
            style={
              index !== uncompletedGoals.length - 1 && stylesheet.notLastItem
            }
          >
            <GoalTab goal={item}></GoalTab>
          </View>
        )}
      />
      {/* Goal Completed List */}
      <View
        style={{
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
        }}
      >
        <Pressable
          style={{
            flexDirection: "row",
            alignItems: "center"
          }}
        >
          <Text style={globalStyles.titleText}>Completed Goals </Text>
          <Ionicons
            name="arrow-forward"
            size={20}
            style={{ fontWeight: "bold" }}
            color={colors.primaryText}
          ></Ionicons>
        </Pressable>
      </View>

      <FlatList
        style={{
          paddingHorizontal: 16,
          flexGrow: 0,
          height: "50%",
          paddingVertical: 16
        }}
        data={completedGoals}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <View
            style={
              index !== completedGoals.length - 1 && stylesheet.notLastItem
            }
          >
            <GoalTab goal={item}></GoalTab>
          </View>
        )}
      />
    </PageContainer>
  );
}

const stylesheet = StyleSheet.create({
  notLastItem: {
    marginBottom: 10
  }
});
