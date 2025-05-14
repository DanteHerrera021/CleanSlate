import { useEffect, useRef, useState } from "react";
import { Animated, Text, View } from "react-native";
import { loadSavedGoals, removeSavedGoalById } from "../../utils/storage";
import PageContainer from "../../components/PageContainer";
import colors from "../../constants/colors";
import { globalStyles } from "../../constants/styles";
import { useLocalSearchParams } from "expo-router";
import SwipeToDelete from "../../components/SwipeToDelete";

export default function AllGoals() {
  const { type } = useLocalSearchParams();
  const [goals, setGoals] = useState([]);
  const mapAnims = useRef({});
  const animating = useRef(false);

  useEffect(() => {
    const loadGoals = async () => {
      const data = await loadSavedGoals();
      const sorted = data.sort((a, b) => b.difficulty - a.difficulty);
      const animatedMap = {};
      sorted.forEach((g) => {
        animatedMap[g.id] = new Animated.Value(1);
      });
      mapAnims.current = animatedMap;
      setGoals(sorted);
    };

    loadGoals();
  }, [type]);

  const handleSwipe = async (key) => {
    const animMap = mapAnims.current;

    if (!animating.current && animMap[key]) {
      animating.current = true;

      Animated.timing(animMap[key], {
        toValue: 0,
        duration: 200,
        useNativeDriver: false
      }).start(async () => {
        await removeSavedGoalById(key);

        const updated = await loadSavedGoals();
        const updatedSorted = updated.sort(
          (a, b) => b.difficulty - a.difficulty
        );
        const newAnimMap = {};
        updatedSorted.forEach((g) => {
          newAnimMap[g.id] = new Animated.Value(1);
        });

        mapAnims.current = newAnimMap;
        setGoals(updatedSorted);
        animating.current = false;
      });
    }
  };

  return (
    <PageContainer showHeader={false}>
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
          <Text style={globalStyles.titleText}> Your Saved Goals</Text>
        </View>
      </View>
      <SwipeToDelete
        goals={goals}
        animatedValues={mapAnims.current}
        handleSwipe={handleSwipe}
        editFolderName="EditSavedGoal"
      />
    </PageContainer>
  );
}
