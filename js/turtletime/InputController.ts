module TurtleTime {
    import ReadState = TurtleTime.InputController.ReadState;
    import WriteState = TurtleTime.InputController.WriteState;
    export class InputController extends GameController<ReadState, WriteState> {
        initialize(gameState:TurtleTime.GameState):void {
            this._writeState = {
                selectionModel: gameState.selectionModel,
                turtles: gameState.entities.turtles
            }
        }

        update(dt:number):void {
            this._writeState.turtles.forEach(
                (turtle : Turtle) : void => {
                    turtle.brain.update();
                    var px : number = game.input.activePointer.x;
                    var py : number = game.input.activePointer.y;
                    if (turtle.sprite.contains(px, py)) {
                        if (game.input.activePointer.isDown) {
                            turtle.effect = "highlighted";
                            this._writeState.selectionModel.entity = turtle;
                        } else {
                            turtle.effect = "over";
                        }
                    }
                }
            );
        }
    }

    export module InputController {
        export interface ReadState {

        }

        export interface WriteState {
            selectionModel : SelectionModel,
            turtles : Array<Turtle>
        }
    }
}