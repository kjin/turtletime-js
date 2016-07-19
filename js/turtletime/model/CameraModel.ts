module TurtleTime {
    export class CameraModel extends VisibleModel {
        private _targetPositionStack : Array<Point> = [];
        internalPosition : Point = new Point();
        smoothingRate : number = 0.5;

        constructor() {
            super();
            this._targetPositionStack.push(new Point());
        }

        pushTarget(point : Point) : void {
            this._targetPositionStack.push(point);
        }

        popTarget() : void {
            if (this._targetPositionStack.length > 1) {
                this._targetPositionStack.pop();
            } else {
                GAME_ENGINE.debugPrintln("No target positions on stack.");
            }
        }

        peekTarget() : Point {
            return this._targetPositionStack[this._targetPositionStack.length - 1];
        }

        get actualPosition() : Point {
            return GAME_ENGINE.cameraPosition;
        }
    }
}