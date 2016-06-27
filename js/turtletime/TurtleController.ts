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
                    var px : number = game.input.activePointer.x;
                    var py : number = game.input.activePointer.y;
                    if (Math.abs(px - turtle.sprite.x) < 20 && Math.abs(py - turtle.sprite.y) < 20) {
                        turtle.effect = "highlighted";
                    } else {
                        turtle.effect = "normal";
                    }
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