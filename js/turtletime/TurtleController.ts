module TurtleTime {
    import ReadState = TurtleTime.TurtleController.ReadState;
    import WriteState = TurtleTime.TurtleController.WriteState;

    export class TurtleController extends GameController<ReadState, WriteState> {
        initialize(gameState : GameState) : void {
            // this._readState = null;
            this._writeState = {
                turtles: gameState.entities.turtles
            };
        }

        update(dt : number) : void {
            this._writeState.turtles.forEach(
                (turtle : Turtle) : void => {
                    turtle.brain.update();
                }
            );
        }
    }

    export module TurtleController {
        export interface ReadState {

        }

        export interface WriteState {
            turtles : Array<Turtle>
        }
    }
}