import Goal from "./goal";

export default class DayStats {
    constructor(day, goalArray) {
        this._day = new Date(day);
        this._goalArray = goalArray ?? [];
    }

    getAmount() {
        return this._goalArray.length;
    };

    get goalArray() {
        return this._goalArray;
    }


    getComplete() {
        return this._goalArray.filter((goal) => goal.progress >= 100);
    }

    getIncomplete() {
        return this._goalArray.filter((goal) => goal.progress < 100);
    }

    toJSON() {
        return {
            day: this._day.toISOString(),
            goalArray: this._goalArray.map((goal) => goal.toJSON())
        };
    }

    static fromJSON(data) {
        return new DayStats(
            data.day,
            (data.goalArray ?? []).map((goal) => Goal.fromJSON(goal))
        );
    }
}
