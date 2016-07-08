///<reference path="../abstract/View.ts"/>

module TurtleTime {
    import AnimationManager = Phaser.AnimationManager;

    export class EntityView extends View<EntityModel> {
        private _mainSprite : EntitySpriteWrapper;
        private _highlightCircle : Sprite;

        constructor(model : EntityModel) {
            super(model);
            this._mainSprite = new EntitySpriteWrapper(model.spriteSpecs);
            this._width = this._mainSprite.width;
            this._height = this._mainSprite.height;
            this._highlightCircle = game.add.sprite(0, 0, 'highlightCircle');
            this._highlightCircle.anchor = new Point(0.5, 0.5);
        }

        get x() : number {
            return this._mainSprite.x;
        }

        get y() : number {
            return this._mainSprite.y;
        }

        contains(x : number, y : number) : boolean {
            return Math.abs(x - this.x) <= this.width / 2 && Math.abs(y - this.y) <= this.height / 2;
        }

        update() : void {
            var screenPos : Point = roomToScreenXY(this.model.position.x + 0.5, this.model.position.y + 0.5);
            this._mainSprite.x = screenPos.x;
            this._mainSprite.y = screenPos.y;
            this._mainSprite.animation = this.model.animationString;
            this._highlightCircle.x = this._mainSprite.x;
            this._highlightCircle.y = this._mainSprite.y - 2 * gameData.roomScale * this.model.spriteSpecs.scale;
            setTintAndAlpha(this._highlightCircle, EffectCircleDictionary[this.model.currentStatus]);
        }

        bringToTop() : void {
            this._mainSprite.bringToTop();
            this._highlightCircle.bringToTop();
        }
    }
}