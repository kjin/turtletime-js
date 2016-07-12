///<reference path="../core/Controller.ts"/>
///<reference path="../model/GameState.ts"/>

module TurtleTime {
    export class DragController extends Controller<GameState> {
        initialize(gameState:GameState):void {
            this._readState = {
                inputModel: gameState.inputState
            }
            this._writeState = {
                selectionModel: gameState.selectionModel
            }
        }

        update(dt:number):void {
            if (this._writeState.selectionModel.entity != null) {
                if (this._readState.inputModel.isDragged &&
                    (this._writeState.selectionModel.isBeingDragged ||
                     this._writeState.selectionModel.entity.view.contains(
                         this._readState.inputModel.atClickX,
                         this._readState.inputModel.atClickY))) {
                    this._writeState.selectionModel.isBeingDragged = true;
                    if (this._writeState.selectionModel.currentDragPosition == null) {
                        this._writeState.selectionModel.currentDragPosition = new Point();
                        this._writeState.selectionModel.prevDragPosition.x = this._readState.inputModel.inputX;
                        this._writeState.selectionModel.prevDragPosition.y = this._readState.inputModel.inputY;
                    } else {
                        this._writeState.selectionModel.prevDragPosition.x = this._writeState.selectionModel.currentDragPosition.x;
                        this._writeState.selectionModel.prevDragPosition.y = this._writeState.selectionModel.currentDragPosition.y;
                    }
                    this._writeState.selectionModel.currentDragPosition.x = this._readState.inputModel.inputX;
                    this._writeState.selectionModel.currentDragPosition.y = this._readState.inputModel.inputY;
                    screenToRoomPoint(this._writeState.selectionModel.currentDragPositionInRoom, this._writeState.selectionModel.currentDragPosition.x,
                        this._writeState.selectionModel.currentDragPosition.y +
                        this._writeState.selectionModel.entity.view.height / 2);
                    this._writeState.selectionModel.currentDragPositionInRoom.x = Math.floor(this._writeState.selectionModel.currentDragPositionInRoom.x);
                    this._writeState.selectionModel.currentDragPositionInRoom.y = Math.floor(this._writeState.selectionModel.currentDragPositionInRoom.y);
                } else {
                    this._writeState.selectionModel.isBeingDragged = false;
                }
            } else {
                // let's drag the screen around
                
            }
        }
    }
}