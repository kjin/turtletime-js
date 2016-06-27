module TurtleTime {
    export class Turtle extends Entity {
        constructor(x:number, y:number) {
            super(x, y, 'turtle');
            this.currentAction = 'stand';
        }

        assignSprite() : void {
            super.assignSprite();
            this.sprite.animations.add('l-stand', [0]);
            this.sprite.animations.add('d-stand', [1]);
            this.sprite.animations.add('r-stand', [2]);
            this.sprite.animations.add('u-stand', [3]);
        }
    }
}