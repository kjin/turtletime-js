module TurtleTime {
    /**
     * A controller that maintains associations between objects.
     */
    export class AssociationController extends Controller<GameState> {
        initialize(gameState:GameState):void {
            this._readState = {
                roomModel: gameState.roomModel,
                tables: gameState.entities.tables,
                chairs: gameState.entities.chairs
            };
            this._writeState = {
                food: gameState.entities.food
            };
        }

        update(dt:number):void {
            this._writeState.food.forEach((food : Food) : void => {
                if (food.table == null) {
                    var table : Table = this._readState.tables.underlyingArray.find(food.overlaps.bind(food));
                    if (table != null) {
                        food.table = table;
                    }
                }
                if (food.chair == null) {
                    var chair : Chair = this._readState.chairs.underlyingArray.find((chair : Chair) : boolean => {
                        var foodPosition : Point = Direction.toVector(chair.direction);
                        foodPosition.add(chair.position.x, chair.position.y);
                        return foodPosition.x == food.position.x && foodPosition.y == food.position.y;
                    });
                    if (chair != null) {
                        food.chair = chair;
                        food.chair.food = food;
                    }
                }
            });
        }
    }
}