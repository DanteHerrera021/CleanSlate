import { Pressable, Text, View } from "react-native";
import PageContainer from "../../components/PageContainer";
import { addTestDayStats, getRecords } from "../../utils/storage";
import { useEffect, useState } from "react";
import { globalStyles } from "../../constants/styles";
import colors from "../../constants/colors";
import Goal from "../../models/goal";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function AchievementsScreen() {
  const [mostCompleted, setMostCompleted] = useState(null);
  const [percentCompleted, setPercentCompleted] = useState(null);
  const [mostHard, setMostHard] = useState(null);
  const [mostMedium, setMostMedium] = useState(null);
  const [mostEasy, setMostEasy] = useState(null);

  const test = async () => {
    console.log("Logging Async Storage");
    AsyncStorage.getAllKeys((err, keys) => {
      AsyncStorage.multiGet(keys, (error, stores) => {
        stores.map((result, i, store) => {
          console.log({ [store[i][0]]: store[i][1] });
          return true;
        });
      });
    });
  };

  const getMostCompleted = (arr) => {
    let mostCompleted = 0;
    arr.forEach((day) => {
      let dayCompleted = 0;
      day.goalArray.forEach((goal) => {
        if (goal.progress === 100) {
          dayCompleted++;
        }
      });
      mostCompleted = Math.max(mostCompleted, dayCompleted);
    });

    return mostCompleted;
  };

  const getPercentCompleted = (arr) => {
    let amountCompleted = 0;
    let amount = 0;
    arr.forEach((day) => {
      day.goalArray.forEach((goal) => {
        if (goal.progress === 100) {
          amountCompleted++;
        }
        amount++;
      });
    });

    const percentage = ((amountCompleted / amount) * 100).toFixed(2);
    return `${percentage}%`;
  };

  const getMostDifficulty = (arr, difficulty) => {
    let mostCompleted = 0;
    arr.forEach((day) => {
      let dayCompleted = 0;
      day.goalArray.forEach((goal) => {
        if (goal.difficulty === difficulty && goal.progress === 100) {
          dayCompleted++;
        }
      });
      mostCompleted = Math.max(mostCompleted, dayCompleted);
    });

    return mostCompleted;
  };

  useEffect(() => {
    (async () => {
      await addTestDayStats();
      const results = await getRecords();

      // UPDATE COMPLETED VALUES
      if (results.length > 0) {
        setMostCompleted(getMostCompleted(results));
        setPercentCompleted(getPercentCompleted(results));
        setMostHard(getMostDifficulty(results, 3));
        setMostMedium(getMostDifficulty(results, 2));
        setMostEasy(getMostDifficulty(results, 1));
      } else {
        setMostCompleted("N/A");
        setPercentCompleted("N/A");
        setMostHard("N/A");
        setMostMedium("N/A");
        setMostEasy("N/A");
      }
    })();
  }, []);

  return (
    <PageContainer>
      <View style={globalStyles.headerRow}>
        <Text style={globalStyles.titleText}>Achievements</Text>
      </View>

      <View
        style={{
          padding: 16,
          margin: 16,
          backgroundColor: colors.secondary,
          borderRadius: 10,

          elevation: 3
        }}
      >
        <Text style={[globalStyles.titleText, { marginBottom: 16 }]}>
          Statistics
        </Text>
        <View
          style={{
            marginBottom: 8,
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-between"
          }}
        >
          <Text style={globalStyles.label}>Most Goals Completed:</Text>
          <Text
            style={{
              backgroundColor: colors.warning,
              paddingVertical: 4,
              paddingHorizontal: 16,
              color: "white",
              borderRadius: 4,
              fontWeight: "bold",
              elevation: 2
            }}
          >
            {mostCompleted}
          </Text>
        </View>
        <View
          style={{
            marginBottom: 8,
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-between"
          }}
        >
          <Text style={globalStyles.label}>Percent Completed:</Text>
          <Text
            style={{
              backgroundColor: colors.warning,
              paddingVertical: 4,
              paddingHorizontal: 16,
              color: "white",
              borderRadius: 4,
              fontWeight: "bold",
              elevation: 2
            }}
          >
            {percentCompleted}
          </Text>
        </View>
        <View
          style={{
            marginBottom: 8,
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-between"
          }}
        >
          <Text style={globalStyles.label}>Most Hard Goals Completed:</Text>
          <Text
            style={{
              backgroundColor: colors.hardDark,
              paddingVertical: 4,
              paddingHorizontal: 16,
              color: "white",
              borderRadius: 4,
              fontWeight: "bold",
              elevation: 2
            }}
          >
            {mostHard}
          </Text>
        </View>
        <View
          style={{
            marginBottom: 8,
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-between"
          }}
        >
          <Text style={globalStyles.label}>Most Medium Goals Completed:</Text>
          <Text
            style={{
              backgroundColor: colors.mediumDark,
              paddingVertical: 4,
              paddingHorizontal: 16,
              color: "white",
              borderRadius: 4,
              fontWeight: "bold",
              elevation: 2
            }}
          >
            {mostMedium}
          </Text>
        </View>
        <View
          style={{
            marginBottom: 8,
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-between"
          }}
        >
          <Text style={globalStyles.label}>Most Easy Goals Completed:</Text>
          <Text
            style={{
              backgroundColor: colors.easyDark,
              paddingVertical: 4,
              paddingHorizontal: 16,
              color: "white",
              borderRadius: 4,
              fontWeight: "bold",
              elevation: 2
            }}
          >
            {mostEasy}
          </Text>
        </View>
      </View>
      <Pressable onPress={test} style={globalStyles.deleteBtn}>
        <Text style={globalStyles.deleteBtnText}>Test</Text>
      </Pressable>
    </PageContainer>
  );
}
