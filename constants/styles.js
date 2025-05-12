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
    },
    label: {
        fontSize: 14,
        color: colors.secondaryAccent,
        marginBottom: 4
    },
    input: {
        backgroundColor: colors.secondary,
        borderRadius: 12,
        padding: 8,
        paddingLeft: 8,
        marginBottom: 16,
        fontSize: 16
    },
    inputFocused: {
        borderWidth: 1,
        borderColor: colors.secondaryAccent
    },
    submitBtn: {
        backgroundColor: '#007bff',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    submitBtnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    deleteBtn: {
        backgroundColor: colors.danger,
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    deleteBtnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    saveBtn: {
        backgroundColor: colors.warning,
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    saveBtnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    notLastItem: {
        marginBottom: 10
    }
})
