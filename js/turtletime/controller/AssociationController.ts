module TurtleTime {
    /**
     * A controller that maintains associations between objects.
     */
    export class AssociationController extends Controller<GameState> {
        initialize(gameState:GameState):void {
            this._readState = {
                roomModel: gameState.roomModel,
                tables: gameState.entities.tables
            };
            this._writeState = {
                food: gameState.entities.food
            };
        }

        update(dt:number):void {
            this._writeState.food.forEach((food : Food) : void => {
                if (food.onTable == null) {
                    var table : Table = this._readState.tables.find(food.overlaps);
                    if (table != null) {
                        food.onTable = table;
                    }
                }
            });
        }
    }
}