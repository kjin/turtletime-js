///<reference path="../core/VisibleModel.ts"/>
///<reference path="../data/Constants.ts"/>

module TurtleTime {
    export class RoomNode {
        staticModels : Array<EntityModel> = [];
        turtle : Turtle = null;
        food : Food = null;

        hasModel() : boolean {
            return this.staticModels.length > 0 || this.turtle != null || this.food != null;
        }
    }

    export class RoomModel extends VisibleModel {
        width : number;
        height : number;
        wallHeight : number;
        floorPattern : string;
        wallPattern : string;

        // Room layout
        roomLayout : Array<Array<RoomNode>>;

        constructor(data : RoomData) {
            super();
            this.width = data.size[0];
            this.height = data.size[1];
            this.floorPattern = data.floorPattern;
            this.wallPattern = data.wallPattern;
            this.wallHeight = data.wallHeight;
            this.layerNumber = LAYER_FLOOR;

            this.roomLayout = new Array<Array<RoomNode>>(this.width);
            for (var i : number = 0; i < this.width; i++) {
                this.roomLayout[i] = new Array<RoomNode>(this.height);
                for (var j : number = 0; j < this.height; j++) {
                    this.roomLayout[i][j] = new RoomNode;
                }
            }
        }

        isInRoomXY(x : number, y : number) : boolean {
            return x >= 0 && x < this.width && y >= 0 && y < this.height;
        }

        isUnoccupiedSpaceXY(x : number, y : number) : boolean {
            return this.isInRoomXY(x, y) && !this.roomLayout[x][y].hasModel();
        }

        clamp(point : Point) : void {
            if (point.x < 0) point.x = 0;
            if (point.x >= this.width) point.x = this.width - 1;
            if (point.y < 0) point.y = 0;
            if (point.y >= this.height) point.y = this.height - 1;
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