module TurtleTime {
    export class UIController extends Controller<GameState> {
        initialize(gameState:GameState):void {
            this._readState = {
                inputModel: gameState.inputState,
                rootUI : gameState.uiModel
            };
            this._writeState = {
                uiInteractionModel: gameState.uiInteractionModel
            }
        }

        update(dt:number):void {
            this._writeState.uiInteractionModel.activeUIModel =
                this._readState.rootUI.getDeepestElementContaining(
                    this._readState.inputModel.inputX,
                    this._readState.inputModel.inputY
                );
        }
    }
}