module TurtleTime {
    /**
     * Represents any physical object in the cafe.
     */
    export abstract class Entity {
        public position : Point;
        public direction : Direction;
        public spriteSpecs : SpriteSpecs;
        public currentAction : string;
        public effect : string;
        public sprite : EntityView;

        constructor(x:number, y:number, spriteSpecs:SpriteSpecs) {
            this.position = new Point(x, y);
            this.spriteSpecs = spriteSpecs;
            this.direction = Direction.Down;
            this.effect = "hidden";
        }

        assignSprite() : void {
            this.sprite = new EntityView(this.spriteSpecs);
            this.updateView();
        }

        updateView() : void {
            this.sprite.update(this);
        }
    }
}
