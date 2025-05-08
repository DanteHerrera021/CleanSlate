import { StyleSheet } from "react-native";
import colors from "./colors";


export const globalStyles = StyleSheet.create({
    pageContainer: {
        flex: 1,
        backgroundColor: colors.primary,
    },
    titleText: {
        fontSize: 22,
        fontWeight: "bold"
    },
    subHeaderText: {
        fontSize: 16,
        fontWeight: "bold"
    }
});
