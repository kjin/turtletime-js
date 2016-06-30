module TurtleTime {
    export class InputModel {
        private _prevPressed : boolean;
        private _currPressed : boolean;
        private _inputX : number;
        private _inputY : number;

        constructor() {
            this._prevPressed = this._currPressed = false;
            this._inputX = 0;
            this._inputY = 0;
        }

        setCurrentMouseState(x : number, y : number, isDown : boolean) : void {
            this._prevPressed = this._currPressed;
            this._currPressed = isDown;
            this._inputX = x;
            this._inputY = y;
        }

        get isPressed() : boolean { return this._currPressed; }

        get isReleased() : boolean { return !this._currPressed; }

        get justPressed() : boolean { return this._currPressed && !this._prevPressed; }

        get justReleased() : boolean { return !this._currPressed && this._prevPressed; }

        get inputX() : number { return this._inputX; }

        get inputY() : number { return this._inputY; }
    }
}