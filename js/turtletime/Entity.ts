module TurtleTime {
    /**
     * Represents any physical object in the cafe.
     */
    export abstract class Entity {
        public position : Point;
        public direction : Direction;
        public spriteID : String;
        public currentAction : String;
        public effect : String;
        public sprite : EntityView;

        constructor(x:number, y:number, spriteID:String) {
            this.position = new Point(x, y);
            this.spriteID = spriteID;
            this.direction = Direction.Down;
        }

        assignSprite() : void {
            this.sprite = new EntityView(this.spriteID);
            this.updateView();
        }

        updateView() : void {
            this.sprite.update(this);
        }
    }
}
