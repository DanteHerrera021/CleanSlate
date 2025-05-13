export default class Goal {
  constructor(name, description, difficulty, id = null, dateAdded = null) {
    this.id = id ?? Math.floor(Math.random() * 1_000_000).toString();
    this.name = name;
    this.description = description;
    this.difficulty = difficulty;
    this.progress = 0;
    this.dateAdded = dateAdded ?? new Date();
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
      progress: this.progress,
      dateAdded: this.dateAdded?.toISOString()
    };
  }

  static fromJSON(data) {
    const goal = new Goal(
      data.name,
      data.description,
      data.difficulty,
      data.id,
      new Date(data.dateAdded)
    );
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
