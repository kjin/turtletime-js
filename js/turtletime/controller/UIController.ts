module TurtleTime {
    export class UIController extends Controller<GameState> {
        onClick : Map<UIModel, (root : UIModel, state : UIInteractionModel) => void>;

        initialize(gameState:GameState):void {
            this._readState = {
                inputModel: gameState.inputState
            };
            this._writeState = {
                rootUI: gameState.uiModel,
                uiInteractionModel: gameState.uiInteractionModel,
                selectionModel: gameState.selectionModel
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
                root.getChild("menu.body.foodMenu.confirmButton").visible = false;
                state.menuStack.push(root.getChild("menu.body.foodMenu"));
            });
            this._writeState.rootUI.getChild("menu.body.foodMenu.foodMenu").children.forEach((child : UIModel) : void => {
                this.assign(child.getChild("icon").fullID, (root, state) => {
                    if (!child.getChild("icon").data.toggled) {
                        this._writeState.rootUI.getChild("menu.body.foodMenu.foodMenu").children.forEach((competingChild:UIModel) => {
                            competingChild.getChild("icon").visualState = "normal";
                            competingChild.getChild("icon").data.toggled = false;
                        });
                        child.getChild("icon").visualState = "toggled";
                        child.getChild("icon").data.toggled = true;
                        this._writeState.rootUI.getChild("menu.body.foodMenu.foodDescription").appearance.normal.text.text =
                            GAME_ENGINE.globalData.foodData.get(child.id).description;
                    } else {
                        child.getChild("icon").visualState = "normal";
                        child.getChild("icon").data.toggled = false;
                        this._writeState.rootUI.getChild("menu.body.foodMenu.foodDescription").appearance.normal.text.text = "";
                    }
                    // state.currentFood = child.id;
                });
            });
            this.assign("menu.body.foodMenu.confirmButton", (root, state) => {
                var food = this._writeState.rootUI
                    .getChild("menu.body.foodMenu.foodMenu").getAllChildren()
                    .find((child : UIModel) => child.getChild("icon").data.toggled);
                if (food != null) {
                    state.menuStack.pop();
                    state.currentFood = food.id;
                    root.getChild("menu").visible = false;
                    root.getChild("game").visible = true;
                }
            });
            this.assign("game.popMenu.drag", (root, state) => {
                this._writeState.selectionModel.startDrag();
            });
            this.assign("game.popMenu.profile", (root, state) => {
                root.getChild("menu").visible = true;
                var turtleData : TurtleData = GAME_ENGINE.globalData.turtleData.get(state.currentTurtle);
                root.getChild("menu.body.profile.view").appearance.normal.sprite.spriteID = turtleData.id;
                root.getChild("menu.body.profile.name").appearance.normal.text.text = turtleData.name;
                root.getChild("menu.body.profile.description").appearance.normal.text.text = "Description: " + turtleData.description + "\n" +
                    "Likes: " + turtleData.likes + "\n" +
                    "Dislikes: " + turtleData.dislikes;
                state.menuStack.push(root.getChild("menu.body.profile"));
                root.getChild("game").visible = false;
            });
            this.assign("game.popMenu.menu", (root, state) => {
                root.getChild("menu.body.foodMenu.foodMenu").children.forEach((child:UIModel) => {
                    child.getChild("icon").visualState = "normal";
                    child.getChild("icon").data.toggled = false;
                });
                root.getChild("menu.body.foodMenu.foodDescription").appearance.normal.text.text = "";
                root.getChild("menu").visible = true;
                root.getChild("menu.body.foodMenu.confirmButton").visible = true;
                state.menuStack.push(root.getChild("menu.body.foodMenu"));
                root.getChild("game").visible = false;
            });
        }
    }
}