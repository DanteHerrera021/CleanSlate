export default function Goal(name, description, difficulty) {
    this.id = Math.floor(Math.random() * 1_000_000).toString();

    this.name = name;
    this.description = description;
    this.difficulty = difficulty;
    this.progress = 0;
    this.changeProgress = function (newProgress) {
        this.progress = newProgress;
    }
}