//<reference path="../core/Controller.ts"/>
//<reference path="../model/GameState.ts"/>
//<reference path="../model/Turtle.ts"/>
//<reference path="../model/RoomModel.ts"/>
//<reference path="../model/InputModel.ts"/>
//<reference path="../data/DataDefinitions.ts"/>

module TurtleTime {
    /**
     * Manages updating turtles and spawning new ones.
     */
    export class TurtleController extends QuickController<GameState> {
        // A cached list of turtle data for easy access
        turtles : Array<TurtleData>;

        protected initializeInternal(gameState : GameState) : void {
            this.turtles = [];
            GAME_ENGINE.globalData.turtleData.forEach((turtle : TurtleData) => {
                this.turtles.push(turtle);
            });
        }
        
        // called from processMovement
        private static processPathfinding(gameState : GameState, turtle : Turtle) : void {
            if (gameState.selectionModel.isBeingDragged) {
                return;
            }
            // Assume that turtle is at intermediateTargetPosition and wants to get to targetPosition
            var distanceFromTarget : number = turtle.intermediateTargetPosition.distance(turtle.targetPosition);
            if (distanceFromTarget < 1) {
                gameState.roomModel.roomLayout[turtle.targetPosition.x][turtle.targetPosition.y].staticModels.forEach(
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
                    gameState.roomModel.width,
                    MathExtensions.dist2,
                    gameState.roomModel.isUnoccupiedSpaceXY.bind(gameState.roomModel),
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

        private static processMovement(gameState : GameState, turtle : Turtle, dt : number) : number {
            var distanceLeft = TURTLE_SPEED * dt;
            while (distanceLeft > 0 && !turtle.atTargetPosition()) {
                if (turtle.position.distance(turtle.intermediateTargetPosition) < distanceLeft) {
                    distanceLeft -= turtle.position.distance(turtle.intermediateTargetPosition);
                    turtle.position.set(
                        turtle.intermediateTargetPosition.x,
                        turtle.intermediateTargetPosition.y
                    );
                    TurtleController.processPathfinding(gameState, turtle);
                } else { // move towards intended position
                    var direction : Point = new Point(
                        turtle.intermediateTargetPosition.x - turtle.position.x,
                        turtle.intermediateTargetPosition.y - turtle.position.y);
                    direction = direction.normalize();
                    if (distanceLeft < 1) {
                        direction.multiply(distanceLeft, distanceLeft);
                        distanceLeft = 0;
                    } else {
                        distanceLeft -= 1;
                    }
                    turtle.position.add(direction.x, direction.y);
                    turtle.direction = Direction.toDirection(direction);
                }
            }
            return distanceLeft / TURTLE_SPEED;
        }

        private static processInput(gameState : GameState, turtle : Turtle) : void {
            if (turtle.view == null) {
                return;
            }
            var inputState : InputModel = gameState.inputState;
            var selectionModel : SelectionModel = gameState.selectionModel;
            if (selectionModel.isBeingDragged) {
                return;
            }
            if (gameState.selectionModel.entity == turtle) {
                turtle.selectionStatus = "selected";
            } else {
                turtle.selectionStatus = "normal";
            }
            if (turtle.view.contains(inputState.inputX, inputState.inputY)) {
                turtle.selectionStatus = "over";
                // conditions for selection
                if (inputState.justPressed && selectionModel.entity != turtle) {
                    selectionModel.entity = turtle;
                    gameState.uiInteractionModel.currentTurtle = turtle.appearanceID;
                    selectionModel.selectedOnClick = gameState.inputState.clickNumber;
                }
            }
            // conditions for deselection
            else if (inputState.justPressed &&
                selectionModel.entity == turtle &&
                selectionModel.selectedOnClick != gameState.inputState.clickNumber) {
                selectionModel.entity = null;
            }
        }

        private static processEating(gameState : GameState, turtle : Turtle, dt : number) : number {
            if (turtle.atTargetPosition()) {
                var eatingArea : EatingArea = gameState.roomModel.getRoomNode(turtle.position).eatingArea;
                if (eatingArea != null && Point.equals(turtle.position, eatingArea.chair.atPosition)) {
                    var food : Food = gameState.roomModel.getRoomNode(eatingArea.table.atPosition).food;
                    if (food != null) {
                        if (food.hp < dt) {
                            dt -= food.hp;
                            food.hp = 0;
                            gameState.entities.food.remove(food);
                            food = null;
                            turtle.mood.setMoodLevel("fork", 0);
                            turtle.mood.incrementMoodLevel("heart", 10);
                        } else {
                            food.hp -= dt;
                            dt = 0;
                        }
                    } else {
                        dt = 0;
                    }
                } else {
                    dt = 0;
                }
            }
            return dt;
        }

        private static processBrain(gameState : GameState, turtle : Turtle) : void {
            if (turtle.timeUntilDecision == 0) {
                switch (turtle.status) {
                    case "justEntered":
                    case "lookingAround":
                        var candidates:Array<Point> = [];
                        // find a seat
                        gameState.eatingAreas.forEach((eatingArea:EatingArea):void => {
                            if (TurtleController.canSetTargetDestination(gameState, eatingArea.chair.atPosition)) {
                                candidates.push(eatingArea.chair.atPosition);
                            }
                        });
                        if (candidates.length == 0) {
                            // find any position that's a chair
                            gameState.entities.chairs.forEach((chair:Chair):void => {
                                chair.getAllSpaces().forEach((point:Point) => {
                                    if (TurtleController.canSetTargetDestination(gameState, point)) {
                                        candidates.push(point);
                                    }
                                });
                            });
                        }
                        if (candidates.length > 0) {
                            var cNum = Math.floor(Math.random() * candidates.length);
                            turtle.targetPosition = new Point(candidates[cNum].x, candidates[cNum].y);
                            turtle.status = "preNavigation";
                        } else {
                            if (turtle.status == "justEntered") {
                                var direction : Point = Direction.toVector(turtle.direction);
                                turtle.targetPosition.set(turtle.position.x + direction.x, turtle.position.y + direction.y);
                                turtle.status = "lookingAround";
                                turtle.timeUntilDecision = 60;
                            } else {
                                var door : Door = getRandomElement<Door>(gameState.entities.doors.underlyingArray);
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
                    case "preNavigation":
                        GAME_ENGINE.raiseSave();
                        var roomNode : RoomNode = gameState.roomModel.getRoomNode(turtle.targetPosition);
                        if (roomNode.isEatingSeat()) {
                            turtle.status = "navigatingToSeat";
                        } else if (roomNode.staticModels.find((model : EntityModel) => model.getEntityClass() == EntityType.Door)) {
                            turtle.status = "exiting";
                        } else {
                            turtle.status = "navigatingToPosition";
                        }
                        break;
                    case "sitting":
                        if (Math.random() <= 0.01) {
                            turtle.mood.incrementMoodLevel("fork", 1);
                        }
                        if (turtle.mood.getHighestMood() == "heart") {
                            // time to go
                            var door : Door = getRandomElement<Door>(gameState.entities.doors.underlyingArray);
                            turtle.targetPosition = new Point(door.position.x, door.position.y);
                            turtle.status = "exiting";
                        }
                        break;
                    case "exiting":
                        if (turtle.atTargetPosition()) {
                            // turtle leaves cafe here
                            gameState.userProgress.ratingLog.push({
                                numStars: Math.floor(Math.random() * 5 + 1) // just let it rate 1-5 stars at random
                            });
                            gameState.entities.turtles.remove(turtle);
                            GAME_ENGINE.raiseSave();
                        }
                        break;
                    default:
                        break;
                }
            } else {
                turtle.timeUntilDecision--;
            }
        }

        private static canSetTargetDestination(gameState : GameState, position : Point) : boolean {
            return !gameState.entities.turtles.underlyingArray.find((otherTurtle : Turtle) : boolean =>
                (otherTurtle.position.x == position.x && otherTurtle.position.y == position.y) ||
                (otherTurtle.targetPosition.x == position.x && otherTurtle.targetPosition.y == position.y));
        }

        private static rarityToProbability(rarity : number) : number {
            return Math.pow(1 - rarity / 100.0, 16);
        }

        private static simulateTurtleActions(gameState, turtle, timeLeft) : void {
            while (timeLeft > 0) {
                TurtleController.processBrain(gameState, turtle);
                timeLeft = TurtleController.processMovement(gameState, turtle, timeLeft);
                TurtleController.processInput(gameState, turtle);
                timeLeft = TurtleController.processEating(gameState, turtle, timeLeft);
                if (turtle.atTargetPosition()) {
                    turtle.currentAction = "stand";
                } else {
                    turtle.currentAction = "walk";
                }
            }
        }

        updateInternal(gameState : GameState, dt : number) : void {
            // update existing turtles
            if (gameState.uiModel.getChild("game").visible) {
                gameState.entities.turtles.forEach(
                    (turtle:Turtle):void => TurtleController.simulateTurtleActions(gameState, turtle, dt + gameState.fastForward)
                );
            }
            gameState.spawnModel.time += dt + gameState.fastForward;
            while (gameState.spawnModel.time > 1) {
                gameState.spawnModel.time--;
                gameState.spawnModel.currentIndex++;
                if (gameState.spawnModel.currentIndex >= this.turtles.length) {
                    gameState.spawnModel.currentIndex = 0;
                }
                var possibleTurtle:TurtleData = this.turtles[gameState.spawnModel.currentIndex];
                // check if the turtle's already there by any chance
                var exists = false;
                gameState.entities.turtles.forEach((turtle:Turtle):void => {
                    if (turtle.appearanceID == possibleTurtle.id) {
                        exists = true;
                    }
                }, true);
                if (exists) {
                    continue;
                }
                if (Math.random() < TurtleController.rarityToProbability(possibleTurtle.rarity)) {
                    // pick a random door
                    var door:Door = getRandomElement<Door>(gameState.entities.doors.underlyingArray);
                    var newTurtle : Turtle = gameState.entities.turtles.add({
                        position: [door.position.x, door.position.y],
                        direction: Direction.getDirectionalString(door.direction),
                        appearanceID: possibleTurtle.id,
                        actionStatus: "stand",
                        additionalData: {
                            targetPosition: [door.position.x, door.position.y], // doesn't matter
                            mood: {happy: 3},
                            status: "justEntered"
                        }
                    });
                    TurtleController.simulateTurtleActions(gameState, newTurtle, gameState.spawnModel.time);
                }
            }
            // set fast forward to zero to indicate we're no longer interested in it.
            gameState.fastForward = 0;
        }
    }
}