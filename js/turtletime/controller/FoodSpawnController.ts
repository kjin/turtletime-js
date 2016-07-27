module TurtleTime {
    export class FoodSpawnController extends Controller<GameState> {
        initialize(gameState:TurtleTime.GameState):void {
            this._readState = {
                selectionState: gameState.selectionModel,
                eatingAreas: gameState.eatingAreas
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
                    this._readState.selectionState.entity instanceof Turtle) {
                    var turtle : Turtle = (<Turtle>this._readState.selectionState.entity);
                    var eatingArea : EatingArea = this._readState.eatingAreas.find((eatingArea : EatingArea) : boolean => eatingArea.turtle == turtle);
                    if (eatingArea != null && eatingArea.food == null) {
                        var chairDirectionVector : Point = Direction.toVector(eatingArea.chair.chair.direction);
                        this._writeState.foods.add({
                            position: [eatingArea.chair.chair.position.x + chairDirectionVector.x, eatingArea.chair.chair.position.y + chairDirectionVector.y],
                            direction: Direction.getDirectionalString(eatingArea.chair.chair.direction),
                            appearanceID: this._writeState.uiInteractionModel.currentFood,
                            actionStatus: "default",
                            additionalData: {
                                hp: 100
                            }
                        });
                    }
                    this._writeState.uiInteractionModel.currentFood = null;
                }
            }
        }

    }
}