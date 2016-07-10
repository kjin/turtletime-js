module TurtleTime {
    export class RoomLayoutController extends Controller<GameState> {
        initialize(gameState:GameState):void {
            this._readState = {
                entities: gameState.entities
            };
            this._writeState = {
                roomModel: gameState.roomModel
            };
        }

        update(dt:number):void {
            twoDForEach(this._writeState.roomModel.roomLayout, (e : Array<EntityModel>) => e.length = 0);
            for (var property in this._readState.entities) {
                if (this._readState.entities.hasOwnProperty(property)) {
                    this._readState.entities[property].forEachModel((entity : EntityModel) => {
                        var minX = Math.floor(entity.position.x);
                        var minY = Math.floor(entity.position.y);
                        var maxX = Math.ceil(entity.position.x + entity.dimensions.x);
                        var maxY = Math.ceil(entity.position.y + entity.dimensions.y);
                        for (var x : number = minX; x < maxX; x++) {
                            for (var y : number = minY; y < maxY; y++) {
                                this._writeState.roomModel.roomLayout[x][y].push(entity);
                            }
                        }
                    });
                }
            }
        }
    }
}