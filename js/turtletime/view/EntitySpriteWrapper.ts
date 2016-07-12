///<reference path="../Utils.ts"/>
///<reference path="../data/SpriteSpecs.ts"/>

module TurtleTime {
    // A helper class
    export class EntitySpriteWrapper {
        private _sprite : Sprite;

        constructor(specs : SpriteSpecs) {
            this._sprite = game.add.sprite(0, 0, specs.spriteID);
            this._sprite.anchor = new Point(specs.anchor[0], specs.anchor[1]);
            this._sprite.scale = new Point(specs.scale, specs.scale);
            // add animations
            specs.animations.forEach((animation : SpriteAnimation) : void => {
                animation.frames.forEach((frameData : SpriteDirectionalFrameData) : void => {
                    var numericalDirection : Direction = Direction.getDirection(frameData.direction);
                    if (numericalDirection & Direction.Left) { this._sprite.animations.add('left-' + animation.name, frameData.frames); }
                    if (numericalDirection & Direction.Right) { this._sprite.animations.add('right-' + animation.name, frameData.frames); }
                    if (numericalDirection & Direction.Up) { this._sprite.animations.add('up-' + animation.name, frameData.frames); }
                    if (numericalDirection & Direction.Down) { this._sprite.animations.add('down-' + animation.name, frameData.frames); }
                });
            });
        }

        bringToTop() : void {
            this._sprite.bringToTop();
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
            this._sprite.play(value);
        }

        get width() : number {
            return this._sprite.scale.x * this._sprite.texture.frame.width;
        }

        get height() : number {
            return this._sprite.scale.y * this._sprite.texture.frame.height;
        }
    }
}