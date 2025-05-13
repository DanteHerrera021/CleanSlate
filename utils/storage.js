import AsyncStorage from "@react-native-async-storage/async-storage";
import Goal from "../models/goal";
import SavedGoal from "../models/savedGoal";
import DayStats from "../models/dayStats";

const STORAGE_KEY = "goals";

export const addTestDayStats = async () => {
    await AsyncStorage.removeItem('dayStats');

    const fakeGoal = new Goal("Test goal", "Manually added", 3,);
    const fakeGoal2 = new Goal("Test goal2", "Manually added", 2);
    const fakeGoal3 = new Goal("Test goal3", "Manually added", 1);
    const fakeGoal4 = new Goal("Test goal4", "Manually added", 2);
    fakeGoal.changeProgress(100);
    fakeGoal2.changeProgress(100);
    fakeGoal3.changeProgress(0);
    fakeGoal4.changeProgress(20);

    const today = new Date();

    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const twoDaysAgo = new Date(today);
    twoDaysAgo.setDate(today.getDate() - 2);

    const fakeStats = new DayStats(yesterday, [fakeGoal, fakeGoal2, fakeGoal3, fakeGoal4]);
    const fakeStats2 = new DayStats(twoDaysAgo, [fakeGoal, fakeGoal2, fakeGoal3]);

    const existing = await getRecords();
    existing.push(fakeStats, fakeStats2);

    await AsyncStorage.setItem('dayStats', JSON.stringify(existing)); // Don't call .toJSON() here
};

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

export const deletePrevGoals = async () => {
    const today = new Date().toDateString();
    const goalArray = await loadGoals();
    if (goalArray.length) {
        const prevGoals = goalArray.filter((goal) => new Date(goal.dateAdded).toDateString() !== today);
        await addToRecord(prevGoals);

        const remainingGoals = goalArray.filter((goal) => new Date(goal.dateAdded).toDateString() === today);
        await saveGoals(remainingGoals);
    }
};

const addToRecord = async (goalArray) => {
    try {
        const groupedByDay = {};

        goalArray.forEach(goal => {
            const dayStr = new Date(goal.dateAdded).toDateString();
            if (!groupedByDay[dayStr]) groupedByDay[dayStr] = [];
            groupedByDay[dayStr].push(goal); // just collect goals by day
        });

        const existingRecords = await getRecords();

        Object.entries(groupedByDay).forEach(([day, goals]) => {
            existingRecords.push(new DayStats(day, goals));
        });

        const jsonData = JSON.stringify(existingRecords.map((r) => r.toJSON()));
        await AsyncStorage.setItem('dayStats', jsonData);
    } catch (e) {
        console.error("Error saving goals to statistics:", e);
    }
};


export const getRecords = async () => {
    try {
        const stored = await AsyncStorage.getItem('dayStats');
        if (!stored) return [];
        const parsed = JSON.parse(stored);
        return parsed.map((entry) => DayStats.fromJSON(entry));
    } catch (e) {
        console.error('Error loading records:', e);
        return [];
    }
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
        return parsed
            .filter(Goal.isValid)
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
        const stored = await loadGoals();
        if (!stored) return [];
        return stored.filter((goal) => goal.progress < 100);
    } catch (e) {
        console.error('Error loading incomplete goals:', e);
        return [];
    }
};

export const loadCompletedGoals = async () => {
    try {
        const stored = await loadGoals();
        if (!stored) return [];
        return stored.filter((goal) => goal.progress == 100);
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
