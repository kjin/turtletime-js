module TurtleTime {
    export class RoomModel extends VisibleModel {
        width : number;
        height : number;

        constructor(width : number, height : number) {
            super();
            this.width = width;
            this.height = height;
            this.layerNumber = LAYER_FLOOR;
        }
    }
}