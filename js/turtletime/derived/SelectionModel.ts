///<reference path="../abstract/VisibleModel.ts"/>

module TurtleTime {
    export class SelectionModel extends VisibleModel {
        entity : EntityModel;
        isBeingDragged : boolean = false;
        // if entity is being dragged, then where is the mouse?
        currentDragPosition : Point = null;
        deltaDragPosition : Point = new Point(0, 0);

        constructor() {
            super();
            this.layerNumber = LAYER_UI;
        }
    }
}