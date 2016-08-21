module TurtleTime {
    export class FoodSpawnController extends QuickController<GameState> {
        protected updateInternal(gameState : GameState, dt:number):void {
            if (gameState.uiInteractionModel.currentFood != null) {
                // spawn the food incantation
                if (gameState.selectionModel.entity != null &&
                    gameState.selectionModel.entity instanceof Turtle) {
                    var turtle : Turtle = (<Turtle>gameState.selectionModel.entity);
                    if (turtle.atTargetPosition()) {
                        var eatingArea:EatingArea = gameState.roomModel.getRoomNode(turtle.position).eatingArea;
                        if (eatingArea != null && Point.equals(turtle.position, eatingArea.chair.atPosition)) {
                            var food:Food = gameState.roomModel.getRoomNode(eatingArea.table.atPosition).food;
                            if (food == null) {
                                var chairDirectionVector:Point = Direction.toVector(eatingArea.chair.chair.direction);
                                gameState.entities.food.add({
                                    position: [eatingArea.chair.chair.position.x + chairDirectionVector.x, eatingArea.chair.chair.position.y + chairDirectionVector.y],
                                    direction: Direction.getDirectionalString(eatingArea.chair.chair.direction),
                                    appearanceID: gameState.uiInteractionModel.currentFood,
                                    actionStatus: "default",
                                    additionalData: {
                                        hp: 100
                                    }
                                });
                                GAME_ENGINE.raiseSave();
                            }
                        }
                    }
                    gameState.uiInteractionModel.currentFood = null;
                }
            }
        }

    }
}