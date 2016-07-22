namespace TurtleTime {
    export class InGameUIController extends Controller<GameState> {
        initialize(gameState:TurtleTime.GameState):void {
            this._readState = {
                selectionModel: gameState.selectionModel
            };
            this._writeState = {
                gameUIModel: gameState.uiModel.getChild("game"),
                infoboxModel: gameState.uiModel.getChild("game.infobox"),
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
                }
            } else {
                this._writeState.dragNote.visible = false;
                this._writeState.infoboxModel.visible = false;
                this._writeState.foodMenu.visible = false;
            }
        }
    }
}