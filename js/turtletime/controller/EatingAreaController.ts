module TurtleTime {
    export class EatingAreaController extends Controller<GameState> {
        initialize(gameState:TurtleTime.GameState):void {
            this._readState = {
                chairs: gameState.entities.chairs,
                tables: gameState.entities.tables,
                roomModel: gameState.roomModel
            };
            this._writeState = {
                eatingAreas: gameState.eatingAreas,
                food: gameState.entities.food
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
                            }
                        });
                    });
                });
            });
        }

        private processLinks(eatingArea : EatingArea) {
            eatingArea.turtle = this._readState.roomModel.roomLayout[eatingArea.chair.atPosition.x][eatingArea.chair.atPosition.y].turtle;
            eatingArea.food = this._readState.roomModel.roomLayout[eatingArea.table.atPosition.x][eatingArea.table.atPosition.y].food;
        }

        private processEatingFood(eatingArea : EatingArea) {
            if (eatingArea.turtle != null && eatingArea.food != null) {
                eatingArea.food.hp--;
                if (eatingArea.food.hp == 0) {
                    this._writeState.food.remove(eatingArea.food);
                    eatingArea.food = null;
                    eatingArea.turtle.mood.setMoodLevel("fork", 0);
                    eatingArea.turtle.mood.incrementMoodLevel("happy", 1);
                }
            }
        }

        update(dt:number):void {
            if (this._writeState.eatingAreas.length == 0) {
                // populate it
                this.populateEatingAreas();
            }
            this._writeState.eatingAreas.forEach((eatingArea : EatingArea) => {
                this.processLinks(eatingArea);
                this.processEatingFood(eatingArea);
            });
        }
    }
}