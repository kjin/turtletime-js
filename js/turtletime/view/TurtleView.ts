module TurtleTime {
    import Sprite = Phaser.Sprite;
    export class TurtleView extends EntityView {
        private _highlightCircle : Sprite;

        constructor(model : EntityModel) {
            super(model);
            this._highlightCircle = GAME_ENGINE.game.add.sprite(0, 0, 'highlightCircle');
            this._highlightCircle.anchor = new Point(0.5, 0.5);
        }
        
        protected updatePrivate(screenPos : Point, sortValue : number) : void {
            this._mainSprite.y -= 2 * MathExtensions.squareWave(((<Turtle>this.model).chair != null && (<Turtle>this.model).chair.food != null ? 16 : 2) * GAME_ENGINE.time);
            this._highlightCircle.x = screenPos.x;
            this._highlightCircle.y = screenPos.y - 2 * GAME_ENGINE.globalData.roomScale[1] * this.model.spriteSpecs.scale;
            setTintAndAlpha(this._highlightCircle, EffectCircleDictionary[this.model.currentStatus]);
            this._highlightCircle.name = "" + sortValue;
        }

        enumerateGameObjects() : Array<PIXI.DisplayObject> {
            return super.enumerateGameObjects().concat(this._highlightCircle);
        }
    }
}