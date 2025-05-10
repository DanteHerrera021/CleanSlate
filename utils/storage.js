import AsyncStorage from "@react-native-async-storage/async-storage";
import Goal from "../models/goal";

const STORAGE_KEY = "goals";

export const saveGoals = async (goalArray) => {
    try {
        const json = JSON.stringify(goalArray.map((goal) => goal.toJSON()));
        await AsyncStorage.setItem(STORAGE_KEY, json);
    } catch (e) {
        console.error('Error saving goals:', e);
    }
};

export const loadGoals = async () => {
    try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (!stored) return [];
        const parsed = JSON.parse(stored);
        return parsed.map((g) => Goal.fromJSON(g));
    } catch (e) {
        console.error('Error loading goals:', e);
        return [];
    }
};

export const clearGoals = async () => {
    try {
        await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (e) {
        console.error('Error clearing goals:', e);
    }
};

export const addGoal = async (newGoal) => {
    const current = await loadGoals();
    current.push(newGoal);
    await saveGoals(current);
};

export const removeGoalById = async (goalId) => {
    const current = await loadGoals();
    const updated = current.filter((goal) => goal.id !== goalId);
    await saveGoals(updated);
};

export const syncGoal = async (goal) => {
    const current = await loadGoals();
    const index = current.findIndex((g) => g.id === goal.id);
    if (index >= 0) {
        current[index] = goal;
    } else {
        current.push(goal);
    }
    await saveGoals(current);
};

export const getGoalById = async (goalId) => {
    const current = await loadGoals();
    return current.find((goal) => goal.id === goalId) || null;
};
