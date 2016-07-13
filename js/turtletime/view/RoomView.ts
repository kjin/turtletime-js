///<reference path="../core/View.ts"/>
///<reference path="../model/RoomModel.ts"/>

module TurtleTime {
    export class RoomView extends View<RoomModel> {
        private _floorTile : Phaser.TileSprite;
        private _wallTile : Phaser.TileSprite;
        private _wallTileTop : Phaser.TileSprite;
        private _graphics : Phaser.Graphics;
        
        constructor(model : RoomModel) {
            super(model);
            var topLeft : Point = roomToScreen(0, 0);
            var bottomRight : Point = roomToScreen(this.model.width, this.model.height);
            this._floorTile = GAME_ENGINE.game.add.tileSprite(
                topLeft.x,
                topLeft.y,
                bottomRight.x - topLeft.x,
                bottomRight.y - topLeft.y,
                this.model.floorPattern);
            if (this.model.wallHeight > 0) {
                var wallTop = this.model.wallPattern + "_top";
                var topHeight = GAME_ENGINE.game.cache.getBaseTexture(wallTop).height;
                this._wallTileTop = GAME_ENGINE.game.add.tileSprite(
                    topLeft.x,
                    topLeft.y - topHeight * this.model.wallHeight,
                    bottomRight.x - topLeft.x,
                    topHeight,
                    wallTop);
                if (this.model.wallHeight > 1) {
                    var sectionHeight = GAME_ENGINE.game.cache.getBaseTexture(this.model.wallPattern).height;
                    this._wallTile = GAME_ENGINE.game.add.tileSprite(
                        topLeft.x,
                        topLeft.y - sectionHeight * (this.model.wallHeight - 1),
                        bottomRight.x - topLeft.x,
                        sectionHeight * (this.model.wallHeight - 1),
                        this.model.wallPattern);
                }
            }
            this._graphics = GAME_ENGINE.game.add.graphics(0, 0);
        }

        update():void {
            if (checkGlobalOption('debugmode')) {
                this._graphics.clear();
                this._graphics.lineStyle(0, 0x000000, 0);
                this._graphics.beginFill(0xff0000, 0.75);
                twoDForEach(this.model.roomLayout, (cell:Array<EntityModel>, x:number, y:number) : void => {
                    if (cell.length > 0) {
                        var topLeft:Point = roomToScreen(x, y);
                        this._graphics.drawRect(topLeft.x, topLeft.y, GAME_ENGINE.globalData.roomScale[0], GAME_ENGINE.globalData.roomScale[1]);
                    }
                });
                this._graphics.endFill();
            }
        }

        enumerateGameObjects():Array<PIXI.DisplayObject> {
            return [this._floorTile, this._wallTile, this._wallTileTop, this._graphics];
        }
    }
}