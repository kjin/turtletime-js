///<reference path="../abstract/VisibleModel.ts"/>

module TurtleTime {
    export class SelectionModel extends VisibleModel {
        entity : EntityModel;
        selectedOnClick : number = -1;
        isBeingDragged : boolean = false;
        // if entity is being dragged, then where is the mouse?
        currentDragPosition : Point = null;
        prevDragPosition : Point = new Point(0, 0);

        constructor() {
            super();
            this.layerNumber = LAYER_UI;
        }

        get deltaDragX() : number {
            if (this.currentDragPosition == null) {
                return 0;
            } else {
                return this.currentDragPosition.x - this.prevDragPosition.x;
            }
        }

        get deltaDragY() : number {
            if (this.currentDragPosition == null) {
                return 0;
            } else {
                return this.currentDragPosition.y - this.prevDragPosition.y;
            }
        }
    }
}