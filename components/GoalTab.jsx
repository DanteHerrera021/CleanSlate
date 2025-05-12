import { View, Text } from "react-native";
import { globalStyles } from "../constants/styles";
import colors from "../constants/colors";
import CircularProgress from "react-native-circular-progress-indicator";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";

export default function GoalTab({ goal, editFolderName = "editGoal" }) {
  let goalScale = ["easy", "medium", "hard"];
  let goalColor = goalScale[goal.difficulty - 1];

  const showProgress = editFolderName !== "EditSavedGoal";

  return (
    <Link href={`/${editFolderName}/${goal.id}`}>
      <View
        style={{
          borderColor: colors.secondaryAccent,
          borderWidth: 1,
          borderRadius: 10,
          backgroundColor: colors.primary,
          padding: 10,
          flexDirection: "row",
          alignContent: "center",
          justifyContent: "space-between"
        }}
      >
        <View
          style={{
            backgroundColor: colors[goalColor + "Light"],
            marginEnd: "5%",
            marginVertical: "auto",
            width: "15%",
            aspectRatio: 1,
            borderRadius: "50%",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <Text
            style={{
              color: colors[goalColor + "Dark"],
              fontSize: 20,
              fontWeight: "bold"
            }}
          >
            {goalScale[goal.difficulty - 1].substring(0, 1).toUpperCase()}
          </Text>
        </View>
        <View
          style={{
            justifyContent: "center",
            width: showProgress ? "50%" : "75%"
          }}
        >
          <Text style={globalStyles.subHeaderText}>{goal.name}</Text>
          <Text>{goal.description}</Text>
        </View>
        <View
          style={{
            width: "25%",
            marginStart: "5%",
            justifyContent: "center",
            alignItems: "flex-end"
          }}
        >
          <CircularProgress
            value={goal.progress}
            radius={30}
            inActiveStrokeWidth={4}
            activeStrokeWidth={4}
            activeStrokeColor={colors.tertiary}
            duration={500}
            showProgressValue={false}
            title={
              goal.progress === 100 ? (
                <Ionicons name="checkmark" size={35}></Ionicons>
              ) : (
                ""
              )
            }
          ></CircularProgress>
        </View>
      </View>
    </Link>
  );
}
