export default class SavedGoal {
    constructor(name, description, difficulty, id = null) {
        this.id = id ?? Math.floor(Math.random() * 1_000_000).toString();
        this.name = name;
        this.description = description;
        this.difficulty = difficulty;
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            description: this.description,
            difficulty: this.difficulty,
        };
    }

    static fromJSON(data) {
        return new SavedGoal(data.name, data.description, data.difficulty, data.id);
    }

    static isValid(goal) {
        return (
            goal &&
            typeof goal.id === "string" &&
            typeof goal.name === "string" &&
            typeof goal.description === "string" &&
            typeof goal.difficulty === "number"
        );
    }
}
