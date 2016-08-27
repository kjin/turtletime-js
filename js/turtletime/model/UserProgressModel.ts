namespace TurtleTime {
    export class UserProgressModel {
        data : UserProgressData;
        _cachedNumRatingElements : number;
        _averageRating : number;

        get averageRating() : number {
            this.refresh();
            return this._averageRating;
        }

        constructor(data : UserProgressData) {
            this.data = data;
            this.refresh();
        }

        refresh() : void {
            if (this.data.ratingLog.length != this._cachedNumRatingElements) {
                this._averageRating = 0;
                this._cachedNumRatingElements = this.data.ratingLog.length;
                for (var i = 0; i < this._cachedNumRatingElements; i++) {
                    this._averageRating += this.data.ratingLog[i].numStars;
                }
                this._averageRating /= this._cachedNumRatingElements;
            }
        }
    }
}