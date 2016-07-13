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
                roomModel: gameState.roomModel
            };
            this._writeState = {
                selectionModel: gameState.selectionModel,
                infoboxModel: gameState.uiModel.getChild("infobox.text"),
                turtles: gameState.entities.turtles
            };
        }

        // called from processMovement
        private processPathfinding(turtle : Turtle) : void {
            if (this._writeState.selectionModel.isBeingDragged) {
                return;
            }
            // Assume that turtle is at intermediateTargetPosition and wants to get to targetPosition
            if (turtle.intermediateTargetPosition.distance(turtle.targetPosition) < 1) {
                var onObjects : Array<EntityModel> =
                    this._readState.roomModel.roomLayout[turtle.targetPosition.x][turtle.targetPosition.y];
                for (var i : number = 0; i < onObjects.length; i++) {
                    if (onObjects[i] != turtle) {
                        turtle.direction = onObjects[i].direction;
                        break;
                    }
                }
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
                    this._writeState.selectionModel.selectedOnClick = this._readState.inputState.clickNumber;
                    this._writeState.infoboxModel.text = (() : string => {
                        var turtleData : TurtleData = GAME_ENGINE.globalData.turtleData.get(turtle.appearanceID);
                        return "Name: " + turtleData.name + "\n" +
                            "Description: " + turtleData.description + "\n" +
                            "Likes: " + turtleData.likes + "\n" +
                            "Dislikes: " + turtleData.dislikes;
                    })();
                }
            }
            // conditions for deselection
            if (inputState.justPressed &&
                this._writeState.selectionModel.entity == turtle &&
                this._writeState.selectionModel.selectedOnClick != this._readState.inputState.clickNumber) {
                this._writeState.selectionModel.entity = null;
                this._writeState.infoboxModel.text = "";
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