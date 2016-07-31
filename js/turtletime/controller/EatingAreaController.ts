module TurtleTime {
    export class EatingAreaController extends Controller<GameState> {
        initialize(gameState:TurtleTime.GameState):void {
            this._readState = {
                chairs: gameState.entities.chairs,
                tables: gameState.entities.tables
            };
            this._writeState = {
                eatingAreas: gameState.eatingAreas,
                roomModel: gameState.roomModel
            }
        }

        private populateEatingAreas() {
            this._readState.chairs.forEach((chair : Chair) => {
                var chairSpaces : Array<Point> = chair.getAllSpaces();
                this._readState.tables.forEach((table : Table) => {
                    var tableSpaces : Array<Point> = table.getAllSpaces();
                    chairSpaces.forEach((chairSpace : Point) => {
                        tableSpaces.forEach((tableSpace : Point) => {
                            var direction : Point = Direction.toVector(chair.direction);
                            if (chairSpace.x + direction.x == tableSpace.x &&
                                chairSpace.y + direction.y == tableSpace.y) {
                                var e : EatingArea = {
                                    chair: {
                                        chair: chair,
                                        atPosition: chairSpace
                                    },
                                    table: {
                                        table: table,
                                        atPosition: tableSpace
                                    }
                                };
                                this._writeState.eatingAreas.push(e);
                                this._writeState.roomModel.roomLayout[e.chair.atPosition.x][e.chair.atPosition.y].eatingArea = e;
                                this._writeState.roomModel.roomLayout[e.table.atPosition.x][e.table.atPosition.y].eatingArea = e;
                            }
                        });
                    });
                });
            });
        }

        update(dt:number):void {
            if (this._writeState.eatingAreas.length == 0) {
                // populate it
                this.populateEatingAreas();
            }
        }
    }
}