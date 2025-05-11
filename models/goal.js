export default class Goal {
  constructor(name, description, difficulty, id = null, progress = 0) {
    this.id = id ?? Math.floor(Math.random() * 1_000_000).toString();
    this.name = name;
    this.description = description;
    this.difficulty = difficulty;
    this.progress = progress ?? 0;
    this.isSaved = false;
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
      isSaved: this.isSaved,
    };
  }

  static fromJSON(data) {
    const goal = new Goal(data.name, data.description, data.difficulty, data.id);
    goal.progress = data.progress ?? 0;
    goal.isSaved = data.isSaved ?? false;
    return goal;
  }
}
