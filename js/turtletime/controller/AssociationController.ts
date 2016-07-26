namespace TurtleTime {
    export class AssociationController extends Controller<GameState> {
        initialize(gameState:TurtleTime.GameState):void {
            this._readState = {
                roomModel: gameState.roomModel
            };
            this._writeState = {
                food: gameState.entities.food
            };
        }

        update(dt:number):void {
            this._writeState.food.forEach((food : Food) => {
                if (this._readState.roomModel.roomLayout[food.position.x][food.position.y].staticModels.length > 0) {
                    food.heightFromGround = 1;
                } else {
                    food.heightFromGround = 0;
                }
            });
        }
    }
}