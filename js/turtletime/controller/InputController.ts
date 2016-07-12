//<reference path="../core/Controller.ts"/>
//<reference path="../model/GameState.ts"/>

module TurtleTime {
    export class InputController extends Controller<GameState> {
        initialize(gameState:GameState):void {
            this._writeState = {
                inputState: gameState.inputState
            }
        }

        update(dt:number):void {
            // update input first
            this._writeState.inputState.setMouseState(
                GAME_ENGINE.game.input.activePointer.x,
                GAME_ENGINE.game.input.activePointer.y,
                GAME_ENGINE.game.input.activePointer.isDown);
            // debugLog("drag=" + this._writeState.inputState.isDragged);
        }
    }
}