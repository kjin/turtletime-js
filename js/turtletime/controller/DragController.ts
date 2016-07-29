///<reference path="../core/Controller.ts"/>
///<reference path="../model/GameState.ts"/>

module TurtleTime {
    export class DragController extends Controller<GameState> {
        cameraOnClick : Point = new Point();

        initialize(gameState:GameState):void {
            this._readState = {
                inputModel: gameState.inputState,
                gameUI : gameState.uiModel.getChild("game"),
                roomModel : gameState.roomModel
            };
            this._writeState = {
                selectionModel: gameState.selectionModel,
                cameraModel: gameState.cameraModel
            };
        }

        update(dt:number):void {
            var input:InputModel = this._readState.inputModel;
            var selectionModel : SelectionModel = this._writeState.selectionModel;
            if (this._readState.gameUI.visible) {
                if (selectionModel.entity != null) {
                    if (!input.justReleased) {
                        selectionModel.continueDrag(this._readState.roomModel, input.inputX, input.inputY);
                    } else {
                        selectionModel.endDrag();
                    }
                } else if (input.isDragged) {
                    this._writeState.cameraModel.peekTarget().x = this.cameraOnClick.x - (input.inputX - input.atClickX) / GAME_ENGINE.globalData.roomScale[0];
                    this._writeState.cameraModel.peekTarget().y = this.cameraOnClick.y - (input.inputY - input.atClickY) / GAME_ENGINE.globalData.roomScale[1];
                } else if (input.justPressed) {
                    this.cameraOnClick.x = this._writeState.cameraModel.peekTarget().x;
                    this.cameraOnClick.y = this._writeState.cameraModel.peekTarget().y;
                }
            }
        }
    }
}