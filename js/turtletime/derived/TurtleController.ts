module TurtleTime {
    import toDirection = TurtleTime.Direction.toDirection;
    export class TurtleController extends Controller {
        initialize(gameState : GameState, gameView : Array<BaseView>) : void {
            this._readState = {
                inputState: gameState.inputState,
                selectionModel: gameState.selectionModel
            };
            this._writeState = {
                selectionModel: gameState.selectionModel,
                turtles: gameState.entities.turtles
            };
        }

        // called from processMovement
        private processPathfinding(turtle : Turtle) : void {
            // Assume that turtle is at intermediateTargetPosition and wants to get to targetPosition
            if (turtle.intermediateTargetPosition.distance(turtle.targetPosition) < 1) {
                turtle.intermediateTargetPosition.set(turtle.targetPosition.x, turtle.targetPosition.y);
                return;
            }
            var direction : Point = new Point(
                turtle.targetPosition.x - turtle.intermediateTargetPosition.x,
                turtle.targetPosition.y - turtle.intermediateTargetPosition.y
            );
            direction = Direction.toVector(Direction.toDirection(direction));
            turtle.intermediateTargetPosition.add(direction.x, direction.y);
        }

        private processMovement(turtle : Turtle) : void {
            if (turtle.position.distance(turtle.intermediateTargetPosition) < TURTLE_SPEED) {
                turtle.position.set(
                    turtle.intermediateTargetPosition.x,
                    turtle.intermediateTargetPosition.y
                );
                this.processPathfinding(turtle);
            } else { // move towards intended position
                var direction : Point = new Point(
                    turtle.intermediateTargetPosition.x - turtle.position.x,
                    turtle.intermediateTargetPosition.y - turtle.position.y);
                direction = direction.normalize().multiply(TURTLE_SPEED, TURTLE_SPEED);
                turtle.position.add(direction.x, direction.y);
                turtle.direction = Direction.toDirection(direction);
            }
        }

        private processInput(turtle : Turtle) : void {
            var inputState = this._readState.inputState;
            if (this._readState.selectionModel.entity == turtle) {
                turtle.currentStatus = "selected";
            } else {
                turtle.currentStatus = "normal";
            }
            if (turtle.view.contains(inputState.inputX, inputState.inputY)) {
                if (inputState.isPressed) {
                    turtle.currentStatus = "highlighted";
                } else {
                    turtle.currentStatus = "over";
                }
                if (inputState.justReleased) {
                    if (this._writeState.selectionModel.entity == turtle) {
                        this._writeState.selectionModel.entity = null;
                    } else {
                        this._writeState.selectionModel.entity = turtle;
                    }
                }
            }
        }

        update(dt : number) : void {
            this._writeState.turtles.forEach(
                (turtle : Turtle) : void => {
                    this.processMovement(turtle);
                    this.processInput(turtle);
                }
            );
        }
    }
}