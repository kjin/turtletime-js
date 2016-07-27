module TurtleTime {
    export class UIController extends Controller<GameState> {
        onClick : Map<UIModel, (root : UIModel, state : UIInteractionModel) => void>;

        initialize(gameState:GameState):void {
            this._readState = {
                inputModel: gameState.inputState
            };
            this._writeState = {
                rootUI: gameState.uiModel,
                uiInteractionModel: gameState.uiInteractionModel
            };
            // TODO figure out where to put this
            // food generation
            this._writeState.rootUI.getEntireTree().forEach((node : UIModel) => {
                switch (node.generate) {
                    case "foodItems":
                        var num = 0;
                        GAME_ENGINE.globalData.foodData.forEach((food : FoodData) => {
                            node.addChild({
                                id: food.id,
                                template: {
                                    id: "foodItem",
                                    subs: ["5%", "5%+" + (num++ * 60) + "px", food.id, food.name]
                                }
                            });
                        });
                        break;
                }
            });
            this.onClick = new Map<UIModel, (root : UIModel, state : UIInteractionModel) => void>();
            // initialize the actions that fire on click
            this.initializeOnClick();
        }

        update(dt:number):void {
            this._writeState.uiInteractionModel.activeUIModel =
                this._writeState.rootUI.getDeepestElementContaining(
                    this._readState.inputModel.inputX,
                    this._readState.inputModel.inputY,
                    true
                );

            var justPressed = this._readState.inputModel.justPressed;
            if (justPressed) {
                var active:UIModel = this._writeState.uiInteractionModel.activeUIModel;
                // if there's an action assigned to pressing a certain UI element, trigger it
                if (this.onClick.has(active)) {
                    this.onClick.get(active)(this._writeState.rootUI, this._writeState.uiInteractionModel);
                }
            }
        }

        private assign(element : string, action : (root : UIModel, state : UIInteractionModel) => void) {
            this.onClick.set(this._writeState.rootUI.getChild(element), action);
        }

        private initializeOnClick() : void {
            this._writeState.uiInteractionModel.menuStack.onPush = (stack : UIStack) => {
                this._writeState.rootUI.getChild("menu.backButton").visible = stack.length() > 1;
            };
            this._writeState.uiInteractionModel.menuStack.onPop = (stack : UIStack) => {
                this._writeState.rootUI.getChild("menu.backButton").visible = stack.length() > 1;
            };
            this._writeState.uiInteractionModel.menuStack.onClear = (stack : UIStack) => {
                this._writeState.rootUI.getChild("menu.backButton").visible = false;
            };
            this.assign("menuButton", (root, state) => {
                if (!root.getChild("menu").visible) { // if menu isn't open
                    root.getChild("menu").visible = true;
                    state.menuStack.push(root.getChild("menu.body.mainMenu"));
                    root.getChild("game").visible = false;
                } else { // if menu is open
                    state.menuStack.clear();
                    root.getChild("menu").visible = false;
                    root.getChild("game").visible = true;
                }
            });
            this.assign("menu.exitButton", (root, state) => {
                state.menuStack.clear();
                root.getChild("menu").visible = false;
                root.getChild("game").visible = true;
            });
            this.assign("menu.backButton", (root, state) => {
                state.menuStack.pop();
            });
            this.assign("menu.body.mainMenu.foodMenu.icon", (root, state) => {
                state.menuStack.push(root.getChild("menu.body.foodMenu"));
            });
            this._writeState.rootUI.getChild("game.foodMenuContainer.foodMenu").children.forEach((child : UIModel) : void => {
                this.assign(child.getChild("icon").fullID, (root, state) => {
                    state.currentFood = child.id;
                });
            });
        }
    }
}