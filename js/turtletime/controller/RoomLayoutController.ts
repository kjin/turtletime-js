module TurtleTime {
    export class RoomLayoutController extends Controller<GameState> {
        initialize(gameState:GameState):void {
            this._readState = {
                staticEntities: [gameState.entities.chairs, gameState.entities.doors, gameState.entities.tables],
                turtles: [gameState.entities.turtles],
                food: [gameState.entities.food]
            };
            this._writeState = {
                roomModel: gameState.roomModel
            }
        }

        private numStaticEntities : number = 0;

        private static populate(entities: Array<AbstractEntityCollection>,
                                popFunction : (entity : EntityModel, x : number, y : number) => void) : void {
            entities.forEach((collection : AbstractEntityCollection) : void => {
                collection.forEachModel((entity : EntityModel) => {
                    var minX = Math.floor(entity.position.x);
                    var minY = Math.floor(entity.position.y);
                    var maxX = Math.ceil(entity.position.x + entity.width);
                    var maxY = Math.ceil(entity.position.y + entity.height);
                    for (var x : number = minX; x < maxX; x++) {
                        for (var y : number = minY; y < maxY; y++) {
                            if (entity.occupiesSpace(x, y)) {
                                popFunction(entity, x, y);
                            }
                        }
                    }
                });
            });
        }

        update(dt:number):void {
            var sum = 0;
            for (var i = 0; i < this._readState.staticEntities.length; i++) {
                sum += this._readState.staticEntities[i].length;
            }
            if (sum > this.numStaticEntities) {
                RoomLayoutController.populate(this._readState.staticEntities, (entity, x, y) : void => {
                    this._writeState.roomModel.roomLayout[x][y].staticModels.push(entity);
                });
                this.numStaticEntities = sum;
            }
            twoDForEach(this._writeState.roomModel.roomLayout, (e : RoomNode) => { e.turtle = null; e.food = null; });
            RoomLayoutController.populate(this._readState.turtles, (entity, x, y) : void => {
                this._writeState.roomModel.roomLayout[x][y].turtle = entity;
            });
            RoomLayoutController.populate(this._readState.food, (entity, x, y) : void => {
                this._writeState.roomModel.roomLayout[x][y].food = entity;
            });
        }
    }
}