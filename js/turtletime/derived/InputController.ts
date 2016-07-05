module TurtleTime {
    export class InputController extends Controller {
        initialize(gameState:GameState, gameView : Array<BaseView>):void {
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
}