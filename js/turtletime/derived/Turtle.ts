module TurtleTime {
    import LoopBrain = TurtleTime.Behavior.LoopBehavior;
    export class Turtle extends EntityModel {
        brain : LoopBrain;

        constructor(x:number, y:number) {
            super(x, y, {
                spriteID: 'turtle',
                scale: 1.0,
                animations: [
                    {
                        name: "stand",
                        frames: [
                            { direction: Direction.Left, frames: [0] },
                            { direction: Direction.Down, frames: [1] },
                            { direction: Direction.Right, frames: [2] },
                            { direction: Direction.Up, frames: [3] }
                        ]
                    }
                ]
            });
            this.currentAction = 'stand';
            this.effect = 'normal';
            var side = 1;
            this.brain = new LoopBrain(0.001, [
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
    }
}