module TurtleTime {
    import AnimationManager = Phaser.AnimationManager;
    export interface SpriteSpecs {
        spriteID : String;
        scale : number;
    }

    export class EntityView {
        private _mainSprite : Sprite;
        private _highlightCircle : Sprite;

        constructor(specs : SpriteSpecs) {
            this._mainSprite = game.add.sprite(0, 0, specs.spriteID);
            this._mainSprite.anchor = new Point(0.5, 0.5);
            this._mainSprite.scale = new Point(specs.scale, specs.scale);
            this._highlightCircle = game.add.sprite(0, 0, 'highlightCircle');
            this._highlightCircle.anchor = new Point(0.5, 0.5);
        }

        get animations() : AnimationManager {
            return this._mainSprite.animations;
        }

        get x() : number {
            return this._mainSprite.x;
        }

        get y() : number {
            return this._mainSprite.y;
        }

        get width() : number {
            return this._mainSprite.scale.x * this._mainSprite.texture.frame.width;
        }

        get height() : number {
            return this._mainSprite.scale.y * this._mainSprite.texture.frame.height;
        }

        contains(x : number, y : number) : boolean {
            return Math.abs(x - this.x) <= this.width / 2 && Math.abs(y - this.y) <= this.height / 2;
        }

        update(entity : Entity) : void {
            this._mainSprite.x = entity.position.x * COORDINATE_SCALE;
            this._mainSprite.y = entity.position.y * COORDINATE_SCALE;
            this._highlightCircle.x = this._mainSprite.x;
            this._highlightCircle.y = this._mainSprite.y - 2 * COORDINATE_SCALE * this._mainSprite.scale.y;
            this._mainSprite.animations.play(getFirstCharacter(entity.direction) + "-" + entity.currentAction);
            setTintAndAlpha(this._highlightCircle, EffectCircleDictionary[entity.effect]);
        }
    }
}