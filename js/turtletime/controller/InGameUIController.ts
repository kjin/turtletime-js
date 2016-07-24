namespace TurtleTime {
    export class InGameUIController extends Controller<GameState> {
        initialize(gameState:TurtleTime.GameState):void {
            this._readState = {
                selectionModel: gameState.selectionModel
            };
            this._writeState = {
                gameUIModel: gameState.uiModel.getChild("game"),
                infoboxModel: gameState.uiModel.getChild("game.infobox"),
                infoboxModelText: gameState.uiModel.getChild("game.infobox.text"),
                foodMenu: gameState.uiModel.getChild("game.foodMenuContainer"),
                dragNote: gameState.uiModel.getChild("game.dragNote")
            };
        }

        update(dt:number):void {
            if (this._readState.selectionModel.entity != null) {
                var turtle : Turtle = <Turtle>this._readState.selectionModel.entity;
                if (this._readState.selectionModel.isBeingDragged) {
                    this._writeState.dragNote.visible = true;
                    this._writeState.infoboxModel.visible = false;
                    this._writeState.foodMenu.visible = false;
                } else {
                    this._writeState.dragNote.visible = false;
                    this._writeState.infoboxModel.visible = true;
                    this._writeState.foodMenu.visible = turtle.chair != null;
                    // update infobox
                    this._writeState.infoboxModelText.appearance.normal.text.text = (() : string => {
                        var turtleData : TurtleData = GAME_ENGINE.globalData.turtleData.get(turtle.appearanceID);
                        return "Name: " + turtleData.name + "\n" +
                            "Description: " + turtleData.description + "\n" +
                            "Likes: " + turtleData.likes + "\n" +
                            "Dislikes: " + turtleData.dislikes;
                    })();
                }
            } else {
                this._writeState.dragNote.visible = false;
                this._writeState.infoboxModel.visible = false;
                this._writeState.foodMenu.visible = false;
            }
        }
    }
}