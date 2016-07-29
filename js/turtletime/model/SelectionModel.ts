///<reference path="../core/EntityModel.ts"/>
///<reference path="../data/Constants.ts"/>

module TurtleTime {
    export class SelectionModel extends VisibleModel {
        entity : EntityModel;
        selectedOnClick : number = -1;
        isBeingDragged : boolean = false;
        // if entity is being dragged, then where is the mouse?
        currentDragPosition : Point = new Point();
        currentDragPositionInRoom : Point = new Point();
        prevDragPosition : Point = new Point(0, 0);

        constructor() {
            super();
            this.layerNumber = LAYER_UI;
        }

        get deltaDragX() : number {
            if (!this.isBeingDragged) {
                return 0;
            } else {
                return this.currentDragPosition.x - this.prevDragPosition.x;
            }
        }

        get deltaDragY() : number {
            if (!this.isBeingDragged) {
                return 0;
            } else {
                return this.currentDragPosition.y - this.prevDragPosition.y;
            }
        }

        startDrag() {
            if (this.entity != null) {
                this.isBeingDragged = true;
                this.currentDragPosition.x = NaN;
                this.currentDragPosition.y = NaN;
            }
        }

        continueDrag(roomModel : RoomModel, inputX : number, inputY : number) {
            if (this.isBeingDragged) {
                if (isNaN(this.currentDragPosition.x)) {
                    this.prevDragPosition.x = this.currentDragPosition.x;
                    this.prevDragPosition.y = this.currentDragPosition.y;
                }
                this.currentDragPosition.x = inputX;
                this.currentDragPosition.y = inputY;
                screenToRoomPoint(this.currentDragPositionInRoom, this.currentDragPosition.x,
                    this.currentDragPosition.y + UI_DRAG_Y_OFFSET);
                this.currentDragPositionInRoom.x = Math.floor(this.currentDragPositionInRoom.x);
                this.currentDragPositionInRoom.y = Math.floor(this.currentDragPositionInRoom.y);
                roomModel.clamp(this.currentDragPositionInRoom);
            }
        }

        endDrag() {
            if (this.isBeingDragged) {
                this.entity.setTargetPosition(this.currentDragPositionInRoom.x, this.currentDragPositionInRoom.y);
                this.entity = null;
                this.isBeingDragged = false;
            }
        }
    }
}