///<reference path="../core/View.ts"/>
///<reference path="../model/RoomModel.ts"/>

module TurtleTime {
    export class RoomView extends View<RoomModel> {
        private _floorTile : Phaser.TileSprite;
        private _wallTile : Phaser.TileSprite;
        private _wallTileTop : Phaser.TileSprite;
        private _graphics : Phaser.Graphics;
        private _topHeight : number;
        private _sectionHeight : number;
        
        constructor(model : RoomModel) {
            super(model);
            var topLeft : Point = roomToScreen(0, 0);
            var bottomRight : Point = roomToScreen(this.model.width, this.model.height);
            this._floorTile = GAME_ENGINE.game.add.tileSprite(
                topLeft.x,
                topLeft.y,
                bottomRight.x - topLeft.x,
                bottomRight.y - topLeft.y,
                "room/" + this.model.floorPattern);
            if (this.model.wallHeight > 0) {
                var wallTop = "room/" + this.model.wallPattern + "top";
                this._topHeight = GAME_ENGINE.game.cache.getBaseTexture(wallTop).height;
                this._wallTileTop = GAME_ENGINE.game.add.tileSprite(
                    topLeft.x,
                    topLeft.y - this._topHeight * this.model.wallHeight,
                    bottomRight.x - topLeft.x,
                    this._topHeight,
                    wallTop);
                if (this.model.wallHeight > 1) {
                    this._sectionHeight = GAME_ENGINE.game.cache.getBaseTexture("room/" + this.model.wallPattern).height;
                    this._wallTile = GAME_ENGINE.game.add.tileSprite(
                        topLeft.x,
                        topLeft.y - this._sectionHeight * (this.model.wallHeight - 1),
                        bottomRight.x - topLeft.x,
                        this._sectionHeight * (this.model.wallHeight - 1),
                        "room/" + this.model.wallPattern);
                }
            }
            this._graphics = GAME_ENGINE.game.add.graphics(0, 0);
        }

        update():void {
            if (checkGlobalOption('debugmode')) {
                this._graphics.clear();
                this._graphics.lineStyle(0, 0x000000, 0);
                this._graphics.beginFill(0xff0000, 0.75);
                twoDForEach(this.model.roomLayout, (cell:RoomNode, x:number, y:number) : void => {
                    if (cell.hasModel()) {
                        var topLeft:Point = roomToScreen(x, y);
                        this._graphics.drawRect(topLeft.x, topLeft.y, GAME_ENGINE.globalData.roomScale[0], GAME_ENGINE.globalData.roomScale[1]);
                    }
                });
                this._graphics.endFill();
            }
            var topLeft : Point = roomToScreen(0, 0);
            this._floorTile.x = topLeft.x;
            this._floorTile.y = topLeft.y;
            if (this.model.wallHeight > 0) {
                this._wallTileTop.x = topLeft.x;
                this._wallTileTop.y = topLeft.y - this._topHeight * this.model.wallHeight;
                if (this.model.wallHeight > 1) {
                    this._wallTile.x = topLeft.x;
                    this._wallTile.y = topLeft.y - this._sectionHeight * (this.model.wallHeight - 1);
                }
            }
        }

        contains(x:number, y:number):boolean {
            return false; // TODO
        }

        enumerateGameObjects():Array<PIXI.DisplayObject> {
            return [this._floorTile, this._wallTile, this._wallTileTop, this._graphics];
        }
    }
}