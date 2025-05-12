export default class Goal {
  constructor(name, description, difficulty, id = null, progress = 0) {
    this.id = id ?? Math.floor(Math.random() * 1_000_000).toString();
    this.name = name;
    this.description = description;
    this.difficulty = difficulty;
    this.progress = progress ?? 0;
  }

  changeProgress(newProgress) {
    this.progress = newProgress;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      difficulty: this.difficulty,
      progress: this.progress
    };
  }

  static fromJSON(data) {
    const goal = new Goal(data.name, data.description, data.difficulty, data.id);
    goal.progress = data.progress ?? 0;
    return goal;
  }

  static isValid(goal) {
    return (
      goal &&
      typeof goal.id === "string" &&
      typeof goal.name === "string" &&
      typeof goal.description === "string" &&
      typeof goal.difficulty === "number" &&
      typeof goal.progress === "number"
    );
  }
}
