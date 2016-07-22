namespace TurtleTime {
    export class Mood {
        private _moodLevels : any;
        private _highestMood : string;
        private _highestMoodNumber : number;

        constructor(moodLevels : any) {
            this._moodLevels = moodLevels;
            this.recalculateHighestMood();
        }

        private recalculateHighestMood() : void {
            this._highestMood = null;
            this._highestMoodNumber = 0;
            for (var field in this._moodLevels) {
                if (this._moodLevels.hasOwnProperty(field)) {
                    if (this._moodLevels[field] >= this._highestMoodNumber) {
                        this._highestMood = field;
                        this._highestMoodNumber = this._moodLevels[field];
                    }
                }
            }
        }

        getHighestMood() : string {
            return this._highestMood;
        }

        setMoodLevel(mood : string, level : number) : void {
            this._moodLevels[mood] = level;
            if (mood == this._highestMood) {
                this.recalculateHighestMood();
            } else {
                if (this._moodLevels[mood] > this._highestMoodNumber) {
                    this._highestMood = mood;
                    this._highestMoodNumber = this._moodLevels[mood];
                }
            }
        }

        incrementMoodLevel(mood : string, amount : number) : void {
            this.setMoodLevel(mood, this.getMoodLevel(mood) + amount);
        }

        getMoodLevel(mood : string) : number {
            if (!this._moodLevels.hasOwnProperty(mood)) {
                this._moodLevels[mood] = 0;
            }
            return this._moodLevels[mood];
        }

        serialize() : any {
            return this._moodLevels;
        }
    }
}