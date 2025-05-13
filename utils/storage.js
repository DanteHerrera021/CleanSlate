import AsyncStorage from "@react-native-async-storage/async-storage";
import Goal from "../models/goal";
import SavedGoal from "../models/savedGoal";

const STORAGE_KEY = "goals";

const removeDuplicates = (goalArray) => {
    const uniqueById = new Map();
    goalArray.forEach((goal) => {
        if (!uniqueById.has(goal.id)) {
            uniqueById.set(goal.id, goal);
        }
    });

    const seenKey = new Set();
    const finalList = [];
    uniqueById.forEach((goal) => {
        const key = `${goal.name}::${goal.description}`;
        if (!seenKey.has(key)) {
            seenKey.add(key);
            finalList.push(goal);
        }
    });

    return finalList;
};


const saveGoals = async (goalArray) => {
    try {
        const clean = goalArray
            .filter(Goal.isValid)
            .map((goal) =>
                goal.toJSON ? goal.toJSON() : Goal.fromJSON(goal).toJSON()
            );

        const noDuplicates = removeDuplicates(clean)
        await AsyncStorage.setItem('goals', JSON.stringify(noDuplicates));
    } catch (e) {
        console.error('Error saving goals:', e);
    }
};

export const loadGoals = async () => {
    try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (!stored) return [];
        const parsed = JSON.parse(stored);
        const today = new Date().toDateString();

        return parsed
            .filter(Goal.isValid)
            .filter((goal) => new Date(goal.dateAdded).toDateString() !== today)
            .map((g) => Goal.fromJSON(g));


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

export const loadGoalById = async (goalId) => {
    const goals = await loadGoals();
    const goal = goals.filter((goal) => goal.id === goalId);
    return goal[0]
}

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

export const loadIncompleteGoals = async () => {
    try {
        const stored = await AsyncStorage.getItem('goals');
        if (!stored) return [];

        const parsed = JSON.parse(stored);
        const allGoals = parsed.map((g) => Goal.fromJSON(g));

        return allGoals.filter((goal) => goal.progress < 100);
    } catch (e) {
        console.error('Error loading incomplete goals:', e);
        return [];
    }
};

export const loadCompletedGoals = async () => {
    try {
        const stored = await AsyncStorage.getItem('goals');
        if (!stored) return [];

        const parsed = JSON.parse(stored);
        const allGoals = parsed.map((g) => Goal.fromJSON(g));

        return allGoals.filter((goal) => goal.progress == 100);
    } catch (e) {
        console.error('Error loading incomplete goals:', e);
        return [];
    }
};

export const cleanBrokenGoals = async () => {
    const raw = await AsyncStorage.getItem("goals");
    if (!raw) return;

    const parsed = JSON.parse(raw);
    const cleaned = parsed.filter(
        (g) => g?.id && g.name && g.description && g.difficulty != null
    );

    await AsyncStorage.setItem("goals", JSON.stringify(cleaned));
};

const saveSavedGoals = async (goalArray) => {
    try {
        const clean = goalArray
            .filter(SavedGoal.isValid)
            .map((goal) =>
                goal.toJSON ? goal.toJSON() : SavedGoal.fromJSON(goal).toJSON()
            );

        const noDuplicates = removeDuplicates(clean)
        await AsyncStorage.setItem('savedGoals', JSON.stringify(noDuplicates));
    } catch (e) {
        console.error('Error saving goals:', e);
    }
};

export const loadSavedGoals = async () => {
    try {
        const stored = await AsyncStorage.getItem('savedGoals');
        if (!stored) return [];

        const parsed = JSON.parse(stored);
        const savedGoals = parsed.map((sg) => SavedGoal.fromJSON(sg));

        return savedGoals;
    } catch (e) {
        console.error('Error loading saved goals:', e)
        return [];
    }
}

export const syncSavedGoal = async (goal) => {
    const current = await loadSavedGoals();
    const index = current.findIndex((g) => g.id === goal.id);
    if (index >= 0) {
        current[index] = goal;
    } else {
        current.push(goal);
    }
    await saveSavedGoals(current);
};

export const removeSavedGoalById = async (goalId) => {
    const current = await loadSavedGoals();
    const updated = current.filter((goal) => goal.id !== goalId);
    await saveSavedGoals(updated);
};

export const getSavedGoalById = async (goalId) => {
    const current = await loadSavedGoals();
    return current.find((goal) => goal.id === goalId) || null;
};
