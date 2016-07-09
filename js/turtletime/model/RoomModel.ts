///<reference path="../core/VisibleModel.ts"/>
///<reference path="../data/Constants.ts"/>

module TurtleTime {
    export class RoomModel extends VisibleModel {
        width : number;
        height : number;
        wallHeight : number;
        floorPattern : string;
        wallPattern : string;

        constructor(data : RoomData) {
            super();
            this.width = data.size[0];
            this.height = data.size[1];
            this.floorPattern = data.floorPattern;
            this.wallPattern = data.wallPattern;
            this.wallHeight = data.wallHeight;
            this.layerNumber = LAYER_FLOOR;
        }

        serialize() : RoomData {
            return {
                size: [this.width, this.height],
                wallHeight: this.wallHeight,
                floorPattern: this.floorPattern,
                wallPattern: this.wallPattern
            }
        }
    }
}