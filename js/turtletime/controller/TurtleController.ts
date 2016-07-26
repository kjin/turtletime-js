//<reference path="../core/Controller.ts"/>
//<reference path="../model/GameState.ts"/>
//<reference path="../model/Turtle.ts"/>
//<reference path="../model/RoomModel.ts"/>
//<reference path="../model/InputModel.ts"/>
//<reference path="../data/DataDefinitions.ts"/>

module TurtleTime {
    export class TurtleController extends Controller<GameState> {
        initialize(gameState : GameState) : void {
            this._readState = {
                inputState: gameState.inputState,
                selectionModel: gameState.selectionModel,
                roomModel: gameState.roomModel,
                gameUI : gameState.uiModel.getChild("game")
            };
            this._writeState = {
                selectionModel: gameState.selectionModel,
                cameraModel: gameState.cameraModel,
                uiInteractionModel : gameState.uiInteractionModel,
                turtles: gameState.entities.turtles,
                food : gameState.entities.food,
                eatingAreas : gameState.eatingAreas
            };
        }

        // called from processMovement
        private processPathfinding(turtle : Turtle) : void {
            if (this._writeState.selectionModel.isBeingDragged) {
                return;
            }
            // Assume that turtle is at intermediateTargetPosition and wants to get to targetPosition
            var distanceFromTarget : number = turtle.intermediateTargetPosition.distance(turtle.targetPosition);
            if (distanceFromTarget < 1) {
                this._readState.roomModel.roomLayout[turtle.targetPosition.x][turtle.targetPosition.y].staticModels.forEach(
                    (model : EntityModel) => turtle.direction = model.direction
                );
                turtle.intermediateTargetPosition.set(turtle.targetPosition.x, turtle.targetPosition.y);
                return;
            }
            if (turtle.sleep == 0) {
                // goal: set turtle.intermediateTargetPosition according to the best path
                var nextDirection:Point = aStarTraversal(
                    turtle.intermediateTargetPosition,
                    turtle.targetPosition,
                    this._readState.roomModel.width,
                    MathExtensions.dist2,
                    this._readState.roomModel.isUnoccupiedSpaceXY.bind(this._readState.roomModel),
                    turtle.direction
                );
                if (nextDirection.x == 0 && nextDirection.y == 0) {
                    turtle.sleep = 100;
                }
                turtle.intermediateTargetPosition.add(nextDirection.x, nextDirection.y);
            } else {
                turtle.sleep--;
            }
        }

        private processMovement(turtle : Turtle) : void {
            // move the camera to the turtle's location if it's selected
            if (this._writeState.selectionModel.entity == turtle) {
                this._writeState.cameraModel.peekTarget().x = turtle.position.x;
                this._writeState.cameraModel.peekTarget().y = turtle.position.y - 2;
            }
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
            var inputState : InputModel = this._readState.inputState;
            if (!this._writeState.uiInteractionModel.mouseOver(this._readState.gameUI)) {
                return;
            }
            if (this._writeState.selectionModel.isBeingDragged) {
                return;
            } else if (this._writeState.selectionModel.entity == turtle) {
                if (this._writeState.selectionModel.currentDragPosition != null) {
                    this._writeState.selectionModel.currentDragPosition = null;
                    turtle.targetPosition.x = this._writeState.selectionModel.currentDragPositionInRoom.x;
                    turtle.targetPosition.y = this._writeState.selectionModel.currentDragPositionInRoom.y;
                    this._readState.roomModel.clamp(turtle.targetPosition);
                }
            }
            if (this._readState.selectionModel.entity == turtle) {
                turtle.currentStatus = "selected";
            } else {
                turtle.currentStatus = "normal";
            }
            if (turtle.view.contains(inputState.inputX, inputState.inputY)) {
                turtle.currentStatus = "over";
                // conditions for selection
                if (inputState.justPressed && this._writeState.selectionModel.entity != turtle) {
                    this._writeState.selectionModel.entity = turtle;
                    this._writeState.cameraModel.pushTarget(new Point(turtle.position.x, turtle.position.y - 2));
                    this._writeState.selectionModel.selectedOnClick = this._readState.inputState.clickNumber;
                }
            }
            // conditions for deselection
            else if (inputState.justPressed &&
                this._writeState.selectionModel.entity == turtle &&
                this._writeState.selectionModel.selectedOnClick != this._readState.inputState.clickNumber) {
                this._writeState.cameraModel.popTarget();
                this._writeState.selectionModel.entity = null;
            }
        }

        update(dt : number) : void {
            if (this._readState.gameUI.visible) {
                this._writeState.turtles.forEach(
                    (turtle:Turtle):void => {
                        this.processMovement(turtle);
                        this.processInput(turtle);
                        if (Math.random() <= 0.01) {
                            turtle.mood.incrementMoodLevel("fork", 1);
                        }
                    }
                );
            }
        }
    }
}