import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import PageContainer from "../../components/PageContainer";
import colors from "../../constants/colors";
import { globalStyles } from "../../constants/styles";
import GoalTab from "./../../components/GoalTab";
import Goal from "../../models/goal";

export default function HomeScreen() {
  const goals = [
    new Goal("Goal 1", "desc", 1),
    new Goal("Goal 2", "desc", 3),
    new Goal("Goal 3", "desc", 2),
    new Goal("Goal 4", "desc", 1),
    new Goal("Goal 5", "desc", 1),
    new Goal("Goal 6", "desc", 2),
    new Goal("Goal 7", "desc", 3)
  ];
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
          alignItems: "center",
          marginBottom: "10"
        }}
      >
        {/* Tab slide up to show all goals? */}
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
        <Pressable style={{ padding: 2 }}>
          <Ionicons name="add" size={30} color={colors.primaryText}></Ionicons>
        </Pressable>
      </View>

      {/* Goal List */}

      <FlatList
        style={{
          paddingHorizontal: 16,
          flexGrow: 0,
          height: "50%"
        }}
        data={goals}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <View style={index !== goals.length - 1 && stylesheet.notLastItem}>
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
          height: "50%"
        }}
        data={goals}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <View style={index !== goals.length - 1 && stylesheet.notLastItem}>
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
