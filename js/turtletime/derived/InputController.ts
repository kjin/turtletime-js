module TurtleTime {
    import ReadState = TurtleTime.InputController.ReadState;
    import WriteState = TurtleTime.InputController.WriteState;
    export class InputController extends GameController<ReadState, WriteState> {
        initialize(gameState:TurtleTime.GameState):void {
            this._writeState = {
                inputState: gameState.inputState
            }
        }

        update(dt:number):void {
            // update input first
            this._writeState.inputState.setCurrentMouseState(
                game.input.activePointer.x,
                game.input.activePointer.y,
                game.input.activePointer.isDown);
        }
    }

    export module InputController {
        export interface ReadState {

        }

        export interface WriteState {
            inputState : InputModel
        }
    }
}