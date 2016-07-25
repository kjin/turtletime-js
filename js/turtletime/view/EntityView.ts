///<reference path="../data/Constants.ts"/>
///<reference path="../core/View.ts"/>
///<reference path="EntitySpriteWrapper.ts"/>
///<reference path="../model/SelectionModel.ts"/>

module TurtleTime {
    import AnimationManager = Phaser.AnimationManager;
    import Sprite = Phaser.Sprite;
    import Graphics = Phaser.Graphics;

    export class EntityView extends View<EntityModel> {
        protected _mainSprite : EntitySpriteWrapper;
        protected _shadow : Sprite;

        constructor(model : EntityModel) {
            super(model);
            this._mainSprite = new EntitySpriteWrapper();
            this._mainSprite.reset(model.spriteSpecs);
            this._width = this._mainSprite.width;
            this._height = this._mainSprite.height;
            this._shadow = GAME_ENGINE.game.add.sprite(0, 0, 'core/shadow');
            this._shadow.scale.x = (this._mainSprite.width) / this._shadow.width;
            this._shadow.scale.y = this._mainSprite.height / this._shadow.height;
            this._shadow.anchor = new Point(this._mainSprite.anchorX, this._mainSprite.anchorY);
            if (this.model.getEntityClass() == EntityType.WallDecor) {
                this._shadow.visible = false;
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
            var onWall = false;
            if (this.model.getEntityClass() == EntityType.WallDecor) {
                onWall = true;
                screenPos = wallToScreen(this.model.position.x + this.model.width / 2, this.model.position.y + this.model.height / 2);
            } else {
                screenPos = roomToScreen(this.model.position.x + this.model.width / 2, this.model.position.y + this.model.height / 2);
                if (this.model.getEntityClass() == EntityType.Food && (<Food>this.model).table) {
                    screenPos.y -= 10; // account for the height of the table
                }
            }
            this._mainSprite.x = screenPos.x;
            this._mainSprite.y = screenPos.y;
            this._mainSprite.animation = this.model.animationString;
            this._shadow.x = screenPos.x;
            this._shadow.y = screenPos.y + 4;
            setTintAndAlpha(this._shadow, 0x00000033);
            // sort values
            // TODO please do this right
            var sortValue : number = ((onWall ? 10000 : 20000) + this.model.position.y + this.model.height - 1) * 100 + this.model.getEntityClass() * 10;
            this._mainSprite.underlyingSprite.name = "" + sortValue;
            this._shadow.name = "" + (sortValue - 1);
            this.updatePrivate(screenPos, sortValue);
        }

        protected updatePrivate(screenPos : Point, sortValue : number) : void {}

        getLayerNumber() : number {
            return LAYER_SPRITE;
        }

        enumerateGameObjects():Array<PIXI.DisplayObject> {
            return [ this._mainSprite.underlyingSprite, this._shadow ];
        }
    }
}