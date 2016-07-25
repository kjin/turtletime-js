module TurtleTime {
    export class RoomLayoutController extends Controller<GameState> {
        initialize(gameState:GameState):void {
            this._readState = {
                entities: [gameState.entities.turtles, gameState.entities.chairs, gameState.entities.doors, gameState.entities.tables]
            };
            this._writeState = {
                roomModel: gameState.roomModel
            };
        }

        update(dt:number):void {
            twoDForEach(this._writeState.roomModel.roomLayout, (e : Array<EntityModel>) => e.length = 0);
            this._readState.entities.forEach((collection : AbstractEntityCollection) : void => {
                collection.forEachModel((entity : EntityModel) => {
                    var minX = Math.floor(entity.position.x);
                    var minY = Math.floor(entity.position.y);
                    var maxX = Math.ceil(entity.position.x + entity.width);
                    var maxY = Math.ceil(entity.position.y + entity.height);
                    for (var x : number = minX; x < maxX; x++) {
                        for (var y : number = minY; y < maxY; y++) {
                            if (entity.occupiesSpace(x, y)) {
                                this._writeState.roomModel.roomLayout[x][y].push(entity);
                            }
                        }
                    }
                });
            });
        }
    }
}