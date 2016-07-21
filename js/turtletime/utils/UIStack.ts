module TurtleTime {
    export class UIStack {
        onPush : (stack : UIStack) => void = null;
        onPop : (stack : UIStack) => void = null;
        onClear : (stack : UIStack) => void = null;

        private _underlyingArray : Array<UIModel> = [];

        push(ui : UIModel) : void {
            if (this._underlyingArray.length > 0) {
                this._underlyingArray[this._underlyingArray.length - 1].visible = false;
            }
            this._underlyingArray.push(ui);
            this._underlyingArray[this._underlyingArray.length - 1].visible = true;
            if (this.onPush != null) {
                this.onPush(this);
            }
        }

        pop() : void {
            this._underlyingArray[this._underlyingArray.length - 1].visible = false;
            this._underlyingArray.pop();
            if (this._underlyingArray.length > 0) {
                this._underlyingArray[this._underlyingArray.length - 1].visible = true;
            }
            if (this.onPop != null) {
                this.onPop(this);
            }
        }

        length() : number {
            return this._underlyingArray.length;
        }

        clear() : void {
            for (var i : number = 0; i < this._underlyingArray.length; i++) {
                this._underlyingArray[i].visible = false;
            }
            this._underlyingArray.length = 0;
            if (this.onClear != null) {
                this.onClear(this);
            }
        }
    }
}