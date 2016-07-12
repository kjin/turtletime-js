///<reference path="../core/View.ts"/>
///<reference path="EntitySpriteWrapper.ts"/>
///<reference path="../model/SelectionModel.ts"/>

module TurtleTime {
    import Sprite = Phaser.Sprite;
    export class DragView extends View<SelectionModel> {
        _sprite : EntitySpriteWrapper;
        _graphics : Phaser.Graphics;
        _time : number = 0;

        constructor(model : SelectionModel) {
            super(model);
            this._graphics = GAME_ENGINE.game.add.graphics(0, 0);
        }

        update() : void {
            if (this.model.isBeingDragged) {
                if (this._sprite == null) {
                    this._sprite = new EntitySpriteWrapper(this.model.entity.spriteSpecs);
                    this._sprite.anchorY -= 0.5;
                    this._sprite.alpha = 0.5;
                }
                this._sprite.x = this.model.currentDragPosition.x;
                this._sprite.y = this.model.currentDragPosition.y;
                this._sprite.rotation += (this.model.deltaDragX / 10 - this._sprite.rotation) / 10;
                this._sprite.animation = this.model.entity.animationString;
                // draw the "shadow"
                var topLeft:Point = roomToScreen(this.model.currentDragPositionInRoom.x, this.model.currentDragPositionInRoom.y);
                var t = MathExtensions.sawtoothWave(this._time / 2);
                this._graphics.clear();
                this._graphics.beginFill(0x6666ff, 1 - t);
                this._graphics.drawEllipse(
                    topLeft.x + GAME_ENGINE.globalData.roomScale[0] / 2,
                    topLeft.y + GAME_ENGINE.globalData.roomScale[1] / 2,
                    t * GAME_ENGINE.globalData.roomScale[0] / 1.5,
                    t * GAME_ENGINE.globalData.roomScale[1] / 1.5);
                this._graphics.endFill();
            } else if (this._sprite != null) {
                this._sprite.destroy();
                this._sprite = null;
                this._graphics.clear();
            }
            this._time += 0.05;
        }

        bringToTop():void {
            if (this._sprite != null) {
                this._sprite.bringToTop();
            }
        }
    }
}