module TurtleTime {
    export class UIController extends Controller<GameState> {
        initialize(gameState:GameState):void {
            this._readState = {
                inputModel: gameState.inputState
            };
            this._writeState = {
                rootUI : gameState.uiModel,
                uiInteractionModel: gameState.uiInteractionModel
            }
        }

        update(dt:number):void {
            this._writeState.uiInteractionModel.activeUIModel =
                this._writeState.rootUI.getDeepestElementContaining(
                    this._readState.inputModel.inputX,
                    this._readState.inputModel.inputY
                );
            
            // specific to turtle time
            var justPressed = this._readState.inputModel.justPressed;
            if (justPressed) {
                var active:UIModel = this._writeState.uiInteractionModel.activeUIModel;
                if (active.fullID == "menuButton") {
                    var menu:UIModel = this._writeState.rootUI.getChild("menu");
                    menu.visible = !menu.visible;
                    this._writeState.rootUI.getChild("game").visible = !menu.visible;
                }
                else if (active.fullID == "menu.exit") {
                    var menu:UIModel = this._writeState.rootUI.getChild("menu");
                    menu.visible = false;
                    this._writeState.rootUI.getChild("game").visible = !menu.visible;
                }
            }
        }
    }
}