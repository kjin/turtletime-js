module TurtleTime {
    import AnimationManager = Phaser.AnimationManager;
    export class EntityView {
        private _mainSprite : Sprite;
        private _highlightCircle : Sprite;

        constructor(spriteID : String) {
            this._mainSprite = game.add.sprite(0, 0, spriteID);
            this._highlightCircle = game.add.sprite(0, 0, 'highlightCircle');
        }

        get animations() : AnimationManager {
            return this._mainSprite.animations;
        }

        update(entity : Entity) : void {
            this._mainSprite.x = entity.position.x;
            this._mainSprite.y = entity.position.y;
            this._highlightCircle.x = this._mainSprite.x +
                (this._mainSprite.texture.frame.width / 2 - this._highlightCircle.texture.frame.width / 2);
            this._highlightCircle.y = this._mainSprite.y - this._highlightCircle.texture.frame.height - 5;
            this._mainSprite.animations.play(getFirstCharacter(entity.direction) + "-" + entity.currentAction);
        }
    }
}