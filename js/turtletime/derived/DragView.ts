module TurtleTime {
    import Sprite = Phaser.Sprite;
    export class DragView extends View<SelectionModel> {
        sprite : EntitySpriteWrapper;

        update() : void {
            if (this.model.isBeingDragged) {
                if (this.sprite == null) {
                    this.sprite = new EntitySpriteWrapper(this.model.entity.spriteSpecs);
                    this.sprite.anchorY -= 0.5;
                    this.sprite.alpha = 0.5;
                }
                this.sprite.x = this.model.currentDragPosition.x;
                this.sprite.y = this.model.currentDragPosition.y;
                this.sprite.rotation += (this.model.deltaDragX / 10 - this.sprite.rotation) / 10;
                this.sprite.animation = this.model.entity.animationString;
            } else if (this.sprite != null) {
                this.sprite.destroy();
                this.sprite = null;
            }
        }

        bringToTop():void {
            if (this.sprite != null) {
                this.sprite.bringToTop();
            }
        }
    }
}