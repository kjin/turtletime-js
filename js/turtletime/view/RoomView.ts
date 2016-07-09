///<reference path="../core/View.ts"/>
///<reference path="../model/RoomModel.ts"/>

module TurtleTime {
    export class RoomView extends View<RoomModel> {
        private _floorTile : Phaser.TileSprite;
        private _wallTile : Phaser.TileSprite;
        private _wallTileTop : Phaser.TileSprite;
        
        constructor(model : RoomModel) {
            super(model);
            var topLeft : Point = roomToScreen(new Point(0, 0));
            var bottomRight : Point = roomToScreen(new Point(this.model.width, this.model.height));
            this._floorTile = game.add.tileSprite(
                topLeft.x,
                topLeft.y,
                bottomRight.x - topLeft.x,
                bottomRight.y - topLeft.y,
                this.model.floorPattern);
            if (this.model.wallHeight > 0) {
                var wallTop = this.model.wallPattern + "_top";
                var topHeight = game.cache.getBaseTexture(wallTop).height;
                this._wallTileTop = game.add.tileSprite(
                    topLeft.x,
                    topLeft.y - topHeight * this.model.wallHeight,
                    bottomRight.x - topLeft.x,
                    topHeight,
                    wallTop);
                if (this.model.wallHeight > 1) {
                    var sectionHeight = game.cache.getBaseTexture(this.model.wallPattern).height;
                    this._wallTile = game.add.tileSprite(
                        topLeft.x,
                        topLeft.y - sectionHeight * (this.model.wallHeight - 1),
                        bottomRight.x - topLeft.x,
                        sectionHeight * (this.model.wallHeight - 1),
                        this.model.wallPattern);
                }
            }
        }

        update():void {
        }

        bringToTop():void {
            // good thing this is the lowest layer
        }
    }
}