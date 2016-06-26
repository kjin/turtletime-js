/**
 * Created by kjin on 6/25/2016.
 */

module TurtleTime {
    export class Entity {
        position : Point;
        direction : Direction;
        spriteID : String;
        currentAction : String;
        sprite : Sprite;

        assignSprite(sprite : Sprite) : void {
            this.sprite = sprite;
            updateSprite();
        }

        updateSprite() : void {

        }
    }
}
