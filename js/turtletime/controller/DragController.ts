///<reference path="../core/Controller.ts"/>
///<reference path="../model/GameState.ts"/>

module TurtleTime {
    export class DragController extends Controller<GameState> {
        cameraOnClick : Point = new Point();

        initialize(gameState:GameState):void {
            this._readState = {
                inputModel: gameState.inputState
            };
            this._writeState = {
                selectionModel: gameState.selectionModel,
                cameraModel: gameState.cameraModel
            };
        }

        update(dt:number):void {
            var input : InputModel = this._readState.inputModel;
            if (this._writeState.selectionModel.entity != null) {
                if (input.isDragged &&
                    (this._writeState.selectionModel.isBeingDragged ||
                     this._writeState.selectionModel.entity.view.contains(
                         input.atClickX,
                         input.atClickY))) {
                    this._writeState.selectionModel.isBeingDragged = true;
                    if (this._writeState.selectionModel.currentDragPosition == null) {
                        this._writeState.selectionModel.currentDragPosition = new Point();
                        this._writeState.selectionModel.prevDragPosition.x = input.inputX;
                        this._writeState.selectionModel.prevDragPosition.y = input.inputY;
                    } else {
                        this._writeState.selectionModel.prevDragPosition.x = this._writeState.selectionModel.currentDragPosition.x;
                        this._writeState.selectionModel.prevDragPosition.y = this._writeState.selectionModel.currentDragPosition.y;
                    }
                    this._writeState.selectionModel.currentDragPosition.x = input.inputX;
                    this._writeState.selectionModel.currentDragPosition.y = input.inputY;
                    screenToRoomPoint(this._writeState.selectionModel.currentDragPositionInRoom, this._writeState.selectionModel.currentDragPosition.x,
                        this._writeState.selectionModel.currentDragPosition.y +
                        this._writeState.selectionModel.entity.view.height / 2);
                    this._writeState.selectionModel.currentDragPositionInRoom.x = Math.floor(this._writeState.selectionModel.currentDragPositionInRoom.x);
                    this._writeState.selectionModel.currentDragPositionInRoom.y = Math.floor(this._writeState.selectionModel.currentDragPositionInRoom.y);
                } else {
                    this._writeState.selectionModel.isBeingDragged = false;
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