///<reference path="../Utils.ts"/>
///<reference path="../data/SpriteSpecs.ts"/>

module TurtleTime {
    // A helper class
    import Sprite = Phaser.Sprite;
    export enum MirrorDirection {
        None, Left, Right
    }

    export class EntitySpriteWrapper {
        private _sprite : Sprite;
        private _mirror : MirrorDirection = MirrorDirection.None;

        constructor() {
            this._sprite = GAME_ENGINE.game.add.sprite(0, 0);
        }

        reset(specs : SpriteSpecs) : void {
            if (specs.hasOwnProperty('filter')) {
                this._sprite.loadTexture(specs.spriteID + '-filter');
            } else {
                this._sprite.loadTexture(specs.spriteID);
            }
            this._sprite.anchor = new Point(specs.anchor[0], specs.anchor[1]);
            this._sprite.scale = new Point(specs.scale, specs.scale);
            this._sprite.tint = parseInt(specs.tint);
            this._mirror = MirrorDirection.None;
            // add animations
            specs.animations.forEach((animation : SpriteAnimation) : void => {
                var frameRate = animation.hasOwnProperty("frameRate") ? animation.frameRate : 1;
                animation.frames.forEach((frameData : SpriteDirectionalFrameData) : void => {
                    var numericalDirection : Direction = Direction.getDirection(frameData.direction);
                    if (numericalDirection & Direction.Left || numericalDirection & Direction.Right) {
                        this._sprite.animations.add('left-' + animation.name, frameData.frames, frameRate);
                        this._sprite.animations.add('right-' + animation.name, frameData.frames, frameRate);
                        if (!(numericalDirection & Direction.Right)) {
                            this._mirror = MirrorDirection.Right;
                        } else if (!(numericalDirection & Direction.Left)) {
                            this._mirror = MirrorDirection.Left;
                        }
                    }
                    if (numericalDirection & Direction.Up) { this._sprite.animations.add('up-' + animation.name, frameData.frames, frameRate); }
                    if (numericalDirection & Direction.Down) { this._sprite.animations.add('down-' + animation.name, frameData.frames, frameRate); }
                });
            });
        }

        destroy() : void {
            this._sprite.destroy(); // careful
        }

        get x() : number {
            return this._sprite.x;
        }

        get y() : number {
            return this._sprite.y;
        }

        get anchorX() : number {
            return this._sprite.anchor.x;
        }

        get anchorY() : number {
            return this._sprite.anchor.y;
        }

        get rotation() : number {
            return this._sprite.rotation;
        }

        set x(value : number) {
            this._sprite.x = value;
        }

        set y(value : number) {
            this._sprite.y = value;
        }

        set anchorX(value : number) {
            this._sprite.anchor.x = value;
        }

        set anchorY(value : number) {
            this._sprite.anchor.y = value;
        }

        set rotation(value : number) {
            this._sprite.rotation = value;
        }

        get alpha() : number {
            return this._sprite.alpha;
        }

        set alpha(value : number) {
            this._sprite.alpha = value;
        }

        set animation(value : string) {
            if (value.startsWith("left") && this._mirror == MirrorDirection.Left ||
                value.startsWith("right") && this._mirror == MirrorDirection.Right) {
                this._sprite.scale.x = -Math.abs(this._sprite.scale.x);
            } else {
                this._sprite.scale.x = Math.abs(this._sprite.scale.x);
            }
            this._sprite.play(value);
        }

        get width() : number {
            return this._sprite.scale.x * this._sprite.texture.frame.width;
        }

        get height() : number {
            return this._sprite.scale.y * this._sprite.texture.frame.height;
        }

        get visible() : boolean {
            return this._sprite.visible;
        }

        set visible(value : boolean) {
            this._sprite.visible = value;
        }

        get tint() : number {
            return this._sprite.tint;
        }

        set tint(value : number) {
            this._sprite.tint = value;
        }

        get underlyingSprite() : Sprite {
            return this._sprite;
        }
    }
}