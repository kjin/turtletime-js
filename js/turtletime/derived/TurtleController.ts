module TurtleTime {
    import ReadState = TurtleTime.TurtleController.ReadState;
    import WriteState = TurtleTime.TurtleController.WriteState;

    export class TurtleController extends GameController<ReadState, WriteState> {
        initialize(gameState : GameState) : void {
            this._readState = {
                selectionModel: gameState.selectionModel
            };
            this._writeState = {
                turtles: gameState.entities.turtles
            };
        }

        update(dt : number) : void {
            this._writeState.turtles.forEach(
                (turtle : Turtle) : void => {
                    turtle.brain.update();
                    if (this._readState.selectionModel.entity == turtle) {
                        turtle.currentStatus = "selected";
                    } else {
                        turtle.currentStatus = "normal";
                    }
                }
            );
        }
    }

    export module TurtleController {
        export interface ReadState {
            selectionModel : SelectionModel
        }

        export interface WriteState {
            turtles : Array<Turtle>
        }
    }
}