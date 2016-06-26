module TurtleTime {
    /**
     * Represents any physical object in the cafe.
     */
    export class Entity {
        protected position : Point;
        protected direction : Direction;
        protected spriteID : String;
        protected currentAction : String;
        protected sprite : Sprite;

        constructor(x:number, y:number) {
            this.position = new Point(x, y);
        }

        assignSprite(sprite : Sprite) : void {
            this.sprite = sprite;
            this.updateSprite();
        }

        updateSprite() : void {
            this.sprite.x = this.position.x;
            this.sprite.y = this.position.y;
        }
    }
}
