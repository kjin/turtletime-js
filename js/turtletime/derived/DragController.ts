module TurtleTime {
    export class DragController extends Controller {
        initialize(gameState:GameState, gameView:Array<BaseView>):void {
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
                    this._writeState.selectionModel.entity.view.contains(
                         this._readState.inputModel.atClickX,
                         this._readState.inputModel.atClickY)) {
                    this._writeState.selectionModel.isBeingDragged = true;
                    if (this._writeState.selectionModel.currentDragPosition == null) {
                        this._writeState.selectionModel.currentDragPosition = new Point();
                        this._writeState.selectionModel.deltaDragPosition.x = this._readState.inputModel.inputX;
                        this._writeState.selectionModel.deltaDragPosition.y = this._readState.inputModel.inputY;
                    } else {
                        this._writeState.selectionModel.deltaDragPosition.x = this._writeState.selectionModel.currentDragPosition.x;
                        this._writeState.selectionModel.deltaDragPosition.y = this._writeState.selectionModel.currentDragPosition.y;
                    }
                    this._writeState.selectionModel.currentDragPosition.x = this._readState.inputModel.inputX;
                    this._writeState.selectionModel.currentDragPosition.y = this._readState.inputModel.inputY;
                } else {
                    this._writeState.selectionModel.isBeingDragged = false;
                }
            }
        }
    }
}