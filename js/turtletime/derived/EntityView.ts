///<reference path="../abstract/View.ts"/>

module TurtleTime {
    import AnimationManager = Phaser.AnimationManager;

    export interface SpriteDirectionalFrameData {
        direction : Direction,
        frames : Array<number>
    }

    export interface SpriteAnimation {
        name : string,
        frames : Array<SpriteDirectionalFrameData>
    }

    export interface SpriteSpecs {
        spriteID : String,
        scale : number,
        anchor: Array<number>,
        animations : Array<SpriteAnimation>
    }

    export class EntityView extends View<EntityModel> {
        private _mainSprite : Sprite;
        private _highlightCircle : Sprite;

        constructor(model : EntityModel) {
            super(model);
            var specs = model.spriteSpecs;
            this._mainSprite = game.add.sprite(0, 0, specs.spriteID);
            this._mainSprite.anchor = new Point(specs.anchor[0], specs.anchor[1]);
            this._mainSprite.scale = new Point(specs.scale, specs.scale);
            this._highlightCircle = game.add.sprite(0, 0, 'highlightCircle');
            this._highlightCircle.anchor = new Point(0.5, 0.5);
            // add animations
            specs.animations.forEach((animation : SpriteAnimation) : void => {
                animation.frames.forEach((frameData : SpriteDirectionalFrameData) : void => {
                    this._mainSprite.animations.add(Direction.getFirstCharacter(frameData.direction) + '-' + animation.name, frameData.frames);
                });
            });
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

        update() : void {
            this._mainSprite.x = this.model.position.x * COORDINATE_SCALE + COORDINATE_SCALE / 2;
            this._mainSprite.y = this.model.position.y * COORDINATE_SCALE + COORDINATE_SCALE / 2;
            this._highlightCircle.x = this._mainSprite.x;
            this._highlightCircle.y = this._mainSprite.y - 2 * COORDINATE_SCALE * this._mainSprite.scale.y;
            this._mainSprite.animations.play(Direction.getFirstCharacter(this.model.direction) + "-" + this.model.currentAction);
            setTintAndAlpha(this._highlightCircle, EffectCircleDictionary[this.model.currentStatus]);
        }

        bringToTop() : void {
            this._mainSprite.bringToTop();
            this._highlightCircle.bringToTop();
        }
    }
}