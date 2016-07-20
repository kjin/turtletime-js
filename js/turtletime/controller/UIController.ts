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
                    this._readState.inputModel.inputY,
                    true
                );
            
            // specific to turtle time
            var justPressed = this._readState.inputModel.justPressed;
            if (justPressed) {
                var active:UIModel = this._writeState.uiInteractionModel.activeUIModel;
                var root:UIModel = this._writeState.rootUI;
                if (active.fullID == "menuButton") {
                    root.getChild("menu").visible = true;
                    root.getChild("menu.body.mainMenu").visible = true;
                    root.getChild("game").visible = false;
                }
                else if (active.fullID == "menu.exit") {
                    root.getChild("menu").visible = false;
                    root.getChild("game").visible = true;
                }
                else if (active.fullID == "menu.body.mainMenu.foodMenu.icon") {
                    root.getChild("menu.body.mainMenu").visible = false;
                    root.getChild("menu.body.foodMenu").visible = true;
                }
            }
        }
    }
}