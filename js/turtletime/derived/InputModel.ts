module TurtleTime {
    export class InputModel {
        static DRAG_THRESHOLD_PIXELS : number = 30;

        private _prevPressed : boolean;
        private _currPressed : boolean;
        private _atClickX : number;
        private _atClickY : number;
        private _inputX : number;
        private _inputY : number;
        private _isDragged : boolean;

        constructor() {
            this._prevPressed = this._currPressed = false;
            this._inputX = 0;
            this._inputY = 0;
        }

        setMouseState(x : number, y : number, isDown : boolean) : void {
            this._prevPressed = this._currPressed;
            this._currPressed = isDown;
            this._inputX = x;
            this._inputY = y;
            if (this._currPressed) {
                this._isDragged = this._isDragged ||
                    MathExtensions.dist2(this.atClickX, this.atClickY, this.inputX, this.inputY) >=
                    InputModel.DRAG_THRESHOLD_PIXELS * InputModel.DRAG_THRESHOLD_PIXELS;
            } else {
                this._isDragged = false;
            }
            if (this.justPressed) {
                this._atClickX = this._inputX;
                this._atClickY = this._inputY;
            }
        }

        get isPressed() : boolean { return this._currPressed; }

        get isReleased() : boolean { return !this._currPressed; }

        get justPressed() : boolean { return this._currPressed && !this._prevPressed; }

        get justReleased() : boolean { return !this._currPressed && this._prevPressed; }

        get inputX() : number { return this._inputX; }

        get inputY() : number { return this._inputY; }

        get atClickX() : number { return this._atClickX; }

        get atClickY() : number { return this._atClickY; }
        
        get isDragged() : boolean { return this._isDragged; }
    }
}