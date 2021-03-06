module TurtleTime {
    import Sprite = Phaser.Sprite;
    export class TurtleView extends EntityView {
        private _highlightCircle : Sprite;
        private _attentionBubble : Sprite;
        private _currentMood : string;
        private _emoji : Sprite;
        private _attentionTriangle : (x : number) => number;

        constructor(model : EntityModel) {
            super(model);
            this._highlightCircle = GAME_ENGINE.game.add.sprite(0, 0, 'core/highlightCircle');
            this._highlightCircle.anchor = new Point(0.5, 0.5);
            this._attentionBubble = GAME_ENGINE.game.add.sprite(0, 0, 'core/speechBubble');
            this._attentionBubble.anchor = new Point(0.5, 1);
            this._attentionBubble.scale.x = 2;
            this._attentionBubble.scale.y = 2;
            this._currentMood = (<Turtle>this.model).mood.getHighestMood();
            this._emoji = GAME_ENGINE.game.add.sprite(0, 0, GAME_ENGINE.globalData.spriteSpecs.getSpriteSpecs('emoji', this._currentMood).spriteID);
            this._emoji.anchor = new Point(0.5, 0.5);
            this._emoji.scale.x = 2;
            this._emoji.scale.y = 2;
            this._attentionTriangle = MathExtensions.triangleWaveFactory(0.8);
        }
        
        protected updatePrivate(screenPos : Point, sortValue : number) : void {
            if (this.model.currentAction == "stand") {
                this._mainSprite.y -= 2 * MathExtensions.squareWave(1.5 * GAME_ENGINE.time);
            }
            this._highlightCircle.x = screenPos.x;
            this._highlightCircle.y = screenPos.y - 2 * GAME_ENGINE.globalData.roomScale[1];
            setTintAndAlpha(this._highlightCircle, EffectCircleDictionary[this.model.selectionStatus]);
            this._highlightCircle.data = sortValue;
            this._attentionBubble.x = screenPos.x;
            this._attentionBubble.y = screenPos.y - 2 * GAME_ENGINE.globalData.roomScale[1] - 3 * this._attentionTriangle(2.4 * GAME_ENGINE.time);
            this._attentionBubble.data = sortValue;
            this._emoji.x = this._attentionBubble.x;
            this._emoji.y = this._attentionBubble.y - 19;
            this._emoji.data = sortValue + 1;
            if ((<Turtle>this.model).mood.getHighestMood() != this._currentMood) {
                this._currentMood = (<Turtle>this.model).mood.getHighestMood();
                this._emoji.loadTexture(GAME_ENGINE.globalData.spriteSpecs.getSpriteSpecs('emoji', this._currentMood).spriteID);
            }
        }

        enumerateGameObjects() : Array<PIXI.DisplayObject> {
            return super.enumerateGameObjects().concat(this._highlightCircle, this._attentionBubble, this._emoji);
        }
    }
}