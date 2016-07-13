///<reference path="../data/Constants.ts"/>
///<reference path="../core/View.ts"/>
///<reference path="EntitySpriteWrapper.ts"/>
///<reference path="../model/SelectionModel.ts"/>

module TurtleTime {
    import AnimationManager = Phaser.AnimationManager;
    import squareWave = MathExtensions.squareWave;
    import Sprite = Phaser.Sprite;
    import Graphics = Phaser.Graphics;

    export class EntityView extends View<EntityModel> {
        private _mainSprite : EntitySpriteWrapper;
        private _highlightCircle : Sprite;
        private _shadow : Sprite;
        private _bob : boolean = false;

        constructor(model : EntityModel) {
            super(model);
            this._mainSprite = new EntitySpriteWrapper();
            this._mainSprite.reset(model.spriteSpecs);
            this._width = this._mainSprite.width;
            this._height = this._mainSprite.height;
            this._highlightCircle = GAME_ENGINE.game.add.sprite(0, 0, 'highlightCircle');
            this._highlightCircle.anchor = new Point(0.5, 0.5);
            this._shadow = GAME_ENGINE.game.add.sprite(0, 0, 'shadow');
            this._shadow.scale.x = this.model.dimensions.x * this._mainSprite.width / GAME_ENGINE.globalData.roomScale[0] / 2;
            this._shadow.scale.y = this.model.dimensions.y * this._mainSprite.height / GAME_ENGINE.globalData.roomScale[0] / 2;
            this._shadow.anchor = new Point(0.5, 0.25);
            if (this.model.getEntityClass() == EntityType.WallDecor) {
                this._shadow.visible = false;
            }
            if (this.model.getEntityClass() == EntityType.Turtle) { // TODO: BAD CODE
                this._bob = true;
            }
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
            var screenPos : Point;
            if (this.model.getEntityClass() == EntityType.WallDecor) {
                screenPos = wallToScreen(this.model.position.x + this.model.dimensions.x / 2, this.model.position.y + this.model.dimensions.y / 2);
            } else {
                screenPos = roomToScreen(this.model.position.x + this.model.dimensions.x / 2, this.model.position.y + this.model.dimensions.y / 2);
                if (this.model.getEntityClass() == EntityType.Food && (<Food>this.model).table) {
                    screenPos.y -= 10; // account for the height of the table
                }
            }
            this._mainSprite.x = screenPos.x;
            //lo
            var yOffset = this._bob ? (2 * squareWave(((<Turtle>this.model).chair != null && (<Turtle>this.model).chair.food != null ? 16 : 2) * GAME_ENGINE.time)) : 0;
            this._mainSprite.y = screenPos.y - yOffset;
            this._mainSprite.animation = this.model.animationString;
            this._highlightCircle.x = this._mainSprite.x;
            this._highlightCircle.y = this._mainSprite.y - 2 * GAME_ENGINE.globalData.roomScale[1] * this.model.spriteSpecs.scale;
            setTintAndAlpha(this._highlightCircle, EffectCircleDictionary[this.model.currentStatus]);
            this._shadow.x = screenPos.x;
            this._shadow.y = screenPos.y;
            setTintAndAlpha(this._shadow, 0x00000033);
            // sort values
            var sortValue : number = (10000 + this.model.position.y) * 100 + this.model.getEntityClass() * 10;
            this._highlightCircle.name = this._mainSprite.underlyingSprite.name = "" + sortValue;
            this._shadow.name = "" + (sortValue - 1);
        }

        getLayerNumber() : number {
            return LAYER_SPRITE;
        }

        enumerateGameObjects():Array<PIXI.DisplayObject> {
            return [ this._mainSprite.underlyingSprite, this._highlightCircle, this._shadow ];
        }
    }
}