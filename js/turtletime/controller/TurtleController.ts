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
                chairs: gameState.entities.chairs,
                doors: gameState.entities.doors,
                gameUI : gameState.uiModel.getChild("game")
            };
            this._writeState = {
                selectionModel: gameState.selectionModel,
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
            var selectionModel : SelectionModel = this._writeState.selectionModel;
            if (selectionModel.isBeingDragged) {
                return;
            }
            if (this._readState.selectionModel.entity == turtle) {
                turtle.selectionStatus = "selected";
            } else {
                turtle.selectionStatus = "normal";
            }
            if (turtle.view.contains(inputState.inputX, inputState.inputY)) {
                turtle.selectionStatus = "over";
                // conditions for selection
                if (inputState.justPressed && selectionModel.entity != turtle) {
                    selectionModel.entity = turtle;
                    selectionModel.selectedOnClick = this._readState.inputState.clickNumber;
                }
            }
            // conditions for deselection
            else if (inputState.justPressed &&
                selectionModel.entity == turtle &&
                selectionModel.selectedOnClick != this._readState.inputState.clickNumber) {
                selectionModel.entity = null;
            }
        }

        private canSetTargetDestination(position : Point) : boolean {
            return !this._writeState.turtles.underlyingArray.find((otherTurtle : Turtle) : boolean =>
                (otherTurtle.position.x == position.x && otherTurtle.position.y == position.y) ||
                (otherTurtle.targetPosition.x == position.x && otherTurtle.targetPosition.y == position.y));
        }

        update(dt : number) : void {
            if (this._readState.gameUI.visible) {
                this._writeState.turtles.forEach(
                    (turtle:Turtle):void => {
                        if (turtle.timeUntilDecision == 0) {
                            switch (turtle.status) {
                                case "justEntered":
                                case "lookingAround":
                                    var candidates:Array<Point> = [];
                                    // find a seat
                                    this._writeState.eatingAreas.forEach((eatingArea:EatingArea):void => {
                                        if (this.canSetTargetDestination(eatingArea.chair.atPosition)) {
                                            candidates.push(eatingArea.chair.atPosition);
                                        }
                                    });
                                    if (candidates.length == 0) {
                                        // find any position that's a chair
                                        this._readState.chairs.forEach((chair:Chair):void => {
                                            chair.getAllSpaces().forEach((point:Point) => {
                                                if (this.canSetTargetDestination(point)) {
                                                    candidates.push(point);
                                                }
                                            });
                                        });
                                    }
                                    if (candidates.length > 0) {
                                        var cNum = Math.floor(Math.random() * candidates.length);
                                        turtle.targetPosition = new Point(candidates[cNum].x, candidates[cNum].y);
                                        turtle.status = "navigatingToSeat";
                                    } else {
                                        if (turtle.status == "justEntered") {
                                            var direction : Point = Direction.toVector(turtle.direction);
                                            turtle.targetPosition.set(turtle.position.x + direction.x, turtle.position.y + direction.y);
                                            turtle.status = "lookingAround";
                                            turtle.timeUntilDecision = 60;
                                        } else {
                                            var door : Door = getRandomElement<Door>(this._readState.doors.underlyingArray);
                                            turtle.targetPosition = new Point(door.position.x, door.position.y);
                                            turtle.mood.setMoodLevel("angry", 50);
                                            turtle.status = "exiting";
                                        }
                                    }
                                    break;
                                case "navigatingToSeat":
                                    if (turtle.atTargetPosition()) {
                                        turtle.status = "sitting";
                                    }
                                    break;
                                case "sitting":
                                    if (Math.random() <= 0.01) {
                                        turtle.mood.incrementMoodLevel("fork", 1);
                                    }
                                    if (turtle.mood.getHighestMood() == "heart") {
                                        // time to go
                                        var door : Door = getRandomElement<Door>(this._readState.doors.underlyingArray);
                                        turtle.targetPosition = new Point(door.position.x, door.position.y);
                                        turtle.status = "exiting";
                                    }
                                    break;
                                case "exiting":
                                    if (turtle.atTargetPosition()) {
                                        this._writeState.turtles.remove(turtle);
                                    }
                                    break;
                                default:
                            }
                        } else {
                            turtle.timeUntilDecision--;
                        }
                        this.processMovement(turtle);
                        this.processInput(turtle);
                        if (turtle.atTargetPosition()) {
                            turtle.currentAction = "stand";
                        } else {
                            turtle.currentAction = "walk";
                        }
                    }
                );
            }
        }
    }
}