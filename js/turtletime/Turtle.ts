module TurtleTime {
    import LoopBrain = TurtleTime.Behavior.LoopBehavior;
    export class Turtle extends Entity {
        brain : LoopBrain;

        constructor(x:number, y:number) {
            super(x, y, {
                spriteID: 'turtle',
                scale: 0.5
            });
            this.currentAction = 'stand';
            this.effect = 'normal';
            var side = 1;
            this.brain = new LoopBrain(0.01, [
                {
                    lowerBoundT: 0,
                    upperBoundT: 0.5,
                    behavior: (innerT : number) => {
                        this.position.x = x + innerT * side;
                        this.position.y = y;
                        this.direction = Direction.Right;
                    }
                },
                {
                    lowerBoundT: 0.5,
                    upperBoundT: 1.0,
                    behavior: (innerT : number) => {
                        this.position.x = x + (1 - innerT) * side;
                        this.position.y = y;
                        this.direction = Direction.Left;
                    }
                }
            ]);
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