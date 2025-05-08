import { Text } from "react-native";
import PageContainer from "../../components/PageContainer";
import { useLocalSearchParams } from "expo-router";

export default function EditGoal() {
  const { id } = useLocalSearchParams();

  console.log(id);
  console.log(useLocalSearchParams());

  return (
    <PageContainer showHeader={true} padding={true}>
      <Text>Goal Id: {id}</Text>
    </PageContainer>
  );
}
