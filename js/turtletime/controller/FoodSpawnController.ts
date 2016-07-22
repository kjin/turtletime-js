module TurtleTime {
    export class FoodSpawnController extends Controller<GameState> {
        initialize(gameState:TurtleTime.GameState):void {
            this._readState = {
                selectionState: gameState.selectionModel
            };
            this._writeState = {
                uiInteractionModel: gameState.uiInteractionModel,
                foods: gameState.entities.food
            };
        }

        update(dt:number):void {
            if (this._writeState.uiInteractionModel.currentFood != null) {
                // spawn the food incantation
                if (this._readState.selectionState.entity != null &&
                    this._readState.selectionState.entity instanceof Turtle &&
                    (<Turtle>this._readState.selectionState.entity).chair != null &&
                    (<Turtle>this._readState.selectionState.entity).chair.food == null) {
                    var chair : Chair = (<Turtle>this._readState.selectionState.entity).chair;
                    var chairDirectionVector : Point = Direction.toVector(chair.direction);
                    this._writeState.foods.add({
                        position: [chair.position.x + chairDirectionVector.x, chair.position.y + chairDirectionVector.y],
                        direction: Direction.getDirectionalString(chair.direction),
                        appearanceID: this._writeState.uiInteractionModel.currentFood,
                        actionStatus: "default",
                        additionalData: {
                            hp: 100
                        }
                    });
                    this._writeState.uiInteractionModel.currentFood = null;
                }
            }
        }

    }
}